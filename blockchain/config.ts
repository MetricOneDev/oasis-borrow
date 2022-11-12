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
import { default as kovanAddresses } from './addresses/kovan.json'
import { default as mainnetAddresses } from './addresses/mainnet.json'
import { default as meterAddresses } from './addresses/meter.json'
import { default as metertestnetAddresses } from './addresses/metertestnet.json'

export function contractDesc(abi: any, address: string): ContractDesc {
  return { abi, address }
}

const infuraProjectId =
  process.env.INFURA_PROJECT_ID || getConfig()?.publicRuntimeConfig?.infuraProjectId || ''
const etherscanAPIKey =
  process.env.ETHERSCAN_API_KEY || getConfig()?.publicRuntimeConfig?.etherscan || ''

// const protoMain = {
//   id: '1',
//   name: 'main',
//   label: 'Mainnet',
//   infuraUrl: `https://mainnet.infura.io/v3/${infuraProjectId}`,
//   infuraUrlWS: `wss://mainnet.infura.io/ws/v3/${infuraProjectId}`,
//   safeConfirmations: 10,
//   otc: contractDesc(otc, '0x794e6e91555438aFc3ccF1c5076A74F42133d08D'),
//   collaterals: getCollaterals(mainnetAddresses),
//   tokens: {
//     ...getCollateralTokens(mainnetAddresses),
//     WMTR: contractDesc(coin, mainnetAddresses['MTR']),
//     STBL: contractDesc(erc20, mainnetAddresses['MCD_STBL']),
//     GOVT: contractDesc(erc20, mainnetAddresses.MCD_GOV),
//     CHAI: contractDesc(erc20, '0x06af07097c9eeb7fd685c692751d5c66db49c215'),
//     // WBTC: contractDesc(erc20, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'),
//   } as Dictionary<ContractDesc>,
//   joins: {
//     ...getCollateralJoinContracts(mainnetAddresses),
//   },
//   getCdps: contractDesc(getCdps, mainnetAddresses.GET_CDPS),
//   mcdOsms: getOsms(mainnetAddresses),
//   mcdJug: contractDesc(mcdJug, mainnetAddresses.MCD_JUG),
//   mcdPot: contractDesc(mcdPot, mainnetAddresses.MCD_POT),
//   mcdEnd: contractDesc(mcdEnd, mainnetAddresses.MCD_END),
//   mcdSpot: contractDesc(mcdSpot, mainnetAddresses.MCD_SPOT),
//   mcdDog: contractDesc(mcdDog, mainnetAddresses.MCD_DOG),
//   dssCdpManager: contractDesc(dssCdpManager, mainnetAddresses.CDP_MANAGER),
//   otcSupportMethods: contractDesc(otcSupport, '0x9b3f075b12513afe56ca2ed838613b7395f57839'),
//   vat: contractDesc(vat, mainnetAddresses.MCD_VAT),
//   mcdJoinStbl: contractDesc(mcdJoinStbl, mainnetAddresses.MCD_JOIN_STBL),
//   dsProxyRegistry: contractDesc(dsProxyRegistry, mainnetAddresses.PROXY_REGISTRY),
//   dsProxyFactory: contractDesc(dsProxyFactory, mainnetAddresses.PROXY_FACTORY),
//   dssProxyActions: contractDesc(dssProxyActions, mainnetAddresses.PROXY_ACTIONS),
//   etherscan: {
//     url: 'https://etherscan.io',
//     apiUrl: 'https://api.etherscan.io/api',
//     apiKey: etherscanAPIKey || '',
//   },
//   taxProxyRegistries: ['0xaa63c8683647ef91b3fdab4b4989ee9588da297b'],
//   dssProxyActionsDsr: contractDesc(
//     dssProxyActionsDsr,
//     '0x07ee93aEEa0a36FfF2A9B95dd22Bd6049EE54f26',
//   ),
//   magicLink: {
//     apiKey: '',
//   },
//   cacheApi: 'https://oazo-bcache.new.oasis.app/api/v1',
// }

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
    MTR: contractDesc(coin, meterAddresses['MTR']),
    // MTRG: contractDesc(erc20, meterAddresses['MTRG']),
    STBL: contractDesc(erc20, meterAddresses['MCD_STBL']),
    GOVT: contractDesc(erc20, meterAddresses.MCD_GOV),
    CHAI: contractDesc(erc20, '0x06af07097c9eeb7fd685c692751d5c66db49c215'),
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
  cacheApi: '',
}

