import { BigNumber } from 'bignumber.js'
import { maxUint256 } from 'blockchain/calls/erc20'

import { ManageVaultChange, ManageVaultState } from './manageVault'

export const allowanceDefaults: Partial<ManageVaultState> = {
  collateralAllowanceAmount: maxUint256,
  stblAllowanceAmount: maxUint256,
}

interface StblAllowanceChange {
  kind: 'stblAllowance'
  stblAllowanceAmount?: BigNumber
}

interface StblAllowanceUnlimitedChange {
  kind: 'stblAllowanceUnlimited'
}

interface StblAllowancePaybackChange {
  kind: 'stblAllowanceAsPaybackAmount'
}

interface StblAllowanceReset {
  kind: 'stblAllowanceReset'
}

interface CollateralAllowanceChange {
  kind: 'collateralAllowance'
  collateralAllowanceAmount?: BigNumber
}

interface CollateralAllowanceUnlimitedChange {
  kind: 'collateralAllowanceUnlimited'
}

interface CollateralAllowanceDepositChange {
  kind: 'collateralAllowanceAsDepositAmount'
}

interface CollateralAllowanceReset {
  kind: 'collateralAllowanceReset'
}

export type ManageVaultAllowanceChange =
  | StblAllowanceChange
  | StblAllowanceUnlimitedChange
  | StblAllowancePaybackChange
  | StblAllowanceReset
  | CollateralAllowanceChange
  | CollateralAllowanceUnlimitedChange
  | CollateralAllowanceDepositChange
  | CollateralAllowanceReset

export function applyManageVaultAllowance(
  change: ManageVaultChange,
  state: ManageVaultState,
): ManageVaultState {
  if (change.kind === 'collateralAllowance') {
    const { collateralAllowanceAmount } = change
    return {
      ...state,
      collateralAllowanceAmount,
    }
  }

  if (change.kind === 'collateralAllowanceAsDepositAmount') {
    const { depositAmount } = state
    return {
      ...state,
      selectedCollateralAllowanceRadio: 'depositAmount',
      collateralAllowanceAmount: depositAmount,
    }
  }

  if (change.kind === 'collateralAllowanceUnlimited') {
    return {
      ...state,
      selectedCollateralAllowanceRadio: 'unlimited',
      collateralAllowanceAmount: maxUint256,
    }
  }

  if (change.kind === 'collateralAllowanceReset') {
    return {
      ...state,
      selectedCollateralAllowanceRadio: 'custom',
      collateralAllowanceAmount: undefined,
    }
  }

  if (change.kind === 'stblAllowance') {
    const { stblAllowanceAmount } = change
    return {
      ...state,
      stblAllowanceAmount: stblAllowanceAmount,
    }
  }

  if (change.kind === 'stblAllowanceAsPaybackAmount') {
    const {
      paybackAmount,
      vault: { debtOffset },
    } = state
    return {
      ...state,
      selectedStblAllowanceRadio: 'paybackAmount',
      stblAllowanceAmount: paybackAmount!.plus(debtOffset),
    }
  }

  if (change.kind === 'stblAllowanceUnlimited') {
    return {
      ...state,
      selectedStblAllowanceRadio: 'unlimited',
      stblAllowanceAmount: maxUint256,
    }
  }

  if (change.kind === 'stblAllowanceReset') {
    return {
      ...state,
      selectedStblAllowanceRadio: 'custom',
      stblAllowanceAmount: undefined,
    }
  }

  return state
}
