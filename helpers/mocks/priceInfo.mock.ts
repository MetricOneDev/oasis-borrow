import { BigNumber } from 'bignumber.js'
import { OraclePriceData } from 'blockchain/prices'
import { createPriceInfo$, PriceInfo } from 'features/shared/priceInfo'
import { lastHour, nextHour } from 'helpers/time'
import { Observable, of } from 'rxjs'

export interface MockPriceInfoProps {
  _oraclePriceData$?: Observable<OraclePriceData>
  collateralPrice?: BigNumber
  coinPrice?: BigNumber
  isStatic?: boolean
  collateralChangePercentage?: BigNumber // changes next price
  coinChangePercentage?: BigNumber
  token?: string
}

const defaultCollateralPrice = new BigNumber('550')
const defaultCoinPrice = new BigNumber('1350')
const defaultIsStatic = false
const defaultCollateralChangePercentage = new BigNumber('0.1')
const defaultCoinChangePercentage = new BigNumber('0.0221')
const defaultToken = 'WBTC'

export function mockPriceInfo$({
  _oraclePriceData$,
  collateralPrice = defaultCollateralPrice,
  coinPrice = defaultCoinPrice,
  isStatic = defaultIsStatic,
  collateralChangePercentage = defaultCollateralChangePercentage,
  coinChangePercentage = defaultCoinChangePercentage,
  token = defaultToken,
}: MockPriceInfoProps = {}): Observable<PriceInfo> {
  const nextCoinPrice = coinPrice.plus(coinPrice.times(coinChangePercentage))
  const nextCollateralPrice = collateralPrice.plus(
    collateralPrice.times(collateralChangePercentage),
  )
  const coinPriceInfo$ = of({
    currentPrice: coinPrice,
    isStaticPrice: false,
    nextPrice: nextCoinPrice || coinPrice,
    currentPriceUpdate: lastHour,
    nextPriceUpdate: nextHour,
    percentageChange: coinChangePercentage,
  })
  const collateralPriceInfo$ = of({
    currentPrice: collateralPrice,
    isStaticPrice: isStatic,
    nextPrice: nextCollateralPrice || collateralPrice,
    percentageChange: collateralChangePercentage,
    ...(!isStatic && {
      currentPriceUpdate: lastHour,
      nextPriceUpdate: nextHour,
    }),
  })

  function oraclePriceData$(_token: string) {
    return _oraclePriceData$ || _token === 'MTR' ? coinPriceInfo$ : collateralPriceInfo$
  }
  return createPriceInfo$(oraclePriceData$, token)
}
