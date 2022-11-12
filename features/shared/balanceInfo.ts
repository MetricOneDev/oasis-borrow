import { BigNumber } from 'bignumber.js'
import { combineLatest, Observable, of } from 'rxjs'
import { map } from 'rxjs/internal/operators/map'

import { coinName, stblName } from "../../blockchain/config";
import { zero } from '../../helpers/zero'

export interface BalanceInfo {
  collateralBalance: BigNumber
  coinBalance: BigNumber
  stblBalance: BigNumber
}

export function createBalanceInfo$(
  balance$: (token: string, address: string) => Observable<BigNumber>,
  token: string,
  address: string | undefined,
): Observable<BalanceInfo> {
  return combineLatest(
    address ? balance$(token, address) : of(zero),
    address ? balance$(coinName, address) : of(zero),
    address ? balance$(stblName, address) : of(zero),
  ).pipe(
    map(([collateralBalance, coinBalance, stblBalance]) => ({
      collateralBalance,
      coinBalance: coinBalance,
      stblBalance: stblBalance,
    })),
  )
}

export interface BalanceInfoChange {
  kind: 'balanceInfo'
  balanceInfo: BalanceInfo
}

export function balanceInfoChange$(
  balanceInfo$: (token: string, account: string | undefined) => Observable<BalanceInfo>,
  token: string,
  account: string | undefined,
): Observable<BalanceInfoChange> {
  return balanceInfo$(token, account).pipe(
    map((balanceInfo) => ({
      kind: 'balanceInfo',
      balanceInfo,
    })),
  )
}
