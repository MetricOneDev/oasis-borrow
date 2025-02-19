import { TxStatus } from '@oasisdex/transactions'
import { BigNumber } from 'bignumber.js'
import { approve, ApproveData } from 'blockchain/calls/erc20'
import { createDsProxy, CreateDsProxyData } from 'blockchain/calls/proxy'
import {
  depositAndGenerate,
  DepositAndGenerateData,
  withdrawAndPayback,
  WithdrawAndPaybackData,
} from 'blockchain/calls/proxyActions'
import { TxMetaKind } from 'blockchain/calls/txMeta'
import { TxHelpers } from 'components/AppContext'
import { transactionToX } from 'helpers/form'
import { zero } from 'helpers/zero'
import { iif, Observable, of } from 'rxjs'
import { filter, first, switchMap } from 'rxjs/operators'

import { ManageVaultChange, ManageVaultState } from './manageVault'

type ProxyChange =
  | {
      kind: 'proxyWaitingForApproval'
    }
  | {
      kind: 'proxyInProgress'
      proxyTxHash: string
    }
  | {
      kind: 'proxyFailure'
      txError?: any
    }
  | {
      kind: 'proxyConfirming'
      proxyConfirmations?: number
    }
  | {
      kind: 'proxySuccess'
      proxyAddress: string
    }

type CollateralAllowanceChange =
  | { kind: 'collateralAllowanceWaitingForApproval' }
  | {
      kind: 'collateralAllowanceInProgress'
      collateralAllowanceTxHash: string
    }
  | {
      kind: 'collateralAllowanceFailure'
      txError?: any
    }
  | {
      kind: 'collateralAllowanceSuccess'
      collateralAllowance: BigNumber
    }

type StblAllowanceChange =
  | { kind: 'stblAllowanceWaitingForApproval' }
  | {
      kind: 'stblAllowanceInProgress'
      stblAllowanceTxHash: string
    }
  | {
      kind: 'stblAllowanceFailure'
      txError?: any
    }
  | {
      kind: 'stblAllowanceSuccess'
  stblAllowance: BigNumber
    }

type ManageChange =
  | { kind: 'manageWaitingForApproval' }
  | {
      kind: 'manageInProgress'
      manageTxHash: string
    }
  | {
      kind: 'manageFailure'
      txError?: any
    }
  | {
      kind: 'manageSuccess'
    }

export type ManageVaultTransactionChange =
  | ProxyChange
  | CollateralAllowanceChange
  | StblAllowanceChange
  | ManageChange

export function applyManageVaultTransaction(
  change: ManageVaultChange,
  state: ManageVaultState,
): ManageVaultState {
  if (change.kind === 'proxyWaitingForApproval') {
    return {
      ...state,
      stage: 'proxyWaitingForApproval',
    }
  }

  if (change.kind === 'proxyInProgress') {
    const { proxyTxHash } = change
    return {
      ...state,
      stage: 'proxyInProgress',
      proxyTxHash,
    }
  }

  if (change.kind === 'proxyFailure') {
    const { txError } = change
    return { ...state, stage: 'proxyFailure', txError }
  }

  if (change.kind === 'proxyConfirming') {
    const { proxyConfirmations } = change
    return {
      ...state,
      proxyConfirmations,
    }
  }

  if (change.kind === 'proxySuccess') {
    const { proxyAddress } = change
    return {
      ...state,
      proxyAddress,
      stage: 'proxySuccess',
    }
  }

  if (change.kind === 'collateralAllowanceWaitingForApproval') {
    return {
      ...state,
      stage: 'collateralAllowanceWaitingForApproval',
    }
  }

  if (change.kind === 'collateralAllowanceInProgress') {
    const { collateralAllowanceTxHash } = change
    return {
      ...state,
      collateralAllowanceTxHash,
      stage: 'collateralAllowanceInProgress',
    }
  }

  if (change.kind === 'collateralAllowanceFailure') {
    const { txError } = change
    return {
      ...state,
      stage: 'collateralAllowanceFailure',
      txError,
    }
  }

  if (change.kind === 'collateralAllowanceSuccess') {
    const { collateralAllowance } = change
    return { ...state, stage: 'collateralAllowanceSuccess', collateralAllowance }
  }

  if (change.kind === 'stblAllowanceWaitingForApproval') {
    return {
      ...state,
      stage: 'stblAllowanceWaitingForApproval',
    }
  }

  if (change.kind === 'stblAllowanceInProgress') {
    const { stblAllowanceTxHash } = change
    return {
      ...state,
      stblAllowanceTxHash,
      stage: 'stblAllowanceInProgress',
    }
  }

  if (change.kind === 'stblAllowanceFailure') {
    const { txError } = change
    return {
      ...state,
      stage: 'stblAllowanceFailure',
      txError,
    }
  }

  if (change.kind === 'stblAllowanceSuccess') {
    const { stblAllowance } = change
    return { ...state, stage: 'stblAllowanceSuccess', stblAllowance }
  }

  if (change.kind === 'manageWaitingForApproval') {
    return {
      ...state,
      stage: 'manageWaitingForApproval',
    }
  }

  if (change.kind === 'manageInProgress') {
    const { manageTxHash } = change
    return {
      ...state,
      manageTxHash,
      stage: 'manageInProgress',
    }
  }

  if (change.kind === 'manageFailure') {
    const { txError } = change
    return {
      ...state,
      stage: 'manageFailure',
      txError,
    }
  }

  if (change.kind === 'manageSuccess') {
    return { ...state, stage: 'manageSuccess' }
  }

  return state
}

