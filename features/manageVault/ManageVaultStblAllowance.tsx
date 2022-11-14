import { getToken } from 'blockchain/tokensMetadata'
import { Radio } from 'components/forms/Radio'
import { TxStatusCardProgress, TxStatusCardSuccess } from 'features/openVault/TxStatusCard'
import { BigNumberInput } from 'helpers/BigNumberInput'
import { formatAmount, formatCryptoBalance } from 'helpers/formatters/format'
import { handleNumericInput } from 'helpers/input'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { createNumberMask } from 'text-mask-addons'
import { Grid, Text } from 'theme-ui'

import { ManageVaultState } from './manageVault'

export function ManageVaultStblAllowance({
  stage,
  stblAllowanceAmount,
  paybackAmount,
  updateStblAllowanceAmount,
  setStblAllowanceAmountUnlimited,
  setStblAllowanceAmountToPaybackAmount,
  resetStblAllowanceAmount,
  selectedStblAllowanceRadio,
}: ManageVaultState) {
  const canSelectRadio = stage === 'stblAllowanceWaitingForConfirmation'

  const { t } = useTranslation()

  const isUnlimited = selectedStblAllowanceRadio === 'unlimited'
  const isPayback = selectedStblAllowanceRadio === 'paybackAmount'
  const isCustom = selectedStblAllowanceRadio === 'custom'

  return (
    <Grid>
      {canSelectRadio && (
        <>
          <Radio
            onChange={setStblAllowanceAmountUnlimited!}
            name="manage-vault-stbl-allowance"
            checked={isUnlimited}
          >
            <Text variant="paragraph3" sx={{ fontWeight: 'semiBold', my: '18px' }}>
              {t('unlimited-allowance')}
            </Text>
          </Radio>
          <Radio
            onChange={setStblAllowanceAmountToPaybackAmount!}
            name="manage-vault-stbl-allowance"
            checked={isPayback}
          >
            <Text variant="paragraph3" sx={{ fontWeight: 'semiBold', my: '18px' }}>
              {t('stbl-paying-back', { amount: formatCryptoBalance(paybackAmount!) })}
            </Text>
          </Radio>
          <Radio onChange={resetStblAllowanceAmount!} name="allowance-open-form" checked={isCustom}>
            <Grid columns="2fr 2fr 1fr" sx={{ alignItems: 'center', my: 2 }}>
              <Text variant="paragraph3" sx={{ fontWeight: 'semiBold' }}>
                {t('custom')}
              </Text>
              <BigNumberInput
                sx={{
                  p: 1,
                  borderRadius: 'small',
                  borderColor: 'light',
                  width: '100px',
                  fontSize: 1,
                  px: 3,
                  py: '12px',
                }}
                disabled={!isCustom}
                value={
                  stblAllowanceAmount && isCustom
                    ? formatAmount(stblAllowanceAmount, getToken('MONE').symbol)
                    : null
                }
                mask={createNumberMask({
                  allowDecimal: true,
                  decimalLimit: getToken('MONE').digits,
                  prefix: '',
                })}
                onChange={handleNumericInput(updateStblAllowanceAmount!)}
              />
              <Text sx={{ fontSize: 1 }}>MONE</Text>
            </Grid>
          </Radio>
        </>
      )}
    </Grid>
  )
}

export function ManageVaultStblAllowanceStatus({
  stage,
  stblAllowanceTxHash,
  etherscan,
}: ManageVaultState) {
  const { t } = useTranslation()

  if (stage === 'stblAllowanceInProgress') {
    return (
      <TxStatusCardProgress
        text={t('setting-allowance-for', { token: 'MONE' })}
        etherscan={etherscan!}
        txHash={stblAllowanceTxHash!}
      />
    )
  }
  if (stage === 'stblAllowanceSuccess') {
    return (
      <TxStatusCardSuccess
        text={t('set-allowance-for', { token: 'MONE' })}
        etherscan={etherscan!}
        txHash={stblAllowanceTxHash!}
      />
    )
  }
  return null
}
