import { BigNumber } from 'bignumber.js'
import { ManageVaultView } from 'features/manageVault/ManageVaultView'
import { DEFAULT_PROXY_ADDRESS } from 'helpers/mocks/vaults.mock'
import { manageVaultStory } from 'helpers/stories/ManageVaultStory'
import { zero } from 'helpers/zero'

const proxyAddress = DEFAULT_PROXY_ADDRESS

export const CollateralEditingStage = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('2000') },
  proxyAddress,
})({
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const StblEditingStage = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
  proxyAddress,
})({
  stage: 'stblEditing',
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const ProxyWaitingForConfirmation = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
})({
  stage: 'proxyWaitingForConfirmation',
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const ProxyWaitingForApproval = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
})({
  stage: 'proxyWaitingForApproval',
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const ProxyFailure = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
})({
  stage: 'proxyFailure',
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const ProxyInProgress = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
})({
  stage: 'proxyInProgress',
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const ProxySuccess = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
  proxyAddress,
})({
  stage: 'proxySuccess',
  generateAmount: new BigNumber('300'),
  depositAmount: new BigNumber('2'),
})

export const CollateralAllowanceWaitingForConfirmation = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
  proxyAddress,
  collateralAllowance: zero,
})({
  stage: 'collateralAllowanceWaitingForConfirmation',
  generateAmount: new BigNumber('300'),
  depositAmount: new BigNumber('2'),
})

export const CollateralAllowanceWaitingForApproval = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
  proxyAddress,
  collateralAllowance: zero,
})({
  stage: 'collateralAllowanceWaitingForApproval',
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const CollateralAllowanceFailure = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
  proxyAddress,
  collateralAllowance: zero,
})({
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
  stage: 'collateralAllowanceFailure',
})

export const CollateralAllowanceInProgress = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
  proxyAddress,
  collateralAllowance: zero,
})({
  stage: 'collateralAllowanceInProgress',
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
})

export const CollateralAllowanceSuccess = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200') },
  proxyAddress,
})({
  depositAmount: new BigNumber('2'),
  generateAmount: new BigNumber('300'),
  stage: 'collateralAllowanceSuccess',
})

export const StblAllowanceWaitingForConfirmation = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
  stblAllowance: zero,
})({
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
  stage: 'stblAllowanceWaitingForConfirmation',
})

export const StblAllowanceWaitingForApproval = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
  stblAllowance: zero,
})({
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
  stage: 'stblAllowanceWaitingForApproval',
})

export const StblAllowanceFailure = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
  stblAllowance: zero,
})({
  stage: 'stblAllowanceFailure',
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
})

export const StblAllowanceInProgress = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
  stblAllowance: zero,
})({
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
  stage: 'stblAllowanceInProgress',
})

export const StblAllowanceSuccess = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
})({
  stage: 'stblAllowanceSuccess',
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
})

export const ManageWaitingForConfirmation = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
})({
  stage: 'manageWaitingForConfirmation',
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
})

export const ManageWaitingForApproval = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
})({
  stage: 'manageWaitingForApproval',
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
})

export const ManageFailure = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
})({
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
  stage: 'manageFailure',
})

export const ManageInProgress = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
})({
  stage: 'manageInProgress',
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
})

export const ManageSuccess = manageVaultStory({
  vault: {
    ilk: 'WBTC-A',
    collateral: new BigNumber('20'),
    debt: new BigNumber('3000'),
  },
  balanceInfo: { collateralBalance: new BigNumber('200'), stblBalance: new BigNumber('1000') },
  proxyAddress,
})({
  stage: 'manageSuccess',
  withdrawAmount: new BigNumber('0.5'),
  paybackAmount: new BigNumber('300'),
})

// eslint-disable-next-line import/no-default-export
export default {
  title: 'ManageVault/Stages',
  component: ManageVaultView,
}
