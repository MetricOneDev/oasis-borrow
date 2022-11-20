import { ContractDesc } from '@oasisdex/web3-context'
import { keyBy } from 'lodash'
import getConfig from 'next/config'
import { Dictionary } from 'ts-essentials'

import * as coin from './abi/ds-coin-token.json'
import * as dsProxyFactory from './abi/ds-proxy-factory.json'
import * as dsProxyRegistry from './abi/ds-proxy-registry.json'
import * as dssCdpManager from './abi/dss-cdp-manager.json'
import * as dssProxyActionsDsr from './abi/dss-proxy-actions-dsr.json'
import * as dssProxyActions from './abi/dss-proxy-actions.json'
import * as erc20 from './abi/erc20.json'
import * as getCdps from './abi/get-cdps.json'
import * as otc from './abi/matching-market.json'
import * as mcdDog from './abi/mcd-dog.json'
import * as mcdEnd from './abi/mcd-end.json'
import * as mcdJoinStbl from './abi/mcd-join-stbl.json'
import * as mcdJug from './abi/mcd-jug.json'
import * as mcdPot from './abi/mcd-pot.json'
import * as mcdSpot from './abi/mcd-spot.json'
import * as otcSupport from './abi/otc-support-methods.json'
import * as vat from './abi/vat.json'
import {
  getCollateralJoinContracts,
  getCollaterals,
  getCollateralTokens,
  getOsms,
} from './addresses/addressesUtils'
import { default as meterAddresses } from './addresses/meter.json'
import { default as meterTestnetAddresses } from './addresses/meterTestnet.json'

export function contractDesc(abi: any, address: string): ContractDesc {
  return { abi, address }
}

const infuraProjectId =
  process.env.INFURA_PROJECT_ID || getConfig()?.publicRuntimeConfig?.infuraProjectId || ''
const etherscanAPIKey =
  process.env.ETHERSCAN_API_KEY || getConfig()?.publicRuntimeConfig?.etherscan || ''

const protoMeter = {
  id: '82',
  name: 'meter',
  label: 'Meter',
  infuraUrl: `https://rpc.meter.io/`,
  infuraUrlWS: `wss://ws.meter.io`,
  safeConfirmations: 10,
  otc: contractDesc(otc, '0x794e6e91555438aFc3ccF1c5076A74F42133d08D'),
  collaterals: getCollaterals(meterAddresses),
  tokens: {
    ...getCollateralTokens(meterAddresses),
    WMTR: contractDesc(coin, meterAddresses['MTR']),
    MONE: contractDesc(erc20, meterAddresses['MCD_STBL']),
    GOV: contractDesc(erc20, meterAddresses.MCD_GOV),
    CHAI: contractDesc(erc20, '0x06af07097c9eeb7fd685c692751d5c66db49c215'),
    // WBTC: contractDesc(erc20, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'),
  } as Dictionary<ContractDesc>,
  joins: {
    ...getCollateralJoinContracts(meterAddresses),
  },
  getCdps: contractDesc(getCdps, meterAddresses.GET_CDPS),
  mcdOsms: getOsms(meterAddresses),
  mcdJug: contractDesc(mcdJug, meterAddresses.MCD_JUG),
  mcdPot: contractDesc(mcdPot, meterAddresses.MCD_POT),
  mcdEnd: contractDesc(mcdEnd, meterAddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, meterAddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, meterAddresses.MCD_DOG),
  dssCdpManager: contractDesc(dssCdpManager, meterAddresses.CDP_MANAGER),
  otcSupportMethods: contractDesc(otcSupport, '0x9b3f075b12513afe56ca2ed838613b7395f57839'),
  vat: contractDesc(vat, meterAddresses.MCD_VAT),
  mcdJoinStbl: contractDesc(mcdJoinStbl, meterAddresses.MCD_JOIN_STBL),
  dsProxyRegistry: contractDesc(dsProxyRegistry, meterAddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, meterAddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, meterAddresses.PROXY_ACTIONS),
  etherscan: {
    url: 'https://scan.meter.io/',
    apiUrl: 'https://api.meter.io:8000/api',
    apiKey: etherscanAPIKey || '',
  },
  taxProxyRegistries: [meterAddresses.PROXY_REGISTRY],
  dssProxyActionsDsr: contractDesc(dssProxyActionsDsr, meterAddresses.PROXY_ACTIONS_DSR),
  magicLink: {
    apiKey: '',
  },
  cacheApi: '',
}

