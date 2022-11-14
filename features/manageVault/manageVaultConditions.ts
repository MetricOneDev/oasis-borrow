import { maxUint256 } from 'blockchain/calls/erc20'
import { isNullish } from 'helpers/functions'
import { UnreachableCaseError } from 'helpers/UnreachableCaseError'
import { zero } from 'helpers/zero'

import { ManageVaultStage, ManageVaultState } from './manageVault'

const defaultManageVaultStageCategories = {
  isEditingStage: false,
  isProxyStage: false,
  isCollateralAllowanceStage: false,
  isStblAllowanceStage: false,
  isManageStage: false,
}

export function applyManageVaultStageCategorisation(state: ManageVaultState) {
  switch (state.stage) {
    case 'collateralEditing':
    case 'stblEditing':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isEditingStage: true,
      }
    case 'proxyWaitingForConfirmation':
    case 'proxyWaitingForApproval':
    case 'proxyInProgress':
    case 'proxyFailure':
    case 'proxySuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isProxyStage: true,
      }
    case 'collateralAllowanceWaitingForConfirmation':
    case 'collateralAllowanceWaitingForApproval':
    case 'collateralAllowanceInProgress':
    case 'collateralAllowanceFailure':
    case 'collateralAllowanceSuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isCollateralAllowanceStage: true,
      }
    case 'stblAllowanceWaitingForConfirmation':
    case 'stblAllowanceWaitingForApproval':
    case 'stblAllowanceInProgress':
    case 'stblAllowanceFailure':
    case 'stblAllowanceSuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isStblAllowanceStage: true,
      }

    case 'manageWaitingForConfirmation':
    case 'manageWaitingForApproval':
    case 'manageInProgress':
    case 'manageFailure':
    case 'manageSuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isManageStage: true,
      }
    default:
      throw new UnreachableCaseError(state.stage)
  }
}

export interface ManageVaultConditions {
  isEditingStage: boolean
  isProxyStage: boolean
  isCollateralAllowanceStage: boolean
  isStblAllowanceStage: boolean
  isManageStage: boolean

  canProgress: boolean
  canRegress: boolean

  depositAndWithdrawAmountsEmpty: boolean
  generateAndPaybackAmountsEmpty: boolean
  inputAmountsEmpty: boolean

  vaultWillBeAtRiskLevelWarning: boolean
  vaultWillBeAtRiskLevelDanger: boolean
  vaultWillBeUnderCollateralized: boolean

  vaultWillBeAtRiskLevelWarningAtNextPrice: boolean
  vaultWillBeAtRiskLevelDangerAtNextPrice: boolean
  vaultWillBeUnderCollateralizedAtNextPrice: boolean

  accountIsConnected: boolean
  accountIsController: boolean

  depositingAllCoinBalance: boolean
  depositAmountExceedsCollateralBalance: boolean
  withdrawAmountExceedsFreeCollateral: boolean
  withdrawAmountExceedsFreeCollateralAtNextPrice: boolean
  generateAmountExceedsStblYieldFromTotalCollateral: boolean
  generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice: boolean
  generateAmountLessThanDebtFloor: boolean
  generateAmountExceedsDebtCeiling: boolean
  paybackAmountExceedsVaultDebt: boolean
  paybackAmountExceedsStblBalance: boolean

  debtWillBeLessThanDebtFloor: boolean
  isLoadingStage: boolean

  insufficientCollateralAllowance: boolean
  customCollateralAllowanceAmountEmpty: boolean
  customCollateralAllowanceAmountExceedsMaxUint256: boolean
  customCollateralAllowanceAmountLessThanDepositAmount: boolean

  insufficientStblAllowance: boolean
  customStblAllowanceAmountEmpty: boolean
  customStblAllowanceAmountExceedsMaxUint256: boolean
  customStblAllowanceAmountLessThanPaybackAmount: boolean
  withdrawCollateralOnVaultUnderDebtFloor: boolean
  depositCollateralOnVaultUnderDebtFloor: boolean
}

