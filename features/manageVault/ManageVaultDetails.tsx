import { Icon } from '@makerdao/dai-ui-icons'
import BigNumber from 'bignumber.js'
import { getToken } from 'blockchain/tokensMetadata'
import { formatAmount, formatCryptoBalance, formatPercent } from 'helpers/formatters/format'
import { zero } from 'helpers/zero'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Box, Flex, Grid, Heading, Text } from 'theme-ui'

import { ManageVaultState } from './manageVault'
import { ManageVaultHeading } from './ManageVaultView'

function VaultDetailsTableItem({
  label,
  value,
  subValue,
}: {
  label: string | JSX.Element
  value: string | JSX.Element
  subValue?: string | JSX.Element | false
}) {
  return (
    <Grid sx={{ gridTemplateRows: '1fr 1fr' }} gap={1}>
      <Box variant="text.paragraph3" sx={{ color: 'text.off', mb: 2 }}>
        {label}
      </Box>
      <Box variant="text.header3">
        <Text sx={{ display: 'inline' }} variant="header3">
          {value}
        </Text>
      </Box>
      {subValue && (
        <Flex sx={{ alignItems: 'center' }}>
          <Icon name="arrow_right" size={12} />
          <Box pl={1}>{subValue}</Box>
        </Flex>
      )}
    </Grid>
  )
}

function VaultDetailsTable({
  vault,
  ilkData,
  stblYieldFromTotalCollateral,
  afterDebt,
  afterFreeCollateral,
  inputAmountsEmpty,
  stage,
}: ManageVaultState) {
  const { t } = useTranslation()
  const showAfterCalculations = !inputAmountsEmpty && stage !== 'manageSuccess'

  return (
    <Box sx={{ gridColumn: ['1', '1/3'], mt: [4, 6] }}>
      <Heading variant="header3" mb="24px">
        {t('vault.vault-details')}
      </Heading>
      <Grid
        columns={['1fr 1fr', '1fr 1fr 1fr']}
        sx={{ border: 'light', borderRadius: 'medium', p: [3, 4] }}
      >
        <VaultDetailsTableItem
          label={t('system.vault-stbl-debt')}
          value={
            <>
              {formatCryptoBalance(vault.debt)}
              <Text sx={{ display: 'inline', ml: 2, fontWeight: 'semiBold' }} variant="paragraph3">
                MONE
              </Text>
            </>
          }
          subValue={
            showAfterCalculations && (
              <>
                {formatCryptoBalance(afterDebt)}
                <Text
                  sx={{ display: 'inline', ml: 2, fontWeight: 'semiBold' }}
                  variant="paragraph4"
                >
                  MONE
                </Text>
              </>
            )
          }
        />

        <VaultDetailsTableItem
          label={t('system.available-to-withdraw')}
          value={
            <>
              {formatAmount(vault.freeCollateral, getToken(vault.token).symbol)}
              <Text sx={{ display: 'inline', ml: 2, fontWeight: 'semiBold' }} variant="paragraph3">
                {vault.token}
              </Text>
            </>
          }
          subValue={
            showAfterCalculations && (
              <>
                {formatAmount(afterFreeCollateral, getToken(vault.token).symbol)}
                <Text
                  sx={{ display: 'inline', ml: 2, fontWeight: 'semiBold' }}
                  variant="paragraph4"
                >
                  {vault.token}
                </Text>
              </>
            )
          }
        />
        <VaultDetailsTableItem
          label={t('system.available-to-generate')}
          value={
            <>
              {formatCryptoBalance(vault.stblYieldFromLockedCollateral)}
              <Text sx={{ display: 'inline', ml: 2, fontWeight: 'semiBold' }} variant="paragraph3">
                MONE
              </Text>
            </>
          }
          subValue={
            showAfterCalculations && (
              <>
                {formatCryptoBalance(stblYieldFromTotalCollateral)}
                <Text
                  sx={{ display: 'inline', ml: 2, fontWeight: 'semiBold' }}
                  variant="paragraph4"
                >
                  MONE
                </Text>
              </>
            )
          }
        />
        <Box
          sx={{
            display: ['none', 'block'],
            gridColumn: '1/4',
            borderBottom: 'light',
            height: '1px',
            my: 3,
          }}
        />
        <VaultDetailsTableItem
          label={t('system.liquidation-ratio')}
          value={formatPercent(ilkData.liquidationRatio.times(100))}
        />
        <VaultDetailsTableItem
          label={t('system.stability-fee')}
          value={formatPercent(ilkData.stabilityFee.times(100), { precision: 2 })}
        />
        <VaultDetailsTableItem
          label={t('system.liquidation-penalty')}
          value={formatPercent(ilkData.liquidationPenalty.times(100))}
        />
      </Grid>
    </Box>
  )
}