const protoMeterTestnet = {
  id: '83',
  name: 'metertestnet',
  label: 'MeterTestnet',
  infuraUrl: `https://rpctest.meter.io/`,
  infuraUrlWS: `wss://wstest.meter.io`,
  safeConfirmations: 10,
  otc: contractDesc(otc, '0x794e6e91555438aFc3ccF1c5076A74F42133d08D'),
  collaterals: getCollaterals(metertestnetAddresses),
  tokens: {
    ...getCollateralTokens(metertestnetAddresses),
    MTR: contractDesc(coin, metertestnetAddresses['MTR']),
    MTRG: contractDesc(erc20, metertestnetAddresses['MTRG']),
    STBL: contractDesc(erc20, metertestnetAddresses['MCD_STBL']),
    GOVT: contractDesc(erc20, metertestnetAddresses.MCD_GOV),
    CHAI: contractDesc(erc20, '0x06af07097c9eeb7fd685c692751d5c66db49c215'),
  } as Dictionary<ContractDesc>,
  joins: {
    ...getCollateralJoinContracts(metertestnetAddresses),
  },
  getCdps: contractDesc(getCdps, metertestnetAddresses.GET_CDPS),
  mcdOsms: getOsms(metertestnetAddresses),
  mcdJug: contractDesc(mcdJug, metertestnetAddresses.MCD_JUG),
  mcdPot: contractDesc(mcdPot, metertestnetAddresses.MCD_POT),
  mcdEnd: contractDesc(mcdEnd, metertestnetAddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, metertestnetAddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, metertestnetAddresses.MCD_DOG),
  dssCdpManager: contractDesc(dssCdpManager, metertestnetAddresses.CDP_MANAGER),
  otcSupportMethods: contractDesc(otcSupport, '0x9b3f075b12513afe56ca2ed838613b7395f57839'),
  vat: contractDesc(vat, metertestnetAddresses.MCD_VAT),
  mcdJoinStbl: contractDesc(mcdJoinStbl, metertestnetAddresses.MCD_JOIN_STBL),
  dsProxyRegistry: contractDesc(dsProxyRegistry, metertestnetAddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, metertestnetAddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, metertestnetAddresses.PROXY_ACTIONS),
  etherscan: {
    url: 'https://scan-warringstakes.meter.io/',
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: etherscanAPIKey || '',
  },
  taxProxyRegistries: ['0x926C2E477dE321be76468faD86fCDEa96ECE57Cd'],
  dssProxyActionsDsr: contractDesc(
    dssProxyActionsDsr,
    '0x4aeaB2E2fbf0A15032603B101F4fEebE65394BC8',
  ),
  magicLink: {
    apiKey: '',
  },
  cacheApi: '',
}

export type NetworkConfig = typeof protoMeter

// const main: NetworkConfig = protoMain
const meter: NetworkConfig = protoMeter
const meterTestnet: NetworkConfig = protoMeterTestnet

// const kovan: NetworkConfig = {
//   id: '42',
//   name: 'kovan',
//   label: 'Kovan',
//   infuraUrl: `https://kovan.infura.io/v3/${infuraProjectId}`,
//   infuraUrlWS: `wss://kovan.infura.io/ws/v3/${infuraProjectId}`,
//   safeConfirmations: 6,
//   otc: contractDesc(otc, '0xe325acB9765b02b8b418199bf9650972299235F4'),
//   collaterals: getCollaterals(kovanAddresses),
//   tokens: {
//     ...getCollateralTokens(kovanAddresses),
//     WMTR: contractDesc(coin, kovanAddresses['MTR']),
//     STBL: contractDesc(erc20, kovanAddresses['MCD_STBL']),
//     USDC: contractDesc(erc20, '0x198419c5c340e8De47ce4C0E4711A03664d42CB2'),
//     GOVT: contractDesc(erc20, kovanAddresses.MCD_GOV),
//     CHAI: contractDesc(erc20, '0xb641957b6c29310926110848db2d464c8c3c3f38'),
//     // WBTC: contractDesc(erc20, '0xA08d982C2deBa0DbE433a9C6177a219E96CeE656'),
//   },
//   joins: {
//     ...getCollateralJoinContracts(kovanAddresses),
//   },
//   getCdps: contractDesc(getCdps, kovanAddresses.GET_CDPS),
//   mcdOsms: getOsms(kovanAddresses),
//   mcdPot: contractDesc(mcdPot, kovanAddresses.MCD_POT),
//   mcdJug: contractDesc(mcdJug, kovanAddresses.MCD_JUG),
//   mcdEnd: contractDesc(mcdEnd, kovanAddresses.MCD_END),
//   mcdSpot: contractDesc(mcdSpot, kovanAddresses.MCD_SPOT),
//   mcdDog: contractDesc(mcdDog, kovanAddresses.MCD_DOG),
//   dssCdpManager: contractDesc(dssCdpManager, kovanAddresses.CDP_MANAGER),
//   otcSupportMethods: contractDesc(otcSupport, '0x303f2bf24d98325479932881657f45567b3e47a8'),
//   vat: contractDesc(vat, kovanAddresses.MCD_VAT),
//   mcdJoinStbl: contractDesc(mcdJoinStbl, kovanAddresses.MCD_JOIN_STBL),
//   dsProxyRegistry: contractDesc(dsProxyRegistry, kovanAddresses.PROXY_REGISTRY),
//   dsProxyFactory: contractDesc(dsProxyFactory, kovanAddresses.PROXY_FACTORY),
//   dssProxyActions: contractDesc(dssProxyActions, kovanAddresses.PROXY_ACTIONS),
//   etherscan: {
//     url: 'https://kovan.etherscan.io',
//     apiUrl: 'https://api-kovan.etherscan.io/api',
//     apiKey: etherscanAPIKey || '',
//   },
//   taxProxyRegistries: [kovanAddresses.PROXY_REGISTRY],
//   dssProxyActionsDsr: contractDesc(dssProxyActionsDsr, kovanAddresses.PROXY_ACTIONS_DSR),
//   magicLink: {
//     apiKey: '',
//   },
//   cacheApi: 'https://oazo-bcache-kovan-staging.new.oasis.app/api/v1',
// }
//
// const hardhat: NetworkConfig = {
//   ...protoMain,
//   id: '2137',
//   name: 'hardhat',
//   label: 'Hardhat',
//   infuraUrl: `http://localhost:8545`,
//   infuraUrlWS: `ws://localhost:8545`,
//   cacheApi: 'http://localhost:3001/v1',
// }

export const networksById = keyBy([meter, meterTestnet], 'id')
export const networksByName = keyBy([meter, meterTestnet], 'name')

export const dappName = 'Oasis'
export const coinName = 'MTR'
export const stblName = 'MONE'
export const defaultNetworkName = 'meter'
export const pollingInterval = 12000
