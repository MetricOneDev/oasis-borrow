import { BigNumber } from 'bignumber.js'
import { OraclePriceData } from 'blockchain/prices'
import { combineLatest, Observable, of } from 'rxjs'
import { map, shareReplay, switchMap } from 'rxjs/operators'
import {coinName} from "../../blockchain/config";

export interface PriceInfo {
  currentCollateralPrice: BigNumber
  currentCoinPrice: BigNumber
  nextCollateralPrice: BigNumber
  nextCoinPrice: BigNumber

  dateLastCollateralPrice?: Date
  dateNextCollateralPrice?: Date
  dateLastCoinPrice?: Date
  dateNextCoinPrice?: Date

  isStaticCollateralPrice: boolean
  isStaticCoinPrice: boolean

  collateralPricePercentageChange: BigNumber
  coinPricePercentageChange: BigNumber
}

export function createPriceInfo$(
  oraclePriceData$: (token: string) => Observable<OraclePriceData>,
  token: string,
): Observable<PriceInfo> {
  return combineLatest(oraclePriceData$(token), oraclePriceData$(coinName)).pipe(
    switchMap(
      ([
        {
          currentPrice: currentCollateralPrice,
          nextPrice: nextCollateralPrice,
          isStaticPrice: isStaticCollateralPrice,
          currentPriceUpdate: dateLastCollateralPrice,
          nextPriceUpdate: dateNextCollateralPrice,
          percentageChange: collateralPricePercentageChange,
        },
        {
          currentPrice: currentCoinPrice,
          nextPrice: nextCoinPrice,
          isStaticPrice: isStaticCoinPrice,
          currentPriceUpdate: dateLastCoinPrice,
          nextPriceUpdate: dateNextCoinPrice,
          percentageChange: coinPricePercentageChange,
        },
      ]) =>
        of({
          currentCollateralPrice,
          currentCoinPrice,
          nextCollateralPrice,
          nextCoinPrice,

          dateLastCollateralPrice,
          dateNextCollateralPrice,
          dateLastCoinPrice,
          dateNextCoinPrice,

          isStaticCollateralPrice,
          isStaticCoinPrice,

          collateralPricePercentageChange,
          coinPricePercentageChange,
        }),
    ),
    shareReplay(1),
  )
}

export interface PriceInfoChange {
  kind: 'priceInfo'
  priceInfo: PriceInfo
}

export function priceInfoChange$(
  priceInfo$: (token: string) => Observable<PriceInfo>,
  token: string,
): Observable<PriceInfoChange> {
  return priceInfo$(token).pipe(
    map((priceInfo) => ({
      kind: 'priceInfo',
      priceInfo,
    })),
  )
}