export const defaultManageVaultConditions: ManageVaultConditions = {
  ...defaultManageVaultStageCategories,
  canProgress: false,
  canRegress: false,

  vaultWillBeAtRiskLevelWarning: false,
  vaultWillBeAtRiskLevelDanger: false,
  vaultWillBeUnderCollateralized: false,

  vaultWillBeAtRiskLevelWarningAtNextPrice: false,
  vaultWillBeAtRiskLevelDangerAtNextPrice: false,
  vaultWillBeUnderCollateralizedAtNextPrice: false,

  depositAndWithdrawAmountsEmpty: true,
  generateAndPaybackAmountsEmpty: true,
  inputAmountsEmpty: true,

  accountIsConnected: false,
  accountIsController: false,

  depositingAllCoinBalance: false,
  depositAmountExceedsCollateralBalance: false,
  withdrawAmountExceedsFreeCollateral: false,
  withdrawAmountExceedsFreeCollateralAtNextPrice: false,
  generateAmountExceedsStblYieldFromTotalCollateral: false,
  generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice: false,
  generateAmountLessThanDebtFloor: false,
  generateAmountExceedsDebtCeiling: false,
  paybackAmountExceedsVaultDebt: false,
  paybackAmountExceedsStblBalance: false,

  debtWillBeLessThanDebtFloor: false,
  isLoadingStage: false,

  insufficientCollateralAllowance: false,
  customCollateralAllowanceAmountEmpty: false,
  customCollateralAllowanceAmountExceedsMaxUint256: false,
  customCollateralAllowanceAmountLessThanDepositAmount: false,

  insufficientStblAllowance: false,
  customStblAllowanceAmountEmpty: false,
  customStblAllowanceAmountExceedsMaxUint256: false,
  customStblAllowanceAmountLessThanPaybackAmount: false,

  withdrawCollateralOnVaultUnderDebtFloor: false,
  depositCollateralOnVaultUnderDebtFloor: false,
}