export type NetworkConfig = typeof protoMeter

const meter: NetworkConfig = protoMeter
const meterTestnet: NetworkConfig = {
  id: '83',
  name: 'metertestnet',
  label: 'MeterTestnet',
  infuraUrl: `https://rpctest.meter.io/`,
  infuraUrlWS: `wss://wstest.meter.io`,
  safeConfirmations: 6,
  otc: contractDesc(otc, '0xe325acB9765b02b8b418199bf9650972299235F4'),
  collaterals: getCollaterals(meterTestnetAddresses),
  tokens: {
    ...getCollateralTokens(meterTestnetAddresses),
    WMTR: contractDesc(coin, meterTestnetAddresses['MTR']),
    MONE: contractDesc(erc20, meterTestnetAddresses['MCD_STBL']),
    USDC: contractDesc(erc20, '0x198419c5c340e8De47ce4C0E4711A03664d42CB2'),
    GOV: contractDesc(erc20, meterTestnetAddresses.MCD_GOV),
    CHAI: contractDesc(erc20, '0xb641957b6c29310926110848db2d464c8c3c3f38'),
    // WBTC: contractDesc(erc20, '0xA08d982C2deBa0DbE433a9C6177a219E96CeE656'),
  },
  joins: {
    ...getCollateralJoinContracts(meterTestnetAddresses),
  },
  getCdps: contractDesc(getCdps, meterTestnetAddresses.GET_CDPS),
  mcdOsms: getOsms(meterTestnetAddresses),
  mcdPot: contractDesc(mcdPot, meterTestnetAddresses.MCD_POT),
  mcdJug: contractDesc(mcdJug, meterTestnetAddresses.MCD_JUG),
  mcdEnd: contractDesc(mcdEnd, meterTestnetAddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, meterTestnetAddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, meterTestnetAddresses.MCD_DOG),
  dssCdpManager: contractDesc(dssCdpManager, meterTestnetAddresses.CDP_MANAGER),
  otcSupportMethods: contractDesc(otcSupport, '0x303f2bf24d98325479932881657f45567b3e47a8'),
  vat: contractDesc(vat, meterTestnetAddresses.MCD_VAT),
  mcdJoinStbl: contractDesc(mcdJoinStbl, meterTestnetAddresses.MCD_JOIN_STBL),
  dsProxyRegistry: contractDesc(dsProxyRegistry, meterTestnetAddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, meterTestnetAddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, meterTestnetAddresses.PROXY_ACTIONS),
  etherscan: {
    url: 'https://scan-warringstakes.meter.io/',
    apiUrl: 'https://api.meter.io:4000/api',
    apiKey: etherscanAPIKey || '',
  },
  taxProxyRegistries: [meterTestnetAddresses.PROXY_REGISTRY],
  dssProxyActionsDsr: contractDesc(dssProxyActionsDsr, meterTestnetAddresses.PROXY_ACTIONS_DSR),
  magicLink: {
    apiKey: '',
  },
  cacheApi: '',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hardhat: NetworkConfig = {
  ...protoMeter,
  id: '2137',
  name: 'hardhat',
  label: 'Hardhat',
  infuraUrl: `http://localhost:8545`,
  infuraUrlWS: `ws://localhost:8545`,
  cacheApi: 'http://localhost:3001/v1',
}

export const networksById = keyBy([meterTestnet, ], 'id')
export const networksByName = keyBy([meterTestnet, ], 'name')

export const dappName = 'Vaults'
export const pollingInterval = 12000
