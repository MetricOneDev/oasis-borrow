import { maxUint256 } from 'blockchain/calls/erc20'
import { UnreachableCaseError } from 'helpers/UnreachableCaseError'
import { zero } from 'helpers/zero'

import { OpenVaultStage, OpenVaultState } from './openVault'

const defaultOpenVaultStageCategories = {
  isEditingStage: false,
  isProxyStage: false,
  isAllowanceStage: false,
  isOpenStage: false,
}

export function applyOpenVaultStageCategorisation(state: OpenVaultState) {
  switch (state.stage) {
    case 'editing':
      return {
        ...state,
        ...defaultOpenVaultStageCategories,
        isEditingStage: true,
      }
    case 'proxyWaitingForConfirmation':
    case 'proxyWaitingForApproval':
    case 'proxyInProgress':
    case 'proxyFailure':
    case 'proxySuccess':
      return {
        ...state,
        ...defaultOpenVaultStageCategories,
        isProxyStage: true,
      }
    case 'allowanceWaitingForConfirmation':
    case 'allowanceWaitingForApproval':
    case 'allowanceInProgress':
    case 'allowanceFailure':
    case 'allowanceSuccess':
      return {
        ...state,
        ...defaultOpenVaultStageCategories,
        isAllowanceStage: true,
      }
    case 'openWaitingForConfirmation':
    case 'openWaitingForApproval':
    case 'openInProgress':
    case 'openFailure':
    case 'openSuccess':
      return {
        ...state,
        ...defaultOpenVaultStageCategories,
        isOpenStage: true,
      }
    default:
      throw new UnreachableCaseError(state.stage)
  }
}

export interface OpenVaultConditions {
  isEditingStage: boolean
  isProxyStage: boolean
  isAllowanceStage: boolean
  isOpenStage: boolean

  inputAmountsEmpty: boolean

  vaultWillBeAtRiskLevelWarning: boolean
  vaultWillBeAtRiskLevelDanger: boolean
  vaultWillBeUnderCollateralized: boolean

  vaultWillBeAtRiskLevelWarningAtNextPrice: boolean
  vaultWillBeAtRiskLevelDangerAtNextPrice: boolean
  vaultWillBeUnderCollateralizedAtNextPrice: boolean

  depositingAllCoinBalance: boolean
  depositAmountExceedsCollateralBalance: boolean
  generateAmountExceedsStblYieldFromDepositingCollateral: boolean
  generateAmountExceedsStblYieldFromDepositingCollateralAtNextPrice: boolean
  generateAmountExceedsDebtCeiling: boolean
  generateAmountLessThanDebtFloor: boolean

  customAllowanceAmountEmpty: boolean
  customAllowanceAmountExceedsMaxUint256: boolean
  customAllowanceAmountLessThanDepositAmount: boolean
  insufficientAllowance: boolean

  isLoadingStage: boolean
  canProgress: boolean
  canRegress: boolean
}

export const defaultOpenVaultConditions: OpenVaultConditions = {
  ...defaultOpenVaultStageCategories,
  inputAmountsEmpty: true,

  vaultWillBeAtRiskLevelWarning: false,
  vaultWillBeAtRiskLevelDanger: false,
  vaultWillBeUnderCollateralized: false,

  vaultWillBeAtRiskLevelWarningAtNextPrice: false,
  vaultWillBeAtRiskLevelDangerAtNextPrice: false,
  vaultWillBeUnderCollateralizedAtNextPrice: false,

  depositingAllCoinBalance: false,
  depositAmountExceedsCollateralBalance: false,
  generateAmountExceedsStblYieldFromDepositingCollateral: false,
  generateAmountExceedsStblYieldFromDepositingCollateralAtNextPrice: false,
  generateAmountExceedsDebtCeiling: false,
  generateAmountLessThanDebtFloor: false,

  customAllowanceAmountEmpty: false,
  customAllowanceAmountExceedsMaxUint256: false,
  customAllowanceAmountLessThanDepositAmount: false,
  insufficientAllowance: false,

  isLoadingStage: false,
  canProgress: false,
  canRegress: false,
}

