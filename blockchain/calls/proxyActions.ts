import { BigNumber } from 'bignumber.js'
import dsProxy from 'blockchain/abi/ds-proxy.json'
import { TransactionDef } from 'blockchain/calls/callsHelpers'
import { contractDesc } from 'blockchain/config'
import { ContextConnected } from 'blockchain/network'
import { amountToWad, amountToWei } from 'blockchain/utils'
import { zero } from 'helpers/zero'
import { DsProxy } from 'types/web3-v1-contracts/ds-proxy'
import { DssProxyActions } from 'types/web3-v1-contracts/dss-proxy-actions'
import Web3 from 'web3'

import { TxMetaKind } from './txMeta'

export type WithdrawAndPaybackData = {
  kind: TxMetaKind.withdrawAndPayback
  id: BigNumber
  token: string
  ilk: string
  withdrawAmount: BigNumber
  paybackAmount: BigNumber
  proxyAddress: string
  shouldPaybackAll: boolean
}

export function getWithdrawAndPaybackCallData(
  data: WithdrawAndPaybackData,
  context: ContextConnected,
) {
  const { dssProxyActions, dssCdpManager, mcdJoinUsdv, joins, contract } = context
  const { id, token, withdrawAmount, paybackAmount, ilk, shouldPaybackAll } = data

  if (withdrawAmount.gt(zero) && paybackAmount.gt(zero)) {
    if (token === 'VLX') {
      if (shouldPaybackAll) {
        return contract<DssProxyActions>(dssProxyActions).methods.wipeAllAndFreeVLX(
          dssCdpManager.address,
          joins[ilk],
          mcdJoinUsdv.address,
          id.toString(),
          amountToWei(withdrawAmount, token).toFixed(0),
        )
      }

      return contract<DssProxyActions>(dssProxyActions).methods.wipeAndFreeVLX(
        dssCdpManager.address,
        joins[ilk],
        mcdJoinUsdv.address,
        id.toString(),
        amountToWei(withdrawAmount, token).toFixed(0),
        amountToWei(paybackAmount, 'USDV').toFixed(0),
      )
    }

    if (shouldPaybackAll) {
      return contract<DssProxyActions>(dssProxyActions).methods.wipeAllAndFreeGem(
        dssCdpManager.address,
        joins[ilk],
        mcdJoinUsdv.address,
        id.toString(),
        amountToWei(withdrawAmount, token).toFixed(0),
      )
    }

    return contract<DssProxyActions>(dssProxyActions).methods.wipeAndFreeGem(
      dssCdpManager.address,
      joins[ilk],
      mcdJoinUsdv.address,
      id.toString(),
      amountToWei(withdrawAmount, token).toFixed(0),
      amountToWei(paybackAmount, 'USDV').toFixed(0),
    )
  }

  if (withdrawAmount.gt(zero)) {
    if (token === 'VLX') {
      return contract<DssProxyActions>(dssProxyActions).methods.freeVLX(
        dssCdpManager.address,
        joins[ilk],
        id.toString(),
        amountToWei(withdrawAmount, token).toFixed(0),
      )
    }
    return contract<DssProxyActions>(dssProxyActions).methods.freeGem(
      dssCdpManager.address,
      joins[ilk],
      id.toString(),
      amountToWei(withdrawAmount, token).toFixed(0),
    )
  }

  if (paybackAmount.gt(zero)) {
    if (shouldPaybackAll) {
      return contract<DssProxyActions>(dssProxyActions).methods.wipeAll(
        dssCdpManager.address,
        mcdJoinUsdv.address,
        id.toString(),
      )
    }

    return contract<DssProxyActions>(dssProxyActions).methods.wipe(
      dssCdpManager.address,
      mcdJoinUsdv.address,
      id.toString(),
      amountToWei(paybackAmount, 'USDV').toFixed(0),
    )
  }

  // would be nice to remove this for Unreachable error case in the future
  throw new Error('Could not make correct proxyActions call')
}

export const withdrawAndPayback: TransactionDef<WithdrawAndPaybackData> = {
  call: ({ proxyAddress }, { contract }) => {
    return contract<DsProxy>(contractDesc(dsProxy, proxyAddress)).methods['execute(address,bytes)']
  },
  prepareArgs: (data, context) => {
    const { dssProxyActions } = context
    return [dssProxyActions.address, getWithdrawAndPaybackCallData(data, context).encodeABI()]
  },
}

export type DepositAndGenerateData = {
  kind: TxMetaKind.depositAndGenerate
  id: BigNumber
  token: string
  ilk: string
  depositAmount: BigNumber
  generateAmount: BigNumber
  proxyAddress: string
}

