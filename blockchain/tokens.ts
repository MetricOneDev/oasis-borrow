import { amountFromWei } from '@oasisdex/utils'
import BigNumber from 'bignumber.js'
import { bindNodeCallback, combineLatest, Observable, of } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'

import { maxUint256, tokenAllowance, tokenBalance } from './calls/erc20'
import { CallObservable } from './calls/observe'
import { Context } from './network'
import { OraclePriceData } from './prices'

export function createBalance$(
  onEveryBlock$: Observable<number>,
  context$: Observable<Context>,
  tokenBalance$: CallObservable<typeof tokenBalance>,
  token: string,
  address: string,
) {
  return context$.pipe(
    switchMap(({ web3 }) => {
      if (token === 'MTR') {
        return onEveryBlock$.pipe(
          switchMap(() => bindNodeCallback(web3.eth.getBalance)(address)),
          map((coinBalance: string) => amountFromWei(new BigNumber(coinBalance))),
          distinctUntilChanged((x: BigNumber, y: BigNumber) => x.eq(y)),
          shareReplay(1),
        )
      }
      return tokenBalance$({ token, account: address })
    }),
  )
}

export function createCollateralTokens$(
  ilks$: Observable<string[]>,
  ilkToToken$: Observable<(ilk: string) => string>,
): Observable<string[]> {
  return combineLatest(ilks$, ilkToToken$).pipe(
    switchMap(([ilks, ilkToToken]) => {
      return of([...new Set(ilks.map(ilkToToken))])
    }),
  )
}

export type TokenBalances = Record<string, { balance: BigNumber; price: BigNumber }>

export function createAccountBalance$(
  tokenBalance$: (token: string, address: string) => Observable<BigNumber>,
  collateralTokens$: Observable<string[]>,
  oraclePriceData$: (token: string) => Observable<OraclePriceData>,
  address: string,
): Observable<TokenBalances> {
  return collateralTokens$.pipe(
    switchMap((collateralTokens) =>
      combineLatest(
        collateralTokens.map((collateralToken) =>
          combineLatest(
            of(collateralToken),
            tokenBalance$(collateralToken, address),
            oraclePriceData$(collateralToken),
          ),
        ),
      ),
    ),
    map((data) =>
      data.reduce(
        (acc, [collateralToken, balance, { currentPrice: price }]) => ({
          ...acc,
          [collateralToken]: { balance, price },
        }),
        {},
      ),
    ),
  )
}

export function createAllowance$(
  context$: Observable<Context>,
  tokenAllowance$: CallObservable<typeof tokenAllowance>,
  token: string,
  owner: string,
  spender: string,
) {
  return context$.pipe(
    switchMap(() => {
      if (token === 'MTR') return of(maxUint256)
      return tokenAllowance$({ token, owner, spender })
    }),
  )
}
