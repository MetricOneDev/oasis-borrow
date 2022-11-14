import { maxUint256 } from 'blockchain/calls/erc20'
import { TxHelpers } from 'components/AppContext'
import { zero } from 'helpers/zero'
import { Observable } from 'rxjs'

import { ManageVaultChange, ManageVaultEditingStage, ManageVaultState } from './manageVault'
import { manageVaultFormDefaults } from './manageVaultForm'
import {
  manageVaultDepositAndGenerate,
  manageVaultWithdrawAndPayback,
} from './manageVaultTransactions'

export type ManageVaultTransitionChange =
  | {
      kind: 'toggleEditing'
    }
  | {
      kind: 'progressEditing'
    }
  | {
      kind: 'progressProxy'
    }
  | {
      kind: 'progressCollateralAllowance'
    }
  | {
      kind: 'backToEditing'
    }
  | {
      kind: 'resetToEditing'
    }
  | {
      kind: 'regressCollateralAllowance'
    }
  | {
      kind: 'regressStblAllowance'
    }

export function applyManageVaultTransition(
  change: ManageVaultChange,
  state: ManageVaultState,
): ManageVaultState {
  if (change.kind === 'toggleEditing') {
    const { stage } = state
    const currentEditing = stage
    const otherEditing = (['collateralEditing', 'stblEditing'] as ManageVaultEditingStage[]).find(
      (editingStage) => editingStage !== currentEditing,
    ) as ManageVaultEditingStage
    return {
      ...state,
      ...manageVaultFormDefaults,
      stage: otherEditing,
      originalEditingStage: otherEditing,
    }
  }

  if (change.kind === 'backToEditing') {
    const { originalEditingStage } = state
    return {
      ...state,
      stage: originalEditingStage,
    }
  }

  if (change.kind === 'regressCollateralAllowance') {
    const { originalEditingStage, stage } = state

    return {
      ...state,
      ...(stage === 'collateralAllowanceFailure'
        ? { stage: 'collateralAllowanceWaitingForConfirmation' }
        : {
            stage: originalEditingStage,
            collateralAllowanceAmount: maxUint256,
            selectedCollateralAllowanceRadio: 'unlimited',
          }),
    }
  }

  if (change.kind === 'regressStblAllowance') {
    const { originalEditingStage, stage } = state

    return {
      ...state,
      ...(stage === 'stblAllowanceFailure'
        ? { stage: 'stblAllowanceWaitingForConfirmation' }
        : {
            stage: originalEditingStage,
            stblAllowanceAmount: maxUint256,
            selectedStblAllowanceRadio: 'unlimited',
          }),
    }
  }

  if (change.kind === 'resetToEditing') {
    const { originalEditingStage } = state
    return {
      ...state,
      ...manageVaultFormDefaults,
      stage: originalEditingStage,
    }
  }

  if (change.kind === 'progressEditing') {
    const {
      errorMessages,
      proxyAddress,
      depositAmount,
      paybackAmount,
      collateralAllowance,
      stblAllowance,
      vault: { token, debtOffset },
    } = state
    const canProgress = !errorMessages.length
    const hasProxy = !!proxyAddress

    const isDepositZero = depositAmount ? depositAmount.eq(zero) : true
    const isPaybackZero = paybackAmount ? paybackAmount.eq(zero) : true

    const depositAmountLessThanCollateralAllowance =
      collateralAllowance && depositAmount && collateralAllowance.gte(depositAmount)

    const paybackAmountLessThanStblAllowance =
      stblAllowance && paybackAmount && stblAllowance.gte(paybackAmount.plus(debtOffset))

    const hasCollateralAllowance =
      token === 'MTR' ? true : depositAmountLessThanCollateralAllowance || isDepositZero

    const hasStblAllowance = paybackAmountLessThanStblAllowance || isPaybackZero

    if (canProgress) {
      if (!hasProxy) {
        return { ...state, stage: 'proxyWaitingForConfirmation' }
      }
      if (!hasCollateralAllowance) {
        return { ...state, stage: 'collateralAllowanceWaitingForConfirmation' }
      }
      if (!hasStblAllowance) {
        return { ...state, stage: 'stblAllowanceWaitingForConfirmation' }
      }
      return { ...state, stage: 'manageWaitingForConfirmation' }
    }
  }

  if (change.kind === 'progressProxy') {
    const {
      originalEditingStage,
      depositAmount,
      paybackAmount,
      collateralAllowance,
      stblAllowance,
      vault: { token, debtOffset },
    } = state
    const isDepositZero = depositAmount ? depositAmount.eq(zero) : true
    const isPaybackZero = paybackAmount ? paybackAmount.eq(zero) : true

    const depositAmountLessThanCollateralAllowance =
      collateralAllowance && depositAmount && collateralAllowance.gte(depositAmount)
    const paybackAmountLessThanStblAllowance =
      stblAllowance && paybackAmount && stblAllowance.gte(paybackAmount.plus(debtOffset))
    const hasCollateralAllowance =
      token === 'MTR' ? true : depositAmountLessThanCollateralAllowance || isDepositZero
    const hasStblAllowance = paybackAmountLessThanStblAllowance || isPaybackZero

    if (!hasCollateralAllowance) {
      return { ...state, stage: 'collateralAllowanceWaitingForConfirmation' }
    }
    if (!hasStblAllowance) {
      return { ...state, stage: 'stblAllowanceWaitingForConfirmation' }
    }
    return { ...state, stage: originalEditingStage }
  }

  if (change.kind === 'progressCollateralAllowance') {
    const {
      originalEditingStage,
      paybackAmount,
      stblAllowance,
      vault: { debtOffset },
    } = state
    const isPaybackZero = paybackAmount ? paybackAmount.eq(zero) : true
    const paybackAmountLessThanStblAllowance =
      stblAllowance && paybackAmount && stblAllowance.gte(paybackAmount.plus(debtOffset))
    const hasStblAllowance = paybackAmountLessThanStblAllowance || isPaybackZero

    if (!hasStblAllowance) {
      return { ...state, stage: 'stblAllowanceWaitingForConfirmation' }
    }
    return { ...state, stage: originalEditingStage }
  }

  return state
}

export function progressManage(
  txHelpers$: Observable<TxHelpers>,
  state: ManageVaultState,
  change: (ch: ManageVaultChange) => void,
) {
  const { depositAmount, generateAmount } = state
  const isDepositAndGenerate = depositAmount || generateAmount

  if (isDepositAndGenerate) {
    return manageVaultDepositAndGenerate(txHelpers$, change, state)
  } else {
    return manageVaultWithdrawAndPayback(txHelpers$, change, state)
  }
}