function getDepositAndGenerateCallData(data: DepositAndGenerateData, context: ContextConnected) {
  const { dssProxyActions, dssCdpManager, mcdJoinUsdv, mcdJug, joins, contract } = context
  const { id, token, depositAmount, generateAmount, ilk } = data

  if (depositAmount.gt(zero) && generateAmount.gt(zero)) {
    if (token === 'VLX') {
      return contract<DssProxyActions>(dssProxyActions).methods.lockVLXAndDraw(
        dssCdpManager.address,
        mcdJug.address,
        joins[ilk],
        mcdJoinUsdv.address,
        id.toString(),
        amountToWei(generateAmount, 'USDV').toFixed(0),
      )
    }
    return contract<DssProxyActions>(dssProxyActions).methods.lockGemAndDraw(
      dssCdpManager.address,
      mcdJug.address,
      joins[ilk],
      mcdJoinUsdv.address,
      id.toString(),
      amountToWei(depositAmount, token).toFixed(0),
      amountToWei(generateAmount, 'USDV').toFixed(0),
      true,
    )
  }

  if (depositAmount.gt(zero)) {
    if (token === 'VLX') {
      return contract<DssProxyActions>(dssProxyActions).methods.lockVLX(
        dssCdpManager.address,
        joins[ilk],
        id.toString(),
      )
    }

    return contract<DssProxyActions>(dssProxyActions).methods.lockGem(
      dssCdpManager.address,
      joins[ilk],
      id.toString(),
      amountToWei(depositAmount, token).toFixed(0),
      true,
    )
  }

  return contract<DssProxyActions>(dssProxyActions).methods.draw(
    dssCdpManager.address,
    mcdJug.address,
    mcdJoinUsdv.address,
    id.toString(),
    amountToWei(generateAmount, 'USDV').toFixed(0),
  )
}

export const depositAndGenerate: TransactionDef<DepositAndGenerateData> = {
  call: ({ proxyAddress }, { contract }) => {
    return contract<DsProxy>(contractDesc(dsProxy, proxyAddress)).methods['execute(address,bytes)']
  },
  prepareArgs: (data, context) => {
    const { dssProxyActions } = context
    return [dssProxyActions.address, getDepositAndGenerateCallData(data, context).encodeABI()]
  },
  options: ({ token, depositAmount }) =>
    token === 'VLX' ? { value: amountToWei(depositAmount, 'VLX').toString() } : {},
}

export type OpenData = {
  kind: TxMetaKind.open
  token: string
  ilk: string
  depositAmount: BigNumber
  generateAmount: BigNumber
  proxyAddress: string
}

function getOpenCallData(data: OpenData, context: ContextConnected) {
  const { dssProxyActions, dssCdpManager, mcdJoinUsdv, mcdJug, joins, contract } = context
  const { depositAmount, generateAmount, token, ilk, proxyAddress } = data

  if (depositAmount.gt(zero) && generateAmount.gt(zero)) {
    if (token === 'VLX') {
      return contract<DssProxyActions>(dssProxyActions).methods.openLockVLXAndDraw(
        dssCdpManager.address,
        mcdJug.address,
        joins[ilk],
        mcdJoinUsdv.address,
        Web3.utils.utf8ToHex(ilk),
        amountToWei(generateAmount, 'USDV').toFixed(0),
      )
    }

    return contract<DssProxyActions>(dssProxyActions).methods.openLockGemAndDraw(
      dssCdpManager.address,
      mcdJug.address,
      joins[ilk],
      mcdJoinUsdv.address,
      Web3.utils.utf8ToHex(ilk),
      amountToWei(depositAmount, token).toFixed(0),
      amountToWei(generateAmount, 'USDV').toFixed(0),
      true,
    )
  }

  if (depositAmount.gt(zero) && generateAmount.isZero()) {
    if (token === 'VLX') {
      return contract<DssProxyActions>(dssProxyActions).methods.openLockVLXAndDraw(
        dssCdpManager.address,
        mcdJug.address,
        joins[ilk],
        mcdJoinUsdv.address,
        Web3.utils.utf8ToHex(ilk),
        zero.toFixed(0),
      )
    }

    return contract<DssProxyActions>(dssProxyActions).methods.openLockGemAndDraw(
      dssCdpManager.address,
      mcdJug.address,
      joins[ilk],
      mcdJoinUsdv.address,
      Web3.utils.utf8ToHex(ilk),
      amountToWei(depositAmount, token).toFixed(0),
      zero.toFixed(0),
      true,
    )
  }

  return contract<DssProxyActions>(dssProxyActions).methods.open(
    dssCdpManager.address,
    Web3.utils.utf8ToHex(ilk),
    proxyAddress,
  )
}

export const open: TransactionDef<OpenData> = {
  call: ({ proxyAddress }, { contract }) => {
    return contract<DsProxy>(contractDesc(dsProxy, proxyAddress)).methods['execute(address,bytes)']
  },
  prepareArgs: (data, context) => {
    const { dssProxyActions } = context
    return [dssProxyActions.address, getOpenCallData(data, context).encodeABI()]
  },
  options: ({ token, depositAmount }) =>
    token === 'VLX' ? { value: amountToWei(depositAmount, 'VLX').toString() } : {},
}

export type ReclaimData = {
  kind: TxMetaKind.reclaim
  proxyAddress: string
  amount: BigNumber
  token: string
  id: BigNumber
}

export const reclaim: TransactionDef<ReclaimData> = {
  call: ({ proxyAddress }, { contract }) => {
    return contract<DsProxy>(contractDesc(dsProxy, proxyAddress)).methods['execute(address,bytes)']
  },
  prepareArgs: (data, context) => {
    const { dssProxyActions, dssCdpManager } = context

    return [
      dssProxyActions.address,
      context
        .contract<DssProxyActions>(dssProxyActions)
        .methods.frob(
          dssCdpManager.address,
          data.id.toString(),
          amountToWad(data.amount).toFixed(0),
          zero.toFixed(0),
        )
        .encodeABI(),
    ]
  },
}