export function manageVaultDepositAndGenerate(
  txHelpers$: Observable<TxHelpers>,
  change: (ch: ManageVaultChange) => void,
  { generateAmount, depositAmount, proxyAddress, vault: { ilk, token, id } }: ManageVaultState,
) {
  txHelpers$
    .pipe(
      first(),
      switchMap(({ sendWithGasEstimation }) =>
        sendWithGasEstimation(depositAndGenerate, {
          kind: TxMetaKind.depositAndGenerate,
          generateAmount: generateAmount || zero,
          depositAmount: depositAmount || zero,
          proxyAddress: proxyAddress!,
          ilk,
          token,
          id,
        }).pipe(
          transactionToX<ManageVaultChange, DepositAndGenerateData>(
            { kind: 'manageWaitingForApproval' },
            (txState) =>
              of({
                kind: 'manageInProgress',
                manageTxHash: (txState as any).txHash as string,
              }),
            (txState) => {
              return of({
                kind: 'manageFailure',
                txError:
                  txState.status === TxStatus.Error ||
                  txState.status === TxStatus.CancelledByTheUser
                    ? txState.error
                    : undefined,
              })
            },
            () => of({ kind: 'manageSuccess' }),
          ),
        ),
      ),
    )
    .subscribe((ch) => change(ch))
}

export function manageVaultWithdrawAndPayback(
  txHelpers$: Observable<TxHelpers>,
  change: (ch: ManageVaultChange) => void,
  {
    withdrawAmount,
    paybackAmount,
    proxyAddress,
    vault: { ilk, token, id },
    shouldPaybackAll,
  }: ManageVaultState,
) {
  txHelpers$
    .pipe(
      first(),
      switchMap(({ sendWithGasEstimation }) =>
        sendWithGasEstimation(withdrawAndPayback, {
          kind: TxMetaKind.withdrawAndPayback,
          withdrawAmount: withdrawAmount || zero,
          paybackAmount: paybackAmount || zero,
          proxyAddress: proxyAddress!,
          ilk,
          token,
          id,
          shouldPaybackAll,
        }).pipe(
          transactionToX<ManageVaultChange, WithdrawAndPaybackData>(
            { kind: 'manageWaitingForApproval' },
            (txState) =>
              of({
                kind: 'manageInProgress',
                manageTxHash: (txState as any).txHash as string,
              }),
            (txState) => {
              return of({
                kind: 'manageFailure',
                txError:
                  txState.status === TxStatus.Error ||
                  txState.status === TxStatus.CancelledByTheUser
                    ? txState.error
                    : undefined,
              })
            },
            () => of({ kind: 'manageSuccess' }),
          ),
        ),
      ),
    )
    .subscribe((ch) => change(ch))
}