export function applyOpenVaultConditions(state: OpenVaultState): OpenVaultState {
  const {
    stage,
    generateAmount,
    afterCollateralizationRatio,
    afterCollateralizationRatioAtNextPrice,
    ilkData,
    token,
    balanceInfo: { collateralBalance },
    depositAmount,
    stblYieldFromDepositingCollateral,
    stblYieldFromDepositingCollateralAtNextPrice,
    selectedAllowanceRadio,
    allowanceAmount,
    allowance,
  } = state

  const inputAmountsEmpty = !depositAmount && !generateAmount

  const vaultWillBeAtRiskLevelDanger =
    !inputAmountsEmpty &&
    afterCollateralizationRatio.gte(ilkData.liquidationRatio) &&
    afterCollateralizationRatio.lte(ilkData.collateralizationDangerThreshold)

  const vaultWillBeAtRiskLevelDangerAtNextPrice =
    !vaultWillBeAtRiskLevelDanger &&
    !inputAmountsEmpty &&
    afterCollateralizationRatioAtNextPrice.gte(ilkData.liquidationRatio) &&
    afterCollateralizationRatioAtNextPrice.lte(ilkData.collateralizationDangerThreshold)

  const vaultWillBeAtRiskLevelWarning =
    !inputAmountsEmpty &&
    afterCollateralizationRatio.gt(ilkData.collateralizationDangerThreshold) &&
    afterCollateralizationRatio.lte(ilkData.collateralizationWarningThreshold)

  const vaultWillBeAtRiskLevelWarningAtNextPrice =
    !vaultWillBeAtRiskLevelWarning &&
    !inputAmountsEmpty &&
    afterCollateralizationRatioAtNextPrice.gt(ilkData.collateralizationDangerThreshold) &&
    afterCollateralizationRatioAtNextPrice.lte(ilkData.collateralizationWarningThreshold)

  const vaultWillBeUnderCollateralized = !!(
    generateAmount?.gt(zero) &&
    afterCollateralizationRatio.lt(ilkData.liquidationRatio) &&
    !afterCollateralizationRatio.isZero()
  )

  const vaultWillBeUnderCollateralizedAtNextPrice =
    !vaultWillBeUnderCollateralized &&
    !!(
      generateAmount?.gt(zero) &&
      afterCollateralizationRatioAtNextPrice.lt(ilkData.liquidationRatio) &&
      !afterCollateralizationRatioAtNextPrice.isZero()
    )

  const depositingAllCoinBalance = token === 'MTR' && !!depositAmount?.eq(collateralBalance)
  const depositAmountExceedsCollateralBalance = !!depositAmount?.gt(collateralBalance)

  const generateAmountExceedsStblYieldFromDepositingCollateral = !!generateAmount?.gt(
    stblYieldFromDepositingCollateral,
  )

  const generateAmountExceedsStblYieldFromDepositingCollateralAtNextPrice =
    !generateAmountExceedsStblYieldFromDepositingCollateral &&
    !!generateAmount?.gt(stblYieldFromDepositingCollateralAtNextPrice)

  const generateAmountExceedsDebtCeiling = !!generateAmount?.gt(ilkData.ilkDebtAvailable)

  const generateAmountLessThanDebtFloor = !!(
    generateAmount &&
    !generateAmount.isZero() &&
    generateAmount.lt(ilkData.debtFloor)
  )

  const isLoadingStage = ([
    'proxyInProgress',
    'proxyWaitingForApproval',
    'allowanceInProgress',
    'allowanceWaitingForApproval',
    'openInProgress',
    'openWaitingForApproval',
  ] as OpenVaultStage[]).some((s) => s === stage)

  const customAllowanceAmountEmpty = selectedAllowanceRadio === 'custom' && !allowanceAmount

  const customAllowanceAmountExceedsMaxUint256 = !!(
    selectedAllowanceRadio === 'custom' && allowanceAmount?.gt(maxUint256)
  )

  const customAllowanceAmountLessThanDepositAmount = !!(
    selectedAllowanceRadio === 'custom' &&
    allowanceAmount &&
    depositAmount &&
    allowanceAmount.lt(depositAmount)
  )

  const insufficientAllowance =
    token !== 'MTR' &&
    !!(depositAmount && !depositAmount.isZero() && (!allowance || depositAmount.gt(allowance)))

  const canProgress =
    !(
      inputAmountsEmpty ||
      isLoadingStage ||
      vaultWillBeUnderCollateralized ||
      vaultWillBeUnderCollateralizedAtNextPrice ||
      depositingAllCoinBalance ||
      depositAmountExceedsCollateralBalance ||
      generateAmountExceedsDebtCeiling ||
      generateAmountLessThanDebtFloor ||
      customAllowanceAmountEmpty ||
      customAllowanceAmountExceedsMaxUint256 ||
      customAllowanceAmountLessThanDepositAmount
    ) || stage === 'openSuccess'

  const canRegress = ([
    'proxyWaitingForConfirmation',
    'proxyFailure',
    'allowanceWaitingForConfirmation',
    'allowanceFailure',
    'openWaitingForConfirmation',
    'openFailure',
  ] as OpenVaultStage[]).some((s) => s === stage)

  return {
    ...state,
    inputAmountsEmpty,

    vaultWillBeAtRiskLevelWarning,
    vaultWillBeAtRiskLevelWarningAtNextPrice,
    vaultWillBeAtRiskLevelDanger,
    vaultWillBeAtRiskLevelDangerAtNextPrice,
    vaultWillBeUnderCollateralized,
    vaultWillBeUnderCollateralizedAtNextPrice,

    depositingAllCoinBalance,
    depositAmountExceedsCollateralBalance,
    generateAmountExceedsStblYieldFromDepositingCollateral,
    generateAmountExceedsStblYieldFromDepositingCollateralAtNextPrice,
    generateAmountExceedsDebtCeiling,
    generateAmountLessThanDebtFloor,

    customAllowanceAmountEmpty,
    customAllowanceAmountExceedsMaxUint256,
    customAllowanceAmountLessThanDepositAmount,
    insufficientAllowance,

    isLoadingStage,
    canProgress,
    canRegress,
  }
}