export function ManageVaultDetails(props: ManageVaultState) {
  const {
    afterLiquidationPrice,
    inputAmountsEmpty,
    vault: {
      token,
      collateralizationRatio,
      liquidationPrice,
      lockedCollateral,
      lockedCollateralUSD,
      underCollateralized,
      atRiskLevelDanger,
      atRiskLevelWarning,
    },
    priceInfo: {
      currentCollateralPrice,
      nextCollateralPrice,
      isStaticCollateralPrice,
      dateNextCollateralPrice,
      collateralPricePercentageChange,
    },
    shouldPaybackAll,
    afterCollateralizationRatio,
    stage,
  } = props
  const { t } = useTranslation()
  const collRatioColor = collateralizationRatio.isZero()
    ? 'primary'
    : atRiskLevelDanger || underCollateralized
    ? 'onError'
    : atRiskLevelWarning
    ? 'onWarning'
    : 'onSuccess'

  const locked = formatAmount(lockedCollateral, token)
  const lockedUSD = formatAmount(lockedCollateralUSD, 'USD')

  const newPriceIn = moment(dateNextCollateralPrice).diff(Date.now(), 'minutes')

  const priceChangeColor = collateralPricePercentageChange.isZero()
    ? 'text.muted'
    : collateralPricePercentageChange.gt(zero)
    ? 'onSuccess'
    : 'onError'

  const showAfterCalculations = !inputAmountsEmpty && stage !== 'manageSuccess'
  return (
    <Grid sx={{ alignSelf: 'flex-start' }} columns={[1, '1fr 1fr']}>
      <ManageVaultHeading {...props} sx={{ display: ['none', 'block'] }} />

      {/* Liquidation Price  */}
      <Box sx={{ mt: [3, 5], textAlign: ['center', 'left'] }}>
        <Heading variant="subheader" as="h2">
          {t('system.liquidation-price')}
        </Heading>
        <Text variant="display">$ {formatAmount(liquidationPrice, 'USD')}</Text>
        {showAfterCalculations && (
          <Text>
            {t('after')}: ${formatAmount(shouldPaybackAll ? zero : afterLiquidationPrice, 'USD')}
          </Text>
        )}
      </Box>

      {/* Collaterization  */}
      <Box sx={{ mt: [3, 5], textAlign: ['center', 'right'] }}>
        <Heading variant="subheader" as="h2">
          {t('system.collateralization-ratio')}
        </Heading>
        <Text sx={{ color: collRatioColor }} variant="display">
          {formatPercent(collateralizationRatio.times(100), { precision: 2 })}
        </Text>
        {showAfterCalculations && (
          <Text>
            {t('after')}:{' '}
            {formatPercent(afterCollateralizationRatio.times(100), {
              precision: 2,
              roundMode: BigNumber.ROUND_DOWN,
            })}
          </Text>
        )}
      </Box>

      {/* Current Price */}
      {isStaticCollateralPrice ? (
        <Box sx={{ mt: [3, 6], textAlign: ['center', 'left'] }}>
          <Heading variant="subheader" as="h2">
            {t('vault.token-uds-price', { token })}
          </Heading>
          <Text variant="header2">${formatAmount(currentCollateralPrice, 'USD')}</Text>
        </Box>
      ) : (
        <Box sx={{ mt: [3, 6], textAlign: ['center', 'left'] }}>
          <Box>
            <Heading variant="subheader" as="h2">
              {t('vault.token-uds-price', { token })}
            </Heading>
            <Text variant="header2" sx={{ py: 3 }}>
              ${formatAmount(currentCollateralPrice, 'USD')}
            </Text>
          </Box>

          <Flex sx={{ alignItems: ['center', 'flex-start'], flexDirection: 'column' }}>
            <Heading variant="subheader" as="h3">
              <Box sx={{ mr: 2 }}>
                {newPriceIn < 2
                  ? t('vault.next-price-any-time', { count: newPriceIn })
                  : t('vault.next-price', { count: newPriceIn })}
              </Box>
            </Heading>
            <Flex
              variant="paragraph2"
              sx={{ fontWeight: 'semiBold', alignItems: 'center', color: priceChangeColor }}
            >
              <Text>${formatAmount(nextCollateralPrice, 'USD')}</Text>
              <Text sx={{ ml: 2 }}>
                ({formatPercent(collateralPricePercentageChange.times(100), { precision: 2 })})
              </Text>
              {collateralPricePercentageChange.isZero() ? null : (
                <Icon
                  sx={{ ml: 2 }}
                  name={collateralPricePercentageChange.gt(zero) ? 'increase' : 'decrease'}
                />
              )}
            </Flex>
          </Flex>
        </Box>
      )}

      {/* Collateral Locked */}
      <Box sx={{ mt: [3, 6], textAlign: ['center', 'right'] }}>
        <Heading variant="subheader" as="h2">
          {t('system.collateral-locked')}
        </Heading>
        <Text variant="header2" sx={{ py: 3 }}>
          {locked} {token}
        </Text>
        <Text>$ {lockedUSD}</Text>
      </Box>

      <VaultDetailsTable {...props} />
    </Grid>
  )
}