export function setStblAllowance(
  txHelpers$: Observable<TxHelpers>,
  change: (ch: ManageVaultChange) => void,
  state: ManageVaultState,
) {
  txHelpers$
    .pipe(
      first(),
      switchMap(({ sendWithGasEstimation }) =>
        sendWithGasEstimation(approve, {
          kind: TxMetaKind.approve,
          token: 'MONE',
          spender: state.proxyAddress!,
          amount: state.stblAllowanceAmount!,
        }).pipe(
          transactionToX<ManageVaultChange, ApproveData>(
            { kind: 'stblAllowanceWaitingForApproval' },
            (txState) =>
              of({
                kind: 'stblAllowanceInProgress',
                stblAllowanceTxHash: (txState as any).txHash as string,
              }),
            (txState) =>
              of({
                kind: 'stblAllowanceFailure',
                txError:
                  txState.status === TxStatus.Error ||
                  txState.status === TxStatus.CancelledByTheUser
                    ? txState.error
                    : undefined,
              }),
            (txState) => of({ kind: 'stblAllowanceSuccess', stblAllowance: txState.meta.amount }),
          ),
        ),
      ),
    )
    .subscribe((ch) => change(ch))
}

export function setCollateralAllowance(
  txHelpers$: Observable<TxHelpers>,
  change: (ch: ManageVaultChange) => void,
  state: ManageVaultState,
) {
  txHelpers$
    .pipe(
      first(),
      switchMap(({ sendWithGasEstimation }) =>
        sendWithGasEstimation(approve, {
          kind: TxMetaKind.approve,
          token: state.vault.token,
          spender: state.proxyAddress!,
          amount: state.collateralAllowanceAmount!,
        }).pipe(
          transactionToX<ManageVaultChange, ApproveData>(
            { kind: 'collateralAllowanceWaitingForApproval' },
            (txState) =>
              of({
                kind: 'collateralAllowanceInProgress',
                collateralAllowanceTxHash: (txState as any).txHash as string,
              }),
            (txState) =>
              of({
                kind: 'collateralAllowanceFailure',
                txError:
                  txState.status === TxStatus.Error ||
                  txState.status === TxStatus.CancelledByTheUser
                    ? txState.error
                    : undefined,
              }),
            (txState) =>
              of({
                kind: 'collateralAllowanceSuccess',
                collateralAllowance: txState.meta.amount,
              }),
          ),
        ),
      ),
    )
    .subscribe((ch) => change(ch))
}

export function createProxy(
  txHelpers$: Observable<TxHelpers>,
  proxyAddress$: Observable<string | undefined>,
  change: (ch: ManageVaultChange) => void,
  { safeConfirmations }: ManageVaultState,
) {
  txHelpers$
    .pipe(
      first(),
      switchMap(({ sendWithGasEstimation }) =>
        sendWithGasEstimation(createDsProxy, { kind: TxMetaKind.createDsProxy }).pipe(
          transactionToX<ManageVaultChange, CreateDsProxyData>(
            { kind: 'proxyWaitingForApproval' },
            (txState) =>
              of({
                kind: 'proxyInProgress',
                proxyTxHash: (txState as any).txHash as string,
              }),
            (txState) =>
              of({
                kind: 'proxyFailure',
                txError:
                  txState.status === TxStatus.Error ||
                  txState.status === TxStatus.CancelledByTheUser
                    ? txState.error
                    : undefined,
              }),
            (txState) => {
              return proxyAddress$.pipe(
                filter((proxyAddress) => !!proxyAddress),
                switchMap((proxyAddress) => {
                  return iif(
                    () => (txState as any).confirmations < safeConfirmations,
                    of({
                      kind: 'proxyConfirming',
                      proxyConfirmations: (txState as any).confirmations,
                    }),
                    of({ kind: 'proxySuccess', proxyAddress: proxyAddress! }),
                  )
                }),
              )
            },
            safeConfirmations,
          ),
        ),
      ),
    )
    .subscribe((ch) => change(ch))
}
