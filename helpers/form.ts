import { TxMeta, TxState, TxStatus } from '@oasisdex/transactions'
import { amountFromWei } from '@oasisdex/utils'
import { BigNumber } from 'bignumber.js'
import { TxHelpers, TxHelpers$ } from 'components/AppContext'
import { combineLatest, Observable, of } from 'rxjs'
import { takeWhileInclusive } from 'rxjs-take-while-inclusive'
import { catchError, first, flatMap, map, startWith, switchMap } from 'rxjs/operators'
import { OmitProperties, ValueOf } from 'ts-essentials'

import { Ticker } from '../blockchain/prices'

export enum FormStage {
  idle = 'idle',
  blocked = 'blocked',
}

export enum ProgressStage {
  waitingForApproval = 'waitingForApproval',
  waitingForConfirmation = 'waitingForConfirmation',
  fiasco = 'fiasco',
  done = 'done',
  canceled = 'canceled',
}

export enum FormChangeKind {
  kindChange = 'kind',
  priceFieldChange = 'price',
  amountFieldChange = 'amount',
  totalFieldChange = 'total',
  setMaxChange = 'setMax',
  gasPriceChange = 'gasPrice',
  coinPriceUSDChange = 'coinPriceUSDChange',
  sellAllowanceChange = 'sellAllowance',
  buyAllowanceChange = 'buyAllowance',
  formStageChange = 'stage',
  formResetChange = 'reset',
  orderbookChange = 'orderbook',
  balancesChange = 'balancesChange',
  tokenChange = 'tokenChange',
  dustLimitChange = 'dustLimitChange',
  userChange = 'userChange',
  matchTypeChange = 'matchType',
  pickOfferChange = 'pickOffer',
  progress = 'progress',
  coinBalanceChange = 'coinBalanceChange',
  slippageLimitChange = 'slippageLimitChange',
  viewChange = 'viewChange',
  accountChange = 'accountChange',
  ordersChange = 'ordersChange',
  checkboxChange = 'checkboxChange',
}

export enum OfferMatchType {
  limitOrder = 'limitOrder',
  immediateOrCancel = 'immediateOrCancel',
  fillOrKill = 'fillOrKill',
  direct = 'direct',
}

export interface StageChange {
  kind: FormChangeKind.formStageChange
  stage: FormStage
}

export function formStageChange(stage: FormStage): StageChange {
  return { stage, kind: FormChangeKind.formStageChange }
}

export interface PriceFieldChange {
  kind: FormChangeKind.priceFieldChange
  value?: BigNumber
}

export interface AmountFieldChange {
  kind: FormChangeKind.amountFieldChange
  value?: BigNumber
}

export interface TotalFieldChange {
  kind: FormChangeKind.totalFieldChange
  value?: BigNumber
}

export interface TokenChange {
  kind: FormChangeKind.tokenChange
  token: string
}

export interface SetMaxChange {
  kind: FormChangeKind.setMaxChange
}

export interface MatchTypeChange {
  kind: FormChangeKind.matchTypeChange
  matchType: OfferMatchType
}

export interface FormResetChange {
  kind: FormChangeKind.formResetChange
}

export interface GasPriceChange {
  kind: FormChangeKind.gasPriceChange
  value: BigNumber
}

export interface CoinPriceUSDChange {
  kind: FormChangeKind.coinPriceUSDChange
  value: BigNumber
}

export interface AllowanceChange {
  kind: FormChangeKind.buyAllowanceChange | FormChangeKind.sellAllowanceChange
  allowance: boolean
}

export interface DustLimitChange {
  kind: FormChangeKind.dustLimitChange
  dustLimitBase: BigNumber
  dustLimitQuote: BigNumber
}

export interface ProgressChange {
  kind: FormChangeKind.progress
  progress?: ProgressStage
}

export interface CoinBalanceChange {
  kind: FormChangeKind.coinBalanceChange
  coinBalance: BigNumber
}

export interface SlippageLimitChange {
  kind: FormChangeKind.slippageLimitChange
  value: BigNumber
}

export interface AccountChange {
  kind: FormChangeKind.accountChange
  value: string
}

export interface CheckboxChange {
  kind: FormChangeKind.checkboxChange
  value: boolean
}

export function progressChange(progress?: ProgressStage): ProgressChange {
  return { progress, kind: FormChangeKind.progress }
}

export function toCoinBalanceChange(coinBalance$: Observable<BigNumber>) {
  return coinBalance$.pipe(
    map((coinBalance) => ({
      coinBalance,
      kind: FormChangeKind.coinBalanceChange,
    })),
  )
}

export function toGasPriceChange(gasPrice$: Observable<BigNumber>): Observable<GasPriceChange> {
  return gasPrice$.pipe(
    map(
      (gasPrice) =>
        ({
          kind: FormChangeKind.gasPriceChange,
          value: gasPrice,
        } as GasPriceChange),
    ),
  )
}

export function toCoinPriceUSDChange(
  COINUsd$: Observable<BigNumber | undefined>,
): Observable<CoinPriceUSDChange> {
  return COINUsd$.pipe(
    map(
      (value) =>
        ({
          value,
          kind: FormChangeKind.coinPriceUSDChange,
        } as CoinPriceUSDChange),
    ),
  )
}

export function toAllowanceChange$(
  kind: FormChangeKind.buyAllowanceChange | FormChangeKind.sellAllowanceChange,
  token: string,
  theAllowance$: (token: string) => Observable<boolean>,
): Observable<AllowanceChange> {
  return theAllowance$(token).pipe(
    map((allowance: boolean) => ({ kind, allowance } as AllowanceChange)),
  )
}

