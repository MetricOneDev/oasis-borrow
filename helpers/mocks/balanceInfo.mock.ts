import { BigNumber } from 'bignumber.js'
import { BalanceInfo } from 'features/shared/balanceInfo'
import { zero } from 'helpers/zero'
import { Observable, of } from 'rxjs'

export interface MockBalanceInfoProps {
  _balance$?: Observable<BalanceInfo>
  collateralBalance?: BigNumber
  coinBalance?: BigNumber
  stblBalance?: BigNumber
  address?: string | undefined
}

const defaultCollateralBalance = new BigNumber('300')
const defaultCoinBalance = new BigNumber('20')
const defaultStblBalance = new BigNumber('1000')

export function mockBalanceInfo$({
  _balance$,
  collateralBalance = defaultCollateralBalance,
                                   coinBalance = defaultCoinBalance,
                                   stblBalance = defaultStblBalance,
  address = '0xVaultController',
}: MockBalanceInfoProps): Observable<BalanceInfo> {
  return (
    _balance$ ||
    of({
      collateralBalance: address ? collateralBalance : zero,
      coinBalance: address ? coinBalance : zero,
      stblBalance: address ? stblBalance : zero,
    })
  )
}
