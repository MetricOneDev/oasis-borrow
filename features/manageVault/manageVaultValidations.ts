import { isNullish } from 'helpers/functions'
import { zero } from 'helpers/zero'

import { ManageVaultState } from './manageVault'

export type ManageVaultErrorMessage =
  | 'depositAmountExceedsCollateralBalance'
  | 'withdrawAmountExceedsFreeCollateral'
  | 'withdrawAmountExceedsFreeCollateralAtNextPrice'
  | 'generateAmountExceedsStblYieldFromTotalCollateral'
  | 'generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice'
  | 'generateAmountExceedsDebtCeiling'
  | 'generateAmountLessThanDebtFloor'
  | 'paybackAmountExceedsStblBalance'
  | 'paybackAmountExceedsVaultDebt'
  | 'debtWillBeLessThanDebtFloor'
  | 'customCollateralAllowanceAmountExceedsMaxUint256'
  | 'customCollateralAllowanceAmountLessThanDepositAmount'
  | 'customStblAllowanceAmountExceedsMaxUint256'
  | 'customStblAllowanceAmountLessThanPaybackAmount'
  | 'depositingAllCoinBalance'
  | 'ledgerWalletContractDataDisabled'
  | 'withdrawCollateralOnVaultUnderDebtFloor'
  | 'depositCollateralOnVaultUnderDebtFloor'

export type ManageVaultWarningMessage =
  | 'potentialGenerateAmountLessThanDebtFloor'
  | 'debtIsLessThanDebtFloor'
  | 'vaultWillBeAtRiskLevelDanger'
  | 'vaultWillBeAtRiskLevelWarning'
  | 'vaultWillBeAtRiskLevelDangerAtNextPrice'
  | 'vaultWillBeAtRiskLevelWarningAtNextPrice'

export function validateErrors(state: ManageVaultState): ManageVaultState {
  const {
    stage,
    withdrawAmountExceedsFreeCollateral,
    withdrawAmountExceedsFreeCollateralAtNextPrice,
    generateAmountExceedsStblYieldFromTotalCollateral,
    generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice,
    generateAmountLessThanDebtFloor,
    debtWillBeLessThanDebtFloor,
    isEditingStage,
    customCollateralAllowanceAmountExceedsMaxUint256,
    customCollateralAllowanceAmountLessThanDepositAmount,
    customStblAllowanceAmountExceedsMaxUint256,
    customStblAllowanceAmountLessThanPaybackAmount,
    depositAmountExceedsCollateralBalance,
    depositingAllCoinBalance,
    generateAmountExceedsDebtCeiling,
    paybackAmountExceedsStblBalance,
    paybackAmountExceedsVaultDebt,
    withdrawCollateralOnVaultUnderDebtFloor,
    depositCollateralOnVaultUnderDebtFloor,
  } = state

  const errorMessages: ManageVaultErrorMessage[] = []

  if (isEditingStage) {
    if (depositAmountExceedsCollateralBalance) {
      errorMessages.push('depositAmountExceedsCollateralBalance')
    }

    if (withdrawAmountExceedsFreeCollateral) {
      errorMessages.push('withdrawAmountExceedsFreeCollateral')
    }

    if (withdrawAmountExceedsFreeCollateralAtNextPrice) {
      errorMessages.push('withdrawAmountExceedsFreeCollateralAtNextPrice')
    }

    if (generateAmountExceedsStblYieldFromTotalCollateral) {
      errorMessages.push('generateAmountExceedsStblYieldFromTotalCollateral')
    }

    if (generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice) {
      errorMessages.push('generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice')
    }

    if (generateAmountExceedsDebtCeiling) {
      errorMessages.push('generateAmountExceedsDebtCeiling')
    }

    if (generateAmountLessThanDebtFloor) {
      errorMessages.push('generateAmountLessThanDebtFloor')
    }

    if (paybackAmountExceedsStblBalance) {
      errorMessages.push('paybackAmountExceedsStblBalance')
    }

    if (paybackAmountExceedsVaultDebt) {
      errorMessages.push('paybackAmountExceedsVaultDebt')
    }

    if (depositingAllCoinBalance) {
      errorMessages.push('depositingAllCoinBalance')
    }

    if (debtWillBeLessThanDebtFloor) {
      errorMessages.push('debtWillBeLessThanDebtFloor')
    }

    if (withdrawCollateralOnVaultUnderDebtFloor) {
      errorMessages.push('withdrawCollateralOnVaultUnderDebtFloor')
    }
    if (depositCollateralOnVaultUnderDebtFloor) {
      errorMessages.push('depositCollateralOnVaultUnderDebtFloor')
    }
  }

  if (stage === 'collateralAllowanceWaitingForConfirmation') {
    if (customCollateralAllowanceAmountExceedsMaxUint256) {
      errorMessages.push('customCollateralAllowanceAmountExceedsMaxUint256')
    }
    if (customCollateralAllowanceAmountLessThanDepositAmount) {
      errorMessages.push('customCollateralAllowanceAmountLessThanDepositAmount')
    }
  }

  if (stage === 'stblAllowanceWaitingForConfirmation') {
    if (customStblAllowanceAmountExceedsMaxUint256) {
      errorMessages.push('customStblAllowanceAmountExceedsMaxUint256')
    }
    if (customStblAllowanceAmountLessThanPaybackAmount) {
      errorMessages.push('customStblAllowanceAmountLessThanPaybackAmount')
    }
  }

  if (
    stage === 'manageFailure' ||
    stage === 'proxyFailure' ||
    stage === 'stblAllowanceFailure' ||
    stage === 'collateralAllowanceFailure'
  ) {
    if (state.txError?.name === 'CoinAppPleaseEnableContractData') {
      errorMessages.push('ledgerWalletContractDataDisabled')
    }
  }

  return { ...state, errorMessages }
}

export function validateWarnings(state: ManageVaultState): ManageVaultState {
  const {
    depositAmount,
    vault,
    ilkData,
    errorMessages,
    isEditingStage,
    vaultWillBeAtRiskLevelDanger,
    vaultWillBeAtRiskLevelDangerAtNextPrice,
    vaultWillBeAtRiskLevelWarning,
    vaultWillBeAtRiskLevelWarningAtNextPrice,
    maxGenerateAmountAtCurrentPrice,
  } = state

  const warningMessages: ManageVaultWarningMessage[] = []

  if (errorMessages.length) return { ...state, warningMessages }

  if (isEditingStage) {
    if (!isNullish(depositAmount) && maxGenerateAmountAtCurrentPrice.lt(ilkData.debtFloor)) {
      warningMessages.push('potentialGenerateAmountLessThanDebtFloor')
    }

    if (vault.debt.lt(ilkData.debtFloor) && vault.debt.gt(zero)) {
      warningMessages.push('debtIsLessThanDebtFloor')
    }

    if (vaultWillBeAtRiskLevelDanger) {
      warningMessages.push('vaultWillBeAtRiskLevelDanger')
    }

    if (vaultWillBeAtRiskLevelDangerAtNextPrice) {
      warningMessages.push('vaultWillBeAtRiskLevelDangerAtNextPrice')
    }

    if (vaultWillBeAtRiskLevelWarning) {
      warningMessages.push('vaultWillBeAtRiskLevelWarning')
    }

    if (vaultWillBeAtRiskLevelWarningAtNextPrice) {
      warningMessages.push('vaultWillBeAtRiskLevelWarningAtNextPrice')
    }
  }
  return { ...state, warningMessages }
}