export function toAccountChange(account$: Observable<string | undefined>) {
  return account$.pipe(
    map(
      (value) =>
        ({
          value,
          kind: FormChangeKind.accountChange,
        } as AccountChange),
    ),
  )
}

type TxState$ToX$<X, Y extends TxMeta> = (txState$: Observable<TxState<Y>>) => Observable<X>
type TxStateToX$<X, Y extends TxMeta> = (txState: TxState<Y>) => Observable<X>

function isFunction(f: any): f is Function {
  return typeof f === 'function'
}

export function transactionToX<X, Y extends TxMeta>(
  startWithX: X,
  waitingForConfirmationX: X | TxStateToX$<X, Y>,
  fiascoX: X | TxStateToX$<X, Y>,
  successHandler?: TxStateToX$<X, Y>,
  confirmations: number = 0,
): TxState$ToX$<X, Y> {
  return (txState$: Observable<TxState<Y>>) =>
    txState$.pipe(
      takeWhileInclusive((txState: TxState<Y>) => {
        return (
          (txState.status === TxStatus.Success && txState.confirmations < confirmations) ||
          txState.status !== TxStatus.Success
        )
      }),
      flatMap(
        (txState: TxState<Y>): Observable<X> => {
          switch (txState.status) {
            case TxStatus.CancelledByTheUser:
            case TxStatus.Failure:
            case TxStatus.Error:
              return isFunction(fiascoX) ? fiascoX(txState) : of(fiascoX)
            case TxStatus.Propagating:
            case TxStatus.WaitingForConfirmation:
              return isFunction(waitingForConfirmationX)
                ? waitingForConfirmationX(txState)
                : of(waitingForConfirmationX)
            case TxStatus.Success:
              return successHandler ? successHandler(txState) : of()
            default:
              return of()
          }
        },
      ),
      startWith(startWithX),
    )
}

export enum GasEstimationStatus {
  unset = 'unset',
  calculating = 'calculating',
  calculated = 'calculated',
  error = 'error',
  unknown = 'unknown',
}

export interface HasGasEstimationCost {
  gasEstimationUsd?: BigNumber
  gasEstimationCoin?: BigNumber
  gasEstimationStbl?: BigNumber
}

export interface HasGasEstimation extends HasGasEstimationCost {
  gasEstimationStatus: GasEstimationStatus
  error?: any
  gasEstimation?: number
}

export function doGasEstimation<S extends HasGasEstimation>(
  gasPrice$: Observable<BigNumber>,
  tokenPricesInUSD$: Observable<Ticker>,
  txHelpers$: TxHelpers$,
  state: S,
  call: (send: TxHelpers, state: S) => Observable<number> | undefined,
): Observable<S> {
  return combineLatest(gasPrice$, tokenPricesInUSD$, txHelpers$).pipe(
    first(),
    switchMap(([gasPrice, { MTR: COINUsd, MONE: STBLUsd }, txHelpers]) => {
      if (state.gasEstimationStatus !== GasEstimationStatus.unset) {
        return of(state)
      }

      const { gasEstimationCoin, gasEstimationUsd, ...stateWithoutGasEstimation } = state

      const gasCall = call(txHelpers, state)

      if (!gasPrice || !gasCall) {
        return of({
          ...stateWithoutGasEstimation,
          gasEstimationStatus: GasEstimationStatus.unset,
        } as S)
      }

      return gasCall.pipe(
        map((gasEstimation: number) => {
          const gasCost = amountFromWei(gasPrice.times(gasEstimation))
          const gasEstimationUsd = COINUsd ? gasCost.times(COINUsd) : undefined
          const gasEstimationStbl =
            gasEstimationUsd && STBLUsd ? gasEstimationUsd.div(STBLUsd) : undefined

          return {
            ...state,
            gasEstimation,
            gasEstimationStatus: GasEstimationStatus.calculated,
            gasEstimationCoin: gasCost,
            gasEstimationUsd,
            gasEstimationStbl,
          }
        }),
      )
    }),
    catchError((error) => {
      console.warn('Error while estimating gas:', error.toString())
      return of({
        ...state,
        error,
        gasEstimationStatus: GasEstimationStatus.error,
      })
    }),
    startWith({
      ...state,
      gasEstimationStatus: GasEstimationStatus.calculating,
    } as S),
  )
}

type OmitFunctions<S> = OmitProperties<Required<S>, (...arg: any[]) => any>

export type Change<S, K extends keyof S> = {
  kind: K
} & {
  [value in K]: S[K]
}

export type Changes<S> = ValueOf<{ [K in keyof OmitFunctions<S>]-?: Change<S, K> }>

export type ApplyChange<S extends {}, C extends Change<any, any> = Changes<S>> = (
  state: S,
  changes: C,
) => S

export function applyChange<S extends {}, C extends Change<any, any>>(state: S, change: C): S {
  return { ...state, [change.kind]: change[change.kind] }
}

export type Direction = 'ASC' | 'DESC' | undefined

export function toggleSort<T extends string | undefined>(
  current: T,
  currentDirection: Direction,
  next: T,
): [T | undefined, Direction] {
  if (current === undefined || current !== next) {
    return [next, 'DESC']
  }

  if (currentDirection === 'DESC') {
    return [next, 'ASC']
  }

  return [undefined, undefined]
}

export interface SortFilters<T extends string> {
  sortBy: T | undefined
  direction: Direction
  change: (ch: { kind: 'sortBy'; sortBy: T | undefined }) => void
}
