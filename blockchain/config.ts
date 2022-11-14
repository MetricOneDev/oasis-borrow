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
import { default as mainnetAddresses } from './addresses/mainnet.json'
import { default as meterTestnetAddresses } from './addresses/meterTestnet.json'

export function contractDesc(abi: any, address: string): ContractDesc {
  return { abi, address }
}

const infuraProjectId =
  process.env.INFURA_PROJECT_ID || getConfig()?.publicRuntimeConfig?.infuraProjectId || ''
const etherscanAPIKey =
  process.env.ETHERSCAN_API_KEY || getConfig()?.publicRuntimeConfig?.etherscan || ''

const protoMain = {
  id: '1',
  name: 'main',
  label: 'Mainnet',
  infuraUrl: `https://mainnet.infura.io/v3/${infuraProjectId}`,
  infuraUrlWS: `wss://mainnet.infura.io/ws/v3/${infuraProjectId}`,
  safeConfirmations: 10,
  otc: contractDesc(otc, '0x794e6e91555438aFc3ccF1c5076A74F42133d08D'),
  collaterals: getCollaterals(mainnetAddresses),
  tokens: {
    ...getCollateralTokens(mainnetAddresses),
    WMTR: contractDesc(coin, mainnetAddresses['ETH']),
    MONE: contractDesc(erc20, mainnetAddresses['MCD_STBL']),
    MKR: contractDesc(erc20, mainnetAddresses.MCD_GOV),
    CHAI: contractDesc(erc20, '0x06af07097c9eeb7fd685c692751d5c66db49c215'),
    // WBTC: contractDesc(erc20, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'),
  } as Dictionary<ContractDesc>,
  joins: {
    ...getCollateralJoinContracts(mainnetAddresses),
  },
  getCdps: contractDesc(getCdps, mainnetAddresses.GET_CDPS),
  mcdOsms: getOsms(mainnetAddresses),
  mcdJug: contractDesc(mcdJug, mainnetAddresses.MCD_JUG),
  mcdPot: contractDesc(mcdPot, mainnetAddresses.MCD_POT),
  mcdEnd: contractDesc(mcdEnd, mainnetAddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, mainnetAddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, mainnetAddresses.MCD_DOG),
  dssCdpManager: contractDesc(dssCdpManager, mainnetAddresses.CDP_MANAGER),
  otcSupportMethods: contractDesc(otcSupport, '0x9b3f075b12513afe56ca2ed838613b7395f57839'),
  vat: contractDesc(vat, mainnetAddresses.MCD_VAT),
  mcdJoinStbl: contractDesc(mcdJoinStbl, mainnetAddresses.MCD_JOIN_STBL),
  dsProxyRegistry: contractDesc(dsProxyRegistry, mainnetAddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, mainnetAddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, mainnetAddresses.PROXY_ACTIONS),
  etherscan: {
    url: 'https://etherscan.io',
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: etherscanAPIKey || '',
  },
  taxProxyRegistries: ['0xaa63c8683647ef91b3fdab4b4989ee9588da297b'],
  dssProxyActionsDsr: contractDesc(
    dssProxyActionsDsr,
    '0x07ee93aEEa0a36FfF2A9B95dd22Bd6049EE54f26',
  ),
  magicLink: {
    apiKey: '',
  },
  cacheApi: 'https://oazo-bcache.new.oasis.app/api/v1',
}

export type NetworkConfig = typeof protoMain

const main: NetworkConfig = protoMain
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
    MKR: contractDesc(erc20, meterTestnetAddresses.MCD_GOV),
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
    url: 'https://kovan.etherscan.io',
    apiUrl: 'https://api-kovan.etherscan.io/api',
    apiKey: etherscanAPIKey || '',
  },
  taxProxyRegistries: [meterTestnetAddresses.PROXY_REGISTRY],
  dssProxyActionsDsr: contractDesc(dssProxyActionsDsr, meterTestnetAddresses.PROXY_ACTIONS_DSR),
  magicLink: {
    apiKey: '',
  },
  cacheApi: 'https://oazo-bcache-kovan-staging.new.oasis.app/api/v1',
}

const hardhat: NetworkConfig = {
  ...protoMain,
  id: '2137',
  name: 'hardhat',
  label: 'Hardhat',
  infuraUrl: `http://localhost:8545`,
  infuraUrlWS: `ws://localhost:8545`,
  cacheApi: 'http://localhost:3001/v1',
}

export const networksById = keyBy([meterTestnet, hardhat], 'id')
export const networksByName = keyBy([meterTestnet, hardhat], 'name')

export const dappName = 'Oasis'
export const pollingInterval = 12000