export function applyManageVaultConditions(state: ManageVaultState): ManageVaultState {
  const {
    depositAmount,
    generateAmount,
    withdrawAmount,
    paybackAmount,
    afterCollateralizationRatio,
    afterCollateralizationRatioAtNextPrice,
    ilkData,
    vault,
    account,
    stage,
    selectedCollateralAllowanceRadio,
    selectedStblAllowanceRadio,
    collateralAllowanceAmount,
    stblAllowanceAmount,
    collateralAllowance,
    stblAllowance,
    shouldPaybackAll,
    balanceInfo: { collateralBalance, stblBalance },
    isEditingStage,
    isCollateralAllowanceStage,
    isStblAllowanceStage,
    maxWithdrawAmountAtCurrentPrice,
    maxWithdrawAmountAtNextPrice,
    maxGenerateAmountAtCurrentPrice,
    maxGenerateAmountAtNextPrice,
    afterDebt,
  } = state

  const depositAndWithdrawAmountsEmpty = isNullish(depositAmount) && isNullish(withdrawAmount)
  const generateAndPaybackAmountsEmpty = isNullish(generateAmount) && isNullish(paybackAmount)

  const inputAmountsEmpty = depositAndWithdrawAmountsEmpty && generateAndPaybackAmountsEmpty

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

  const vaultWillBeUnderCollateralized =
    !inputAmountsEmpty &&
    afterCollateralizationRatio.lt(ilkData.liquidationRatio) &&
    !afterCollateralizationRatio.isZero()

  const vaultWillBeUnderCollateralizedAtNextPrice =
    !vaultWillBeUnderCollateralized &&
    !inputAmountsEmpty &&
    afterCollateralizationRatioAtNextPrice.lt(ilkData.liquidationRatio) &&
    !afterCollateralizationRatioAtNextPrice.isZero()

  const accountIsConnected = !!account
  const accountIsController = accountIsConnected ? account === vault.controller : true

  const depositAmountExceedsCollateralBalance = !!depositAmount?.gt(collateralBalance)

  const depositingAllCoinBalance = vault.token === 'MTR' && !!depositAmount?.eq(collateralBalance)

  const withdrawAmountExceedsFreeCollateral = !!withdrawAmount?.gt(maxWithdrawAmountAtCurrentPrice)

  const withdrawAmountExceedsFreeCollateralAtNextPrice =
    !withdrawAmountExceedsFreeCollateral && !!withdrawAmount?.gt(maxWithdrawAmountAtNextPrice)

  const generateAmountExceedsDebtCeiling = !!generateAmount?.gt(ilkData.ilkDebtAvailable)

  const generateAmountExceedsStblYieldFromTotalCollateral =
    !generateAmountExceedsDebtCeiling && !!generateAmount?.gt(maxGenerateAmountAtCurrentPrice)

  const generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice =
    !generateAmountExceedsDebtCeiling &&
    !generateAmountExceedsStblYieldFromTotalCollateral &&
    !!generateAmount?.gt(maxGenerateAmountAtNextPrice)

  const generateAmountLessThanDebtFloor = !!(
    generateAmount &&
    !generateAmount.plus(vault.debt).isZero() &&
    generateAmount.plus(vault.debt).lt(ilkData.debtFloor)
  )

  const paybackAmountExceedsStblBalance = !!paybackAmount?.gt(stblBalance)
  const paybackAmountExceedsVaultDebt = !!paybackAmount?.gt(vault.debt)

  const debtWillBeLessThanDebtFloor = !!(
    paybackAmount &&
    vault.debt.minus(paybackAmount).lt(ilkData.debtFloor) &&
    vault.debt.minus(paybackAmount).gt(zero) &&
    !shouldPaybackAll
  )

  const customCollateralAllowanceAmountEmpty =
    selectedCollateralAllowanceRadio === 'custom' && !collateralAllowanceAmount

  const customStblAllowanceAmountEmpty =
    selectedStblAllowanceRadio === 'custom' && !stblAllowanceAmount

  const customCollateralAllowanceAmountExceedsMaxUint256 = !!(
    selectedCollateralAllowanceRadio === 'custom' && collateralAllowanceAmount?.gt(maxUint256)
  )

  const customCollateralAllowanceAmountLessThanDepositAmount = !!(
    selectedCollateralAllowanceRadio === 'custom' &&
    collateralAllowanceAmount &&
    depositAmount &&
    collateralAllowanceAmount.lt(depositAmount)
  )

  const customStblAllowanceAmountExceedsMaxUint256 = !!(
    selectedStblAllowanceRadio === 'custom' && stblAllowanceAmount?.gt(maxUint256)
  )

  const customStblAllowanceAmountLessThanPaybackAmount = !!(
    selectedStblAllowanceRadio === 'custom' &&
    stblAllowanceAmount &&
    paybackAmount &&
    stblAllowanceAmount.lt(paybackAmount)
  )

  const insufficientCollateralAllowance =
    vault.token !== 'MTR' &&
    !!(
      depositAmount &&
      !depositAmount.isZero() &&
      (!collateralAllowance || depositAmount.gt(collateralAllowance))
    )

  const insufficientStblAllowance = !!(
    paybackAmount &&
    !paybackAmount.isZero() &&
    (!stblAllowance || paybackAmount.plus(vault.debtOffset).gt(stblAllowance))
  )

  const isLoadingStage = ([
    'proxyInProgress',
    'proxyWaitingForApproval',
    'collateralAllowanceWaitingForApproval',
    'collateralAllowanceInProgress',
    'stblAllowanceWaitingForApproval',
    'stblAllowanceInProgress',
    'manageInProgress',
    'manageWaitingForApproval',
  ] as ManageVaultStage[]).some((s) => s === stage)

  const withdrawCollateralOnVaultUnderDebtFloor =
    vault.debt.gt(zero) &&
    vault.debt.lt(ilkData.debtFloor) &&
    withdrawAmount !== undefined &&
    withdrawAmount.gt(zero) &&
    (paybackAmount === undefined || paybackAmount.lt(vault.debt))

  const depositCollateralOnVaultUnderDebtFloor =
    vault.debt.gt(zero) &&
    vault.debt.lt(ilkData.debtFloor) &&
    depositAmount !== undefined &&
    depositAmount.lt(ilkData.debtFloor) &&
    afterDebt.lt(ilkData.debtFloor)

  const editingProgressionDisabled =
    isEditingStage &&
    (inputAmountsEmpty ||
      !vault.controller ||
      !accountIsConnected ||
      vaultWillBeUnderCollateralized ||
      vaultWillBeUnderCollateralizedAtNextPrice ||
      debtWillBeLessThanDebtFloor ||
      depositAmountExceedsCollateralBalance ||
      withdrawAmountExceedsFreeCollateral ||
      withdrawAmountExceedsFreeCollateralAtNextPrice ||
      depositingAllCoinBalance ||
      generateAmountExceedsDebtCeiling ||
      generateAmountLessThanDebtFloor ||
      paybackAmountExceedsStblBalance ||
      paybackAmountExceedsVaultDebt ||
      withdrawCollateralOnVaultUnderDebtFloor ||
      depositCollateralOnVaultUnderDebtFloor)

  const collateralAllowanceProgressionDisabled =
    isCollateralAllowanceStage &&
    (customCollateralAllowanceAmountEmpty ||
      customCollateralAllowanceAmountExceedsMaxUint256 ||
      customCollateralAllowanceAmountLessThanDepositAmount)

  const stblAllowanceProgressionDisabled =
    isStblAllowanceStage &&
    (customStblAllowanceAmountEmpty ||
      customStblAllowanceAmountExceedsMaxUint256 ||
      customStblAllowanceAmountLessThanPaybackAmount)

  const canProgress = !(
    isLoadingStage ||
    editingProgressionDisabled ||
    collateralAllowanceProgressionDisabled ||
    stblAllowanceProgressionDisabled
  )

  const canRegress = ([
    'proxyWaitingForConfirmation',
    'proxyFailure',
    'collateralAllowanceWaitingForConfirmation',
    'collateralAllowanceFailure',
    'stblAllowanceWaitingForConfirmation',
    'stblAllowanceFailure',
    'manageWaitingForConfirmation',
    'manageFailure',
  ] as ManageVaultStage[]).some((s) => s === stage)

  return {
    ...state,
    canProgress,
    canRegress,

    depositAndWithdrawAmountsEmpty,
    generateAndPaybackAmountsEmpty,
    inputAmountsEmpty,

    vaultWillBeAtRiskLevelWarning,
    vaultWillBeAtRiskLevelWarningAtNextPrice,
    vaultWillBeAtRiskLevelDanger,
    vaultWillBeAtRiskLevelDangerAtNextPrice,
    vaultWillBeUnderCollateralized,
    vaultWillBeUnderCollateralizedAtNextPrice,

    accountIsConnected,
    accountIsController,
    depositingAllCoinBalance,
    generateAmountExceedsDebtCeiling,
    depositAmountExceedsCollateralBalance,
    withdrawAmountExceedsFreeCollateral,
    withdrawAmountExceedsFreeCollateralAtNextPrice,
    generateAmountExceedsStblYieldFromTotalCollateral,
    generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice,
    generateAmountLessThanDebtFloor,
    paybackAmountExceedsStblBalance,
    paybackAmountExceedsVaultDebt,
    shouldPaybackAll,
    debtWillBeLessThanDebtFloor,
    isLoadingStage,

    insufficientCollateralAllowance,
    customCollateralAllowanceAmountEmpty,
    customCollateralAllowanceAmountExceedsMaxUint256,
    customCollateralAllowanceAmountLessThanDepositAmount,

    insufficientStblAllowance,
    customStblAllowanceAmountEmpty,
    customStblAllowanceAmountExceedsMaxUint256,
    customStblAllowanceAmountLessThanPaybackAmount,

    withdrawCollateralOnVaultUnderDebtFloor,
    depositCollateralOnVaultUnderDebtFloor,
  }
}
