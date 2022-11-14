import { AppLink } from 'components/Links'
import { MessageCard } from 'components/MessageCard'
import { formatCryptoBalance } from 'helpers/formatters/format'
import { UnreachableCaseError } from 'helpers/UnreachableCaseError'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'
import { Dictionary } from 'ts-essentials'

import { ManageVaultState } from './manageVault'
import { ManageVaultErrorMessage } from './manageVaultValidations'

export function ManageVaultErrors({
  errorMessages,
  maxWithdrawAmount,
  maxGenerateAmount,
  ilkData: { debtFloor },
  vault: { token },
}: ManageVaultState) {
  const { t } = useTranslation()
  if (!errorMessages.length) return null

  function applyErrorMessageTranslation(message: ManageVaultErrorMessage) {
    const translate = (key: string, args?: Dictionary<any>) => t(`manage-vault.errors.${key}`, args)
    switch (message) {
      case 'depositAmountExceedsCollateralBalance':
        return translate('deposit-amount-exceeds-collateral-balance')
      case 'withdrawAmountExceedsFreeCollateral':
        return translate('withdraw-amount-exceeds-free-collateral', {
          maxWithdrawAmount: formatCryptoBalance(maxWithdrawAmount),
          token,
        })
      case 'withdrawAmountExceedsFreeCollateralAtNextPrice':
        return translate('withdraw-amount-exceeds-free-collateral-at-next-price', {
          maxWithdrawAmount: formatCryptoBalance(maxWithdrawAmount),
          token,
        })
      case 'generateAmountExceedsStblYieldFromTotalCollateral':
        return translate('generate-amount-exceeds-stbl-yield-from-total-collateral')
      case 'generateAmountExceedsStblYieldFromTotalCollateralAtNextPrice':
        return translate('generate-amount-exceeds-stbl-yield-from-total-collateral-at-next-price')
      case 'generateAmountExceedsDebtCeiling':
        return translate('generate-amount-exceeds-debt-ceiling', {
          maxGenerateAmount: formatCryptoBalance(maxGenerateAmount),
          token,
        })
      case 'generateAmountLessThanDebtFloor':
        return (
          <Trans
            i18nKey="manage-vault.errors.generate-amount-less-than-debt-floor"
            values={{ debtFloor: formatCryptoBalance(debtFloor) }}
            components={[
              <AppLink
                sx={{ color: 'onError' }}
                href="https://kb.oasis.app/help/minimum-vault-debt-dust"
              />,
            ]}
          />
        )
      case 'paybackAmountExceedsStblBalance':
        return translate('payback-amount-exceeds-stbl-balance')
      case 'paybackAmountExceedsVaultDebt':
        return translate('payback-amount-exceeds-vault-debt')
      case 'debtWillBeLessThanDebtFloor':
        return translate('debt-will-be-less-than-debt-floor', {
          debtFloor: formatCryptoBalance(debtFloor),
        })
      case 'customCollateralAllowanceAmountExceedsMaxUint256':
        return translate('custom-collateral-allowance-amount-exceeds-maxuint256')
      case 'customCollateralAllowanceAmountLessThanDepositAmount':
        return translate('custom-collateral-allowance-amount-less-than-deposit-amount')
      case 'customStblAllowanceAmountExceedsMaxUint256':
        return translate('custom-stbl-allowance-amount-exceeds-maxuint256')
      case 'customStblAllowanceAmountLessThanPaybackAmount':
        return translate('custom-stbl-allowance-amount-less-than-payback-amount')
      case 'depositingAllCoinBalance':
        return translate('depositing-all-coin-balance')
      case 'ledgerWalletContractDataDisabled':
        return translate('ledger-enable-contract-data')
      case 'withdrawCollateralOnVaultUnderDebtFloor':
        return (
          <Trans
            i18nKey="manage-vault.errors.withdraw-collateral-on-vault-under-debt-floor"
            values={{ debtFloor: formatCryptoBalance(debtFloor) }}
            components={[
              <AppLink
                sx={{ color: 'onError' }}
                href="https://kb.oasis.app/help/minimum-vault-debt-dust"
              />,
            ]}
          />
        )
      case 'depositCollateralOnVaultUnderDebtFloor':
        return (
          <Trans
            i18nKey="manage-vault.errors.deposit-collateral-on-vault-under-debt-floor"
            values={{ debtFloor: formatCryptoBalance(debtFloor) }}
            components={[
              <AppLink
                sx={{ color: 'onError' }}
                href="https://kb.oasis.app/help/minimum-vault-debt-dust"
              />,
            ]}
          />
        )

      default:
        throw new UnreachableCaseError(message)
    }
  }

  const messages = errorMessages.reduce(
    (acc, message) => [...acc, applyErrorMessageTranslation(message)],
    [] as (string | JSX.Element)[],
  )

  return <MessageCard {...{ messages, type: 'error' }} />
}
