import BigNumber from 'bignumber.js'
import dsProxyRegistryAbi from 'blockchain/abi/ds-proxy-registry.json'
import dsProxyAbi from 'blockchain/abi/ds-proxy.json'
import dssProxyActionsAbi from 'blockchain/abi/dss-proxy-actions.json'
import erc20Abi from 'blockchain/abi/erc20.json'
import getCdpsAbi from 'blockchain/abi/get-cdps.json'
import mcdCatAbi from 'blockchain/abi/mcd-cat.json'
import flipAbi from 'blockchain/abi/mcd-flip.json'
import joinStblAbi from 'blockchain/abi/mcd-join-stbl.json'
import osmAbi from 'blockchain/abi/mcd-osm.json'
import spotAbi from 'blockchain/abi/mcd-spot.json'
import vatAbi from 'blockchain/abi/vat.json'
import {
  CDP_MANAGER,
  GET_CDPS,
  MCD_CAT,
  MCD_FLIP_ETH_A,
  MCD_JOIN_ETH_A,
  MCD_JOIN_STBL,
  MCD_JUG,
  MCD_SPOT,
  MCD_STBL,
  MCD_VAT,
  PIP_ETH,
  PROXY_ACTIONS,
  PROXY_REGISTRY,
} from 'blockchain/addresses/meter.json'
import { amountToWei } from 'blockchain/utils'
import { ethers } from 'ethers'
import _ from 'lodash'
import { assert } from 'ts-essentials'
import {
  Erc20,
  GetCdps,
  McdCat,
  McdFlip,
  McdJoinStbl,
  McdOsm,
  McdSpot,
  Vat
} from 'types/ethers-contracts'
import Web3 from 'web3'

import { DsProxy } from '../types/ethers-contracts/DsProxy'
import { DsProxyRegistry } from '../types/ethers-contracts/DsProxyRegistry'

BigNumber.config({ EXPONENTIAL_AT: 100000 })
const ILK = utf8ToBytes32('MTR-A')
const wad = new BigNumber(10).pow(18)
const ray = new BigNumber(10).pow(27)

function utf8ToBytes32(str: string): string {
  return Web3.utils.utf8ToHex(str).padEnd(66, '0')
}

async function getOrCreateProxy(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.providers.JsonRpcSigner,
): Promise<string> {
  const address = await signer.getAddress()
  const dsProxyRegistry: DsProxyRegistry = new ethers.Contract(
    PROXY_REGISTRY,
    dsProxyRegistryAbi,
    provider,
  ).connect(signer) as any
  let proxyAddress = await dsProxyRegistry.proxies(address)
  if (proxyAddress === ethers.constants.AddressZero) {
    await (await dsProxyRegistry['build()']()).wait()
    proxyAddress = await dsProxyRegistry.proxies(address)
    assert(proxyAddress !== ethers.constants.AddressZero, 'Proxy not created')
  }
  return proxyAddress
}

interface CDP {
  id: number
  urn: string
  ilk: string
}

async function getLastCDP(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.providers.JsonRpcSigner,
  proxyAddress: string,
): Promise<CDP> {
  const getCdps: GetCdps = new ethers.Contract(GET_CDPS, getCdpsAbi, provider).connect(
    signer,
  ) as any
  const { ids, urns, ilks } = await getCdps.getCdpsAsc(CDP_MANAGER, proxyAddress)
  const cdp: CDP | undefined = _.last(
    _.map((_.zip(ids, urns, ilks) as any) as [BigNumber, string, string][], (cdp) => ({
      id: cdp[0].toNumber(),
      urn: cdp[1],
      ilk: cdp[2],
    })),
  )
  if (_.isUndefined(cdp)) {
    throw new Error('No CDP available')
  }
  return cdp
}

async function openLockCoinAndDraw(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.providers.JsonRpcSigner,
  collateralAmount: BigNumber,
  generateAmount: BigNumber,
  proxyAddress: string,
): Promise<CDP> {
  const address = await signer.getAddress()

  const dssProxyActionsInterface = new ethers.utils.Interface(dssProxyActionsAbi)
  const proxyAction = dssProxyActionsInterface.encodeFunctionData('openLockCoinAndDraw', [
    CDP_MANAGER,
    MCD_JUG,
    MCD_JOIN_ETH_A,
    MCD_JOIN_STBL,
    ILK,
    amountToWei(generateAmount, '{\n' +
      '  "404-button": "Go to homepage",\n' +
      '  "404-message": "Sorry, page not found.",\n' +
      '  "about": {\n' +
      '    "heading": "About us",\n' +
      '    "description": "Oasis mission is to provide the best and most trusted entry point to deploy your capital. We are building Oasis.app to let our users benefit from all of the potential in DeFi.\\n\\n Our team is made of passionate thinkers and builders.",\n' +
      '    "careers-link": "Join Us",\n' +
      '    "pics-title": "Meet the team"\n' +
      '  },\n' +
      '  "acceptance-check-failed": "Acceptance check failed",\n' +
      '  "acceptance-save-failed": "Acceptance save failed",\n' +
      '  "acceptance-save-in-progress": "Saving acceptance...",\n' +
      '  "account": "Account",\n' +
      '  "account-privacy": "Privacy",\n' +
      '  "account-support": "Support",\n' +
      '  "account-terms": "Terms",\n' +
      '  "activity": "Activity",\n' +
      '  "address": "Address",\n' +
      '  "address-invalid": "Address not found",\n' +
      '  "after": "After",\n' +
      '  "after-next": "After + Next",\n' +
      '  "all-assets": "All Assets",\n' +
      '  "amount": "Amount",\n' +
      '  "approve-allowance": "Approve Allowance",\n' +
      '  "approving-allowance": "Approving Allowance",\n' +
      '  "back": "Back",\n' +
      '  "back-to-editing": "Back to editing",\n' +
      '  "balance": "Balance",\n' +
      '  "balance-insufficient": "Not enough MONE in your wallet",\n' +
      '  "balances": "Balances",\n' +
      '  "buy": "Buy",\n' +
      '  "careers": {\n' +
      '    "heading": "Open Roles",\n' +
      '    "intro": "We believe in talent. Join us to build the next generation of DeFi.",\n' +
      '    "cta-button": "Apply",\n' +
      '    "back-link": "Back to Careers",\n' +
      '    "no-open-positions": "There are currently no roles available at this time, but we are always looking for the best talents to join us.",\n' +
      '    "no-positions-you-like": "You haven\'t found something that you like? Show us your interest, we are always looking for the best talents to join us!",\n' +
      '    "write-us": "Send us your CV to "\n' +
      '  },\n' +
      '  "change-your-vault": "Change your vault",\n' +
      '  "close": "Close",\n' +
      '  "coming-soon": "Coming soon",\n' +
      '  "completed": "Completed",\n' +
      '  "compound": "Compound",\n' +
      '  "confirm": "Confirm",\n' +
      '  "confirmed-proxy-deployment": "Proxy deployment confirmed",\n' +
      '  "connect-confirm": "Confirm in {{ connectionKind }}",\n' +
      '  "connect-email": "Connect with email",\n' +
      '  "connect-error": "Please authorize this website to access your EVM account.",\n' +
      '  "connect-wallet": "Connect a wallet",\n' +
      '  "connect-wallet-button": "Connect Wallet",\n' +
      '  "connect-with": "{{ connectionKind }}",\n' +
      '  "connect-install-metamask": "Install Metamask",\n' +
      '  "connected-with": "Connected with {{ connectionKind }}",\n' +
      '  "contact": {\n' +
      '    "description": "Send us feedback, questions, or suggestions or below.",\n' +
      '    "label": {\n' +
      '      "email": "Email",\n' +
      '      "message": "Message",\n' +
      '      "name": "Name (optional)",\n' +
      '      "subject": "Subject"\n' +
      '    },\n' +
      '    "sent": {\n' +
      '      "failure": "Something went wrong. Please try again.",\n' +
      '      "success": "Thanks for getting in touch, we’ll get back to you shortly."\n' +
      '    },\n' +
      '    "submit": "Send",\n' +
      '    "title": "Contact Us"\n' +
      '  },\n' +
      '  "continue": "Continue",\n' +
      '  "conversion-fee": "Conversion fee",\n' +
      '  "copied": "Copied",\n' +
      '  "copy-address": "Copy address",\n' +
      '  "country": "Country",\n' +
      '  "configure-your-vault": "Configure your vault",\n' +
      '  "create-proxy": "Create a proxy",\n' +
      '  "create-proxy-btn": "Create Proxy",\n' +
      '  "create-proxy-desc": "In order to use Savings and other features, you will need a wallet proxy.",\n' +
      '  "create-vault": "Create Vault",\n' +
      '  "create-your-vault": "Create your vault",\n' +
      '  "creating-proxy": "Creating Proxy",\n' +
      '  "creating-vault": "Creating Vault",\n' +
      '  "currency": "Currency",\n' +
      '  "custom": "Custom",\n' +
      '  "stbl-being-generated": "MONE being generated",\n' +
      '  "stbl-paying-back": "MONE paying back ({{amount}})",\n' +
      '  "stbl-paying-back-label": "MONE paying back",\n' +
      '  "stbl-savings-rate": "MONE Savings Rate",\n' +
      '  "deposit": "Deposit",\n' +
      '  "disconnect": "Disconnect",\n' +
      '  "disconnect-magic": "Log out",\n' +
      '  "earning": "Earning",\n' +
      '  "edit-token-allowance": "Edit {{token}} allowance",\n' +
      '  "edit-vault-details": "Edit Vault details",\n' +
      '  "email": "Email",\n' +
      '  "email-invalid": "Provided email is invalid",\n' +
      '  "email-required": "Email address is required",\n' +
      '  "erc20-approve-description-pending": "Unlocking transfer of {{ token }}",\n' +
      '  "erc20-approve-description-recent": "Unlocked transfer of {{ token }}",\n' +
      '  "erc20-approve-description-recent-failed": "Failed to unlock transfer of {{ token }}",\n' +
      '  "erc20-approve-notification": "Unlocking {{ token }}",\n' +
      '  "erc20-approve-notification-past": "Unlocked {{ token }}",\n' +
      '  "erc20-disapprove-description-pending": "Locking transfer of {{ token }}",\n' +
      '  "erc20-disapprove-description-recent": "Locked transfer of {{ token }}",\n' +
      '  "erc20-disapprove-description-recent-failed": "Failed to lock transfer of {{ token }}",\n' +
      '  "erc20-disapprove-notification": "Locking {{ token }}",\n' +
      '  "erc20-disapprove-notification-past": "Locked {{ token }}",\n' +
      '  "error-message": "Something went wrong",\n' +
      '  "error-button": "See details",\n' +
      '  "create-ds-proxy-description-pending": "Creating proxy",\n' +
      '  "create-ds-proxy-description-recent": "Created proxy",\n' +
      '  "create-ds-proxy-description-recent-failed": "Failed to create proxy",\n' +
      '  "set-proxy-owner-description-pending": "Setting proxy owner",\n' +
      '  "set-proxy-owner-description-recent": "Set proxy owner",\n' +
      '  "set-proxy-owner-description-recent-failed": "Failed to set proxy owner",\n' +
      '  "open-vault-description-pending": "Opening {{ ilk }} vault, depositing {{ depositAmount }} {{ token }} and generating {{ generateAmount }} MONE",\n' +
      '  "open-vault-description-recent": "Opened {{ ilk }} vault, deposited {{ depositAmount }} {{ token }} and generated {{ generateAmount }} MONE",\n' +
      '  "open-vault-description-recent-failed": "Failed to open {{ ilk }} vault",\n' +
      '  "deposit-generate-description-pending": "Depositing {{ depositAmount }} {{ token }} and generating {{ generateAmount }} MONE from vault {{ id }}",\n' +
      '  "deposit-generate-description-recent": "Deposited {{ depositAmount }} {{ token }} and generated {{ generateAmount }} MONE from vault {{ id }}",\n' +
      '  "deposit-generate-description-recent-failed": "Failed to deposit and generate from vault {{ id }}",\n' +
      '  "withdraw-payback-description-pending": "Withdrawing {{ withdrawAmount }} {{ token }} and paying back {{ paybackAmount }} MONE to vault {{ id }}",\n' +
      '  "withdraw-payback-description-recent": "Withdrawn {{ withdrawAmount }} {{ token }} and payed back {{ paybackAmount }} MONE to vault {{ id }}",\n' +
      '  "withdraw-payback-description-recent-failed": "Failed to withdraw and payback to vault {{ id }}",\n' +
      '  "reclaim-collateral-description-pending": "Reclaiming {{ amount }} {{ token }} from vault {{ id }}",\n' +
      '  "reclaim-collateral-description-recent": "Reclaimed {{ amount }} {{ token }} from vault {{ id }}",\n' +
      '  "reclaim-collateral-description-recent-failed": "Failed to reclaim collateral from vault {{ id }}",\n' +
      '  "event": {\n' +
      '    "activity": "Activity",\n' +
      '    "deposit": "Deposited",\n' +
      '    "time": "Time",\n' +
      '    "type": "Type",\n' +
      '    "vault-opened": "Vault Opened"\n' +
      '  },\n' +
      '  "exchange-rate": "Exchange rate",\n' +
      '  "failed": "Failed",\n' +
      '  "featured": {\n' +
      '    "cheapest": "Cheapest",\n' +
      '    "most-popular": "Most popular",\n' +
      '    "new": "New"\n' +
      '  },\n' +
      '  "filters": {\n' +
      '    "lp-token": "LP tokens",\n' +
      '    "stablecoin": "Stablecoins",\n' +
      '    "popular": "Popular assets"\n' +
      '  },\n' +
      '  "gas-estimation-error": "Error",\n' +
      '  "get-stbl": "Get MONE",\n' +
      '  "get-started": "Get Started",\n' +
      '  "go-to-vault": "Go to Vault #{{id}}",\n' +
      '  "here": "here",\n' +
      '  "history": {\n' +
      '    "auction_finished_v2": "Auction <0>#{{auctionId}}</0> finished, <0>{{remainingCollateral}} {{token}}</0> remained",\n' +
      '    "auction_started": "Auction started, <0>{{collateralAmount}} {{token}}</0> taken to cover <0>{{stblAmount}} MONE</0>",\n' +
      '    "auction_started_v2": "Auction <0>#{{auctionId}}</0> started, <0>{{collateralAmount}} {{token}}</0> taken to cover <0>{{stblAmount}} MONE</0>",\n' +
      '    "deposit": "Deposited <0>{{collateralAmount}} {{token}}</0> into Vault",\n' +
      '    "generate": "Generated <0>{{stblAmount}}</0> MONE from Vault",\n' +
      '    "migrate": "Vault migrated",\n' +
      '    "move_dest": "Moved <0>{{collateralAmount}} {{token}}</0> and <0>{{stblAmount}}</0> MONE debt to the vault",\n' +
      '    "move_src": "Moved <0>{{collateralAmount}} {{token}}</0> and <0>{{stblAmount}}</0> MONE debt from the vault",\n' +
      '    "open": "Opened a new Vault with id <0>#{{cdpId}}</0>",\n' +
      '    "payback": "Payback <0>{{stblAmount}}</0> MONE to Vault",\n' +
      '    "transfer": "Vault given to <0>{{transferTo}}</0> by <0>{{transferFrom}}</0>",\n' +
      '    "withdraw": "Withdrew <0>{{collateralAmount}} {{token}}</0> from Vault"\n' +
      '  },\n' +
      '  "jwt-auth-failed": "Signature failed",\n' +
      '  "jwt-auth-in-progress": "Waiting for signature...",\n' +
      '  "jwt-auth-rejected": "Signature rejected",\n' +
      '  "jwt-auth-waiting-acceptance": "Sign message",\n' +
      '  "keyWithCount": "{{count}} item",\n' +
      '  "keyWithCount_plural": "{{count}} items",\n' +
      '  "landing": {\n' +
      '    "hero": {\n' +
      '      "headline": "Generate MONE using crypto as your collateral",\n' +
      '      "subheader": "Open a MetricOne Vault, deposit your collateral, and generate MONE against it.<0/> Connect a wallet to start."\n' +
      '    },\n' +
      '    "cards": {\n' +
      '      "stbl": {\n' +
      '        "title": "MONE Wallet",\n' +
      '        "description": "Buy, send and manage MONE all in one place. Grow your MONE, access plenty of providers"\n' +
      '      },\n' +
      '      "faq": {\n' +
      '        "title": "Have a question?",\n' +
      '        "description": "Learn more about Oasis, MONE and DeFi at our FAQ’s page"\n' +
      '      }\n' +
      '    }\n' +
      '  },\n' +
      '  "languages": "Languages",\n' +
      '  "lang-dropdown": {\n' +
      '    "en": "English",\n' +
      '    "es": "Español",\n' +
      '    "pt": "Português",\n' +
      '    "cn": "中文"\n' +
      '  },\n' +
      '  "ledger-cancel": "Select another wallet",\n' +
      '  "ledger-error": "There was an error, please reset",\n' +
      '  "ledger-legacy": "Ledger Legacy",\n' +
      '  "ledger-live": "Ledger Live",\n' +
      '  "ledger-select-address": "Select an address",\n' +
      '  "ledger-select-title": "Select Ledger Live or Legacy",\n' +
      '  "manage-vault": {\n' +
      '    "action-option": "{{action}} {{token}} with this transaction",\n' +
      '    "stbl-available": "MONE available",\n' +
      '    "dust-limit": "Dust Limit",\n' +
      '    "liquidation-fee": "Liquidation Fee",\n' +
      '    "min-collat-ratio": "Min. collateral ratio",\n' +
      '    "or": "OR",\n' +
      '    "stability-fee": "Stability Fee",\n' +
      '    "title": "Manage Vault",\n' +
      '    "action": "Manage Vault",\n' +
      '    "warnings": {\n' +
      '      "potential-generate-amount-less-than-debt-floor": "Minimum MONE required to open a Vault is {{debtFloor}}. Please add more collateral to generate {{debtFloor}} MONE",\n' +
      '      "debt-is-less-than-debt-floor": "Your current MONE debt is below the minimum of {{debtFloor}}. Because of this some Vault actions are not possible. Please generate more MONE to take you above the minimum or payback all your debt",\n' +
      '      "vault-will-be-at-risk-level-danger": "With this action your vault will be at a collateralization ratio very close to the minimum required",\n' +
      '      "vault-will-be-at-risk-level-danger-at-next-price": "With this action your vault will be at a collateralization ratio very close to the minimum required at the next price update",\n' +
      '      "vault-will-be-at-risk-level-warning": "With this action your vault will be at a collateralization ratio near the minimum required",\n' +
      '      "vault-will-be-at-risk-level-warning-at-next-price": "With this action your vault will be at a collateralization ratio near the minimum required at the next price update"\n' +
      '    },\n' +
      '    "errors": {\n' +
      '      "deposit-amount-exceeds-collateral-balance": "You cannot deposit more collateral than the amount in your wallet",\n' +
      '      "withdraw-amount-exceeds-free-collateral": "You cannot withdraw more than {{maxWithdrawAmount}} {{token}}",\n' +
      '      "withdraw-amount-exceeds-free-collateral-at-next-price": "You cannot withdraw more than {{maxWithdrawAmount}} {{token}}",\n' +
      '      "generate-amount-exceeds-stbl-yield-from-total-collateral": "The collateralization ratio for this MetricOne Vault is too low. Please generate less MONE",\n' +
      '      "generate-amount-exceeds-stbl-yield-from-total-collateral-at-next-price": "The collateralization ratio for this MetricOne Vault is too low at the next price update. Please generate less MONE",\n' +
      '      "generate-amount-exceeds-debt-ceiling": "You are trying to generate more than the current debt ceiling allows. The amount of MONE that can be generated is {{maxGenerateAmount}} {{token}}",\n' +
      '      "generate-amount-less-than-debt-floor": "This vault type requires a minimum of {{debtFloor}} MONE to be generated. Read more about the Minimum Vault Debt <0>here</0>.",\n' +
      '      "payback-amount-exceeds-stbl-balance": "You cannot payback more MONE than the amount in your wallet",\n' +
      '      "payback-amount-exceeds-vault-debt": "You are trying to payback more than your MONE debt for this MetricOne Vault",\n' +
      '      "debt-will-be-less-than-debt-floor": "The MetricOne Vault debt amount either must be 0 or exceed {{debtFloor}} amount of MONE. Please change your payback amount",\n' +
      '      "custom-collateral-allowance-amount-exceeds-maxuint256": "Allowance too large. Please decrease custom allowance amount",\n' +
      '      "custom-collateral-allowance-amount-less-than-deposit-amount": "You need at least an allowance of your deposit amount to continue",\n' +
      '      "custom-stbl-allowance-amount-exceeds-maxuint256": "Allowance too large. Please decrease custom allowance amount",\n' +
      '      "custom-stbl-allowance-amount-less-than-payback-amount": "You need at least an allowance of your payback amount to continue",\n' +
      '      "depositing-all-coin-balance": "You need some MTR to pay for the gas fees. Lower your deposit amount",\n' +
      '      "ledger-enable-contract-data": "Please enable Contract data on the Ledgers Ethereum app Settings",\n' +
      '      "withdraw-collateral-on-vault-under-debt-floor": "You cannot withdraw from your vault while it is below the minimum required of {{debtFloor}} MONE. To withdraw your collateral, payback your debt fully. Learn more about the Minimum Vault Debt <0>here</0>.",\n' +
      '      "deposit-collateral-on-vault-under-debt-floor": "You cannot deposit to your vault while it is below the minimum debt required of {{debtFloor}}. To add more collateral, generate MONE to get above the minimum required. Learn more about the Minimum Vault Debt here <0>here</0>)"\n' +
      '    }\n' +
      '  },\n' +
      '  "max": "Max",\n' +
      '  "min-amount": "Minimum amount is {{minAmount}} {{token}}",\n' +
      '  "moving-into-vault": "Moving into Vault",\n' +
      '  "moving-out-vault": "Moving out of Vault",\n' +
      '  "nav": {\n' +
      '    "about": "About",\n' +
      '    "resources": "Resources",\n' +
      '    "products": "Products",\n' +
      '    "team": "Team",\n' +
      '    "careers": "Careers",\n' +
      '    "privacy": "Privacy",\n' +
      '    "terms": "Terms",\n' +
      '    "contact": "Contact",\n' +
      '    "blog": "Blog",\n' +
      '    "faq": "FAQ",\n' +
      '    "knowledge-centre": "Knowledge Centre",\n' +
      '    "learn": "Learn",\n' +
      '    "oracles": "Oracles",\n' +
      '    "stbl-wallet": "MONE Wallet",\n' +
      '    "borrow": "Borrow",\n' +
      '    "oasis-borrow": "Oasis Borrow",\n' +
      '    "trade": "Trade"\n' +
      '  },\n' +
      '  "new-to-evmnetwork": "New to Meter? ",\n' +
      '  "next": "Next",\n' +
      '  "no-stbl": "No MONE",\n' +
      '  "no-activity": "No activity to show",\n' +
      '  "notice-privacy": "By using our site you agree to our <0>Cookie Policy</0>.",\n' +
      '  "notification-status-complete": "Complete",\n' +
      '  "notification-status-completed": "Complete",\n' +
      '  "notification-status-expired": "Expired",\n' +
      '  "notification-status-failed": "Failed",\n' +
      '  "notification-status-incomplete": "Incomplete",\n' +
      '  "notification-status-initialized": "Initialized",\n' +
      '  "notification-status-pending": "Pending",\n' +
      '  "notification-status-rejected": "Rejected",\n' +
      '  "notification-status-sign": "Sign Tx",\n' +
      '  "of": "of",\n' +
      '  "one-of-some": "{{one}} of {{some}}",\n' +
      '  "onramp-leave-message": "By clicking buy, you will leave Oasis and be redirected to a third party website where you will complete the buy process.",\n' +
      '  "open-new-vault": "Open new Vault",\n' +
      '  "open-vault": {\n' +
      '    "title": "Open Vault",\n' +
      '    "warnings": {\n' +
      '      "potential-generate-amount-less-than-debt-floor": "Minimum MONE required to open a Vault is {{debtFloor}}. Please add more collateral to generate {{debtFloor}} MONE",\n' +
      '      "vault-will-be-at-risk-level-danger": "With this action your vault will be at a collateralization ratio very close to the minimum required",\n' +
      '      "vault-will-be-at-risk-level-danger-at-next-price": "With this action your vault will be at a collateralization ratio very close to the minimum required at the next price update",\n' +
      '      "vault-will-be-at-risk-level-warning": "With this action your vault will be at a collateralization ratio near the minimum required",\n' +
      '      "vault-will-be-at-risk-level-warning-at-next-price": "With this action your vault will be at a collateralization ratio near the minimum required at the next price update"\n' +
      '    },\n' +
      '    "errors": {\n' +
      '      "deposit-amount-exceeds-collateral-balance": "You cannot deposit more collateral than the amount in your wallet",\n' +
      '      "generate-amount-exceeds-stbl-yield-from-depositing-collateral": "The collateralization ratio for this MetricOne Vault will be too low. Please generate less MONE",\n' +
      '      "generate-amount-exceeds-stbl-yield-from-depositing-collateral-at-next-price": "The collateralization ratio for this MetricOne Vault will be too low at the next price update. Please generate less MONE",\n' +
      '      "generate-amount-exceeds-debt-ceiling": "You are trying to generate more than the current debt ceiling allows. The amount of MONE that can be generated is {{maxGenerateAmount}} {{token}}",\n' +
      '      "generate-amount-less-than-debt-floor": "This vault type requires a minimum of {{debtFloor}} MONE to be generated. Read more about the Minimum Vault Debt <0>here</0>.",\n' +
      '      "debt-will-be-less-than-debt-floor": "The MetricOne Vault debt amount either must be 0 or exceed {{debtFloor}} amount of MONE. Please change your payback amount",\n' +
      '      "custom-allowance-amount-exceeds-maxuint256": "Allowance too large. Please decrease custom allowance amount",\n' +
      '      "custom-allowance-amount-less-than-deposit-amount": "You need at least an allowance of your deposit amount to continue",\n' +
      '      "depositing-all-coin-balance": "You need some MTR to pay for the gas fees. Lower your deposit amount",\n' +
      '      "ledger-enable-contract-data": "Please enable Contract data on the Ledgers Ethereum app Settings"\n' +
      '    }\n' +
      '  },\n' +
      '  "or": "or",\n' +
      '  "paste": "Paste",\n' +
      '  "pending-transactions": "Pending Transactions",\n' +
      '  "permissions": "Set permissions",\n' +
      '  "permissions-btn": "Set permissions",\n' +
      '  "permissions-desc": "This permission allows Oasis to interact with the MONE in your wallet.",\n' +
      '  "powered-by": "Powered by",\n' +
      '  "proceed": "Proceed",\n' +
      '  "readonly-alert-message": "You’re currently viewing",\n' +
      '  "readonly-user-connecting": "Connecting readonly...",\n' +
      '  "readonly-user-no-proxy": "No proxy for this address",\n' +
      '  "readonly-user-no-savings": "No savings",\n' +
      '  "receive": "Receive",\n' +
      '  "received": "Received",\n' +
      '  "recent-transactions": "Recent Transactions",\n' +
      '  "reclaim": "Reclaim collateral",\n' +
      '  "remaining-in-wallet": "Remaining in Wallet",\n' +
      '  "retry": "Retry",\n' +
      '  "retry-allowance-approval": "Retry Allowance approval",\n' +
      '  "retry-create-proxy": "Retry Create Proxy",\n' +
      '  "savings": "Savings",\n' +
      '  "savings-earned": "Savings earned to date",\n' +
      '  "search-token": "Search token",\n' +
      '  "select-product": "Select a product",\n' +
      '  "send": "Send",\n' +
      '  "send-amount-empty": "Cannot send 0 {{ token }}",\n' +
      '  "send-amount-exceed-balance": "Not enough {{ token }}",\n' +
      '  "send-to": "Send to",\n' +
      '  "sent": "Sent",\n' +
      '  "seo": {\n' +
      '    "contact": {\n' +
      '      "description": "Send us feedback, questions, or suggestions.",\n' +
      '      "title": "Contact"\n' +
      '    },\n' +
      '    "stbl": {\n' +
      '      "description": "A short introduction to MONE, the smarter digital currency.",\n' +
      '      "title": "MONE"\n' +
      '    },\n' +
      '    "default": {\n' +
      '      "description": "Borrow MONE, a USD pegged Stablecoin, using crypto as your collateral",\n' +
      '      "title": "Oasis.app"\n' +
      '    },\n' +
      '\n' +
      '    "support": {\n' +
      '      "description": "All the answers to the most common questions.",\n' +
      '      "title": "FAQs"\n' +
      '    },\n' +
      '    "careers": {\n' +
      '      "title": "Careers",\n' +
      '      "description": "We believe in talent. Join us to build the next generation of DeFi."\n' +
      '    },\n' +
      '    "about": {\n' +
      '      "title": "About Us",\n' +
      '      "description": "Oasis mission is to provide the best and most trusted entry point to deploy your capital."\n' +
      '    }\n' +
      '  },\n' +
      '  "set-allowance-for": "Set Allowance for {{token}}",\n' +
      '  "setting-allowance-for": "Setting Allowance for {{token}}",\n' +
      '  "setup-proxy": "Setup Proxy",\n' +
      '  "setup-wallet": "Setup your wallet",\n' +
      '  "show-more": "Show more",\n' +
      '  "spots-remaining": "{{ spots }} spots remaining",\n' +
      '  "start-saving": "Start Saving",\n' +
      '  "system": {\n' +
      '    "asset": "Asset",\n' +
      '    "available-to-withdraw": "Available to Withdraw",\n' +
      '    "available-to-generate": "Available to Generate",\n' +
      '    "coll-locked": "Coll. Locked",\n' +
      '    "coll-ratio": "Coll. Ratio",\n' +
      '    "collateral": "Collateral",\n' +
      '    "collateral-locked": "Collateral Locked",\n' +
      '    "collateral-ratio": "Collateral Ratio",\n' +
      '    "collateralization-ratio": "Collateralization Ratio",\n' +
      '    "stbl": "MONE",\n' +
      '    "stbl-available": "MONE Available",\n' +
      '    "stbl-debt": "MONE Debt",\n' +
      '    "deposited": "Deposited",\n' +
      '    "in-my-wallet": "In My Wallet",\n' +
      '    "in-your-wallet": "In Your Wallet",\n' +
      '    "liquidation-penalty": "Liquidation Penalty",\n' +
      '    "liquidation-price": "Liquidation Price",\n' +
      '    "liquidation-ratio": "Liquidation Ratio",\n' +
      '    "min-coll-ratio": "Min Coll. Ratio",\n' +
      '    "stability-fee": "Stability Fee",\n' +
      '    "type": "Type",\n' +
      '    "vault-stbl-debt": "Vault MONE Debt",\n' +
      '    "vault-id": "Vault ID"\n' +
      '  },\n' +
      '  "token-balance": "{{token}} balance",\n' +
      '  "token-depositing": "{{token}} depositing {{amount}}",\n' +
      '  "tos": "Terms of Service",\n' +
      '  "tos-accept-message": "Before you can get started, you’ll need to read and accept our terms of service.",\n' +
      '  "tos-accept-message-updated": "Before you can continue, you’ll need to read and accept our updated terms of service.",\n' +
      '  "tos-acceptance-check-in-progress": "Acceptance check in progress...",\n' +
      '  "tos-desc": "By creating a Savings pot, I accept Oasis",\n' +
      '  "tos-jwt-signature-message": "It looks like you\'re new to Oasis.app or are using a new device to connect. For added security, please sign a message with your wallet to continue.",\n' +
      '  "tos-read": "I have read and accept the Terms of Service.",\n' +
      '  "tos-view": "View Terms of Service",\n' +
      '  "tos-wallet-connection-in-progress": "Wallet connection in progress...",\n' +
      '  "tos-welcome": "Welcome",\n' +
      '  "tos-welcome-updated": "We’ve updated our terms ",\n' +
      '  "transaction-failed": "Transaction Failed",\n' +
      '  "transaction-fee": "Transaction fee",\n' +
      '  "transaction-fee-tooltip-desc": "Transactions fees are currently payable in MTR. The current cost of this action is approx",\n' +
      '  "trezor-cancel": "Select another wallet",\n' +
      '  "trezor-error": "There was an error, please reset",\n' +
      '  "trezor-loading-accounts": "Loading trezor accounts...",\n' +
      '  "trezor-select-address": "Select an address",\n' +
      '  "try-again": "Try again",\n' +
      '  "unlimited-allowance": "Unlimited Allowance",\n' +
      '  "vault": {\n' +
      '    "current-price": "Current {{token}}/USD Price in {{time}}",\n' +
      '    "header": "{{ilk}} Vault #{{id}}",\n' +
      '    "next-price": "Next price in {{count}} minute",\n' +
      '    "next-price-any-time": "Next price in <2 minutes",\n' +
      '    "next-price_plural": "Next price in {{count}} minutes",\n' +
      '    "open-vault": "Open {{ilk}} Vault",\n' +
      '    "vault-details": "Vault Details",\n' +
      '    "token-uds-price": "{{token}}/USD price"\n' +
      '  },\n' +
      '  "vault-actions": {\n' +
      '    "deposit": "Deposit",\n' +
      '    "generate": "Generate",\n' +
      '    "payback": "Payback",\n' +
      '    "withdraw": "Withdraw"\n' +
      '  },\n' +
      '  "vault-changed": "Vault changed!",\n' +
      '  "vault-history": "Vault History",\n' +
      '  "vaults": {\n' +
      '    "after": "After ${{price}}",\n' +
      '    "current-price": "Current {{token}}/USD price",\n' +
      '    "ilk-does-not-exist": "Ilk {{ilk}} does not exist",\n' +
      '    "next-price": "Next {{token}}/USD price: {{amount}}"\n' +
      '  },\n' +
      '  "ilks-list": {\n' +
      '    "headers": {\n' +
      '      "noVaults": "Select a collateral type to create a MetricOne Vault and generate MONE",\n' +
      '      "withVaults": "Open a new MetricOne Vault.<0/> Generate MONE"\n' +
      '    }\n' +
      '  },\n' +
      '  "vaults-overview": {\n' +
      '    "banner-content": "You can view your vaults",\n' +
      '    "banner-header": "You are viewing {{address}} Vaults overview",\n' +
      '    "headers": {\n' +
      '      "connected-owner-noVaults": "You have no open Vaults",\n' +
      '      "connected-owner-withVaults": "Your Vaults",\n' +
      '      "connected-viewer-noVaults": "{{address}} currently has no MetricOne Vaults",\n' +
      '      "connected-viewer-withVaults": "MetricOne Vaults overview of {{address}}",\n' +
      '      "notConnected-noVaults": "{{address}} currently has no MetricOne Vaults.<0/> Connect your wallet and open a vault.",\n' +
      '      "notConnected-withVaults": "MetricOne Vaults overview of {{address}}.<0/> Connect your wallet."\n' +
      '    },\n' +
      '    "number-of-vaults": "No. of Vaults",\n' +
      '    "subheader-no-vaults": "Open a MetricOne Vault, deposit your collateral, and generate MONE against it.",\n' +
      '    "total-debt": "Total debt",\n' +
      '    "total-locked": "Total locked",\n' +
      '    "vaults": "Vaults",\n' +
      '    "vaults-at-risk": "Vaults at risk",\n' +
      '    "your-vaults": "Your Vaults"\n' +
      '  },\n' +
      '  "vault-banners": {\n' +
      '    "ownership": {\n' +
      '      "header": "You are viewing {{address}} Vault",\n' +
      '      "subheader1": "Please connect your wallet to open, manage or view your Vaults.",\n' +
      '      "subheader2": "You can view your vaults"\n' +
      '    },\n' +
      '    "liquidating": {\n' +
      '      "header1": "Your {{ collateral }} MetricOne Vault {{ id }} is about to get liquidated.",\n' +
      '      "header2": "{{ collateral }} MetricOne Vault {{ id }} is about to get liquidated.",\n' +
      '      "subheader1": "The next price update of {{ collateral }} will cause a liquidation on this MetricOne Vault unless collateral is added, or MONE is paid back.",\n' +
      '      "subheader2": "Is this your MetricOne Vault? Please connect with address: {{ address }} and save your MetricOne Vault from liquidation.",\n' +
      '      "subheader3": "This Vault is now available for liquidation and can be liquidated at anytime."\n' +
      '    },\n' +
      '    "liquidated": {\n' +
      '      "header1": "Your MetricOne Vault got liquidated",\n' +
      '      "header2": "This MetricOne Vault got liquidated",\n' +
      '      "subheader1": "This MetricOne Vault has been liquidated. A portion of your collateral has been auctioned to pay back your MONE debt.",\n' +
      '      "subheader2": "You can reclaim {{ amount }} {{ collateral }}",\n' +
      '      "subheader3": "This MetricOne Vault has been liquidated. A portion of collateral has been auctioned to pay back the MONE debt.",\n' +
      '      "subheader4": "If this is your vault, connect with address: {{ address }} to reclaim the remaining collateral."\n' +
      '    }\n' +
      '  },\n' +
      '  "view": "View",\n' +
      '  "view-more": "View more",\n' +
      '  "view-on-etherscan": "View on Etherscan",\n' +
      '  "waiting-approval": "Waiting for approval",\n' +
      '  "waiting-confirmation": "Waiting for transaction confirmation",\n' +
      '  "waiting-proxy-deployment": "Proxy deployment confirming",\n' +
      '  "proxy-deployment-confirming": "{{proxyConfirmations}} of {{safeConfirmations}}: Proxy deployment confirmed",\n' +
      '  "withdraw": "Withdraw",\n' +
      '  "withdrawn": "Withdrawn",\n' +
      '  "you-are-sending": "You are sending",\n' +
      '  "your-vaults": "Your Vaults",\n' +
      '  "no-results": "No results",\n' +
      '  "learn-about-wallets": "Learn more about wallets",\n' +
      '  "learn-more-link": "https://ethereum.org/en/wallets/find-wallet/",\n' +
      '  "enter-an-amount": "Enter an amount",\n' +
      '  "enter-allowance-amount": "Enter allowance amount",\n' +
      '  "set-token-allowance": "Set {{token}} allowance",\n' +
      '  "invalid-allowance-amount": "Invalid allowance amount",\n' +
      '  "vault-form": {\n' +
      '    "header": {\n' +
      '      "edit": "Configure your Vault",\n' +
      '      "proxy": "Create your smart Proxy ",\n' +
      '      "allowance": "Set {{token}} allowance",\n' +
      '      "stblAllowance": "Set MONE allowance",\n' +
      '      "confirm": "Confirm vault creation",\n' +
      '      "confirm-manage": "Confirm vault changes"\n' +
      '    },\n' +
      '    "subtext": {\n' +
      '      "collateral": "Deposit or withdraw from your Vault. Save gas by combining transactions.",\n' +
      '      "stbl": "Generate MONE from the collateral in your vault, or payback MONE. Save gas by combining transactions.",\n' +
      '      "edit": "Simulate your vault by configuring the amount of collateral to deposit, and MONE to generate.",\n' +
      '      "proxy": "With your smart proxy we can perform multiple actions in one transaction for your Vault. This proxy only needs to be set up once.",\n' +
      '      "allowance": "Specify an allowance to set a maximum on the amount of tokens the vault contracts can interact with.",\n' +
      '      "stblAllowance": "Specify an allowance to set a maximum on the amount of tokens the vault contracts can interact with.",\n' +
      '      "confirm": "Review and verify details of your vault."\n' +
      '    }\n' +
      '  },\n' +
      '  "creating-your-vault": "Creating your {{token}} Vault!",\n' +
      '  "vault-created": "Vault #{{id}} created!",\n' +
      '  "changing-vault": "Changing Vault",\n' +
      '  "your-wallet": "Your wallet",\n' +
      '  "welcome": "Welcome to the new Oasis.app.",\n' +
      '  "read-blog-post": "Read the blog post",\n' +
      '  "visit-old-oasis": "Visit the old Oasis",\n' +
      '  "oracles": {\n' +
      '    "header": "Oracles",\n' +
      '    "description": "Below the current and next prices of the collateral types that are accepted for MetricOne vaults can be viewed. Most use the Oracle Stability Module (OSM). This module updates the price just once every hour. Therefore, when a crash is happening, users still have an hour to react to the new price.",\n' +
      '    "token": "Token",\n' +
      '    "current-price": "Current Price",\n' +
      '    "next-price": "Next Price",\n' +
      '    "change": "% Change",\n' +
      '    "last-update": "Last Update",\n' +
      '    "next-update": "Next Update",\n' +
      '    "oracle-type": "Oracle Type"\n' +
      '  }\n' +
      '}\n').toFixed(0),
  ])
  const dsProxy: DsProxy = new ethers.Contract(proxyAddress, dsProxyAbi, provider).connect(
    signer,
  ) as any
  await (
    await dsProxy['execute(address,bytes)'](PROXY_ACTIONS, proxyAction, {
      value: amountToWei(collateralAmount, 'MTR').toFixed(0),
      from: address,
      gasLimit: 5000000,
    })
  ).wait()
  return await getLastCDP(provider, signer, proxyAddress)
}

async function getPriceData(
  provider: ethers.providers.JsonRpcProvider,
): Promise<{ curr: BigNumber; next: BigNumber; timestamp: number; hop: number }> {
  const osm: McdOsm = new ethers.Contract(PIP_ETH, osmAbi, provider) as any
  const [currPriceHex] = await osm.peek({ from: MCD_SPOT })
  const [nextPriceHex] = await osm.peep({ from: MCD_SPOT })
  const zzz = await osm.zzz({ from: MCD_SPOT })
  const hop = await osm.hop({ from: MCD_SPOT })
  const currPrice = Web3.utils.hexToNumberString(currPriceHex)
  const nextPrice = Web3.utils.hexToNumberString(nextPriceHex)
  return {
    curr: new BigNumber(currPrice).dividedBy(wad),
    next: new BigNumber(nextPrice).dividedBy(wad),
    timestamp: zzz.toNumber(),
    hop: hop,
  }
}

async function generateStblForLiquidator(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.providers.JsonRpcSigner,
): Promise<void> {
  const proxyAddress = await getOrCreateProxy(provider, signer)
  const collateralAmount = new BigNumber(100)
  const generateAmount = new BigNumber(20000)
  await openLockCoinAndDraw(provider, signer, collateralAmount, generateAmount, proxyAddress)
}

async function joinStbl(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.providers.JsonRpcSigner,
  wad: BigNumber,
): Promise<void> {
  const address = await signer.getAddress()
  const stbl: Erc20 = new ethers.Contract(MCD_STBL, erc20Abi, provider).connect(signer) as any
  const joinStbl: McdJoinStbl = new ethers.Contract(MCD_JOIN_STBL, joinStblAbi, provider).connect(
    signer,
  ) as any

  await (await stbl.approve(joinStbl.address, wad.toString())).wait()
  await (await joinStbl.join(address, wad.toString())).wait()
}

async function liquidateCDP(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.providers.JsonRpcSigner,
  cdp: CDP,
): Promise<void> {
  const cat: McdCat = new ethers.Contract(MCD_CAT, mcdCatAbi, provider).connect(signer) as any
  // Start liquidation
  await (await cat['bite(bytes32,address)'](ILK, cdp.urn)).wait()

  const flipper: McdFlip = new ethers.Contract(MCD_FLIP_ETH_A, flipAbi, provider).connect(
    signer,
  ) as any
  const bidId = (await flipper['kicks()']()).toNumber()
  const bid = await flipper['bids(uint256)'](bidId)

  // We will open a CDP to get MONE to pay for collateral
  await generateStblForLiquidator(provider, signer)
  const vat: Vat = new ethers.Contract(MCD_VAT, vatAbi, provider).connect(signer) as any
  // We need internal MONE, not external one so we join it in
  await joinStbl(
    provider,
    signer,
    new BigNumber(bid.tab.toString())
      .dividedToIntegerBy(ray)
      .plus(1) /* this plus one is used instead of rounding up */,
  )
  // Allow flipper to spend our internal MONE
  await (await vat.hope(flipper.address)).wait()
  // Make a bid
  await (await flipper.tend(bidId, bid.lot, bid.tab)).wait()

  // Deacrease lot size to get some collateral back after auction
  const newLot = new BigNumber(bid.lot.toString()).multipliedBy(0.9)

  await (await flipper.dent(bidId, newLot.toString(), bid.tab)).wait()

  // Disallow flipper to spend our internal MONE
  await (await vat.nope(flipper.address)).wait()

  const timestamp = (await provider.getBlock('latest')).timestamp
  const FOUR_HOURS = 5 * 60 * 60
  await provider.send('evm_setNextBlockTimestamp', [timestamp + FOUR_HOURS])
  // Close the liquidation process
  await (await flipper.deal(bidId)).wait()
}

async function triggerPriceUpdate(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.providers.JsonRpcSigner,
): Promise<void> {
  // Move time so that the price update is possible
  const { timestamp, hop } = await getPriceData(provider)
  await provider.send('evm_setNextBlockTimestamp', [timestamp + hop])

  const osm: McdOsm = new ethers.Contract(PIP_ETH, osmAbi, provider).connect(signer) as any
  await (await osm.poke()).wait()

  const mcdSpot: McdSpot = new ethers.Contract(MCD_SPOT, spotAbi, provider).connect(signer) as any
  await (await mcdSpot.poke(ILK)).wait()
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider()
  const [user, liquidator] = [provider.getSigner(0), provider.getSigner(1)]
  console.log(`User with CDPs ${await user.getAddress()}`)
  console.log(`Liquidator ${await liquidator.getAddress()}`)

  const { curr } = await getPriceData(provider)
  const userProxyAddress = await getOrCreateProxy(provider, user)
  const collateralAmount = new BigNumber(10) // 10 MTR
  const collateralAmountUSD = collateralAmount.multipliedBy(curr)
  const generateAmountUnsafe = collateralAmountUSD.dividedToIntegerBy(1.5) // 150%
  const generateAmountSafe = collateralAmountUSD.dividedToIntegerBy(2.5) // 250%

  const safe = await openLockCoinAndDraw(
    provider,
    user,
    collateralAmount,
    generateAmountSafe,
    userProxyAddress,
  ) // CDP with 250% collateralization rate

  const unsafe = await openLockCoinAndDraw(
    provider,
    user,
    collateralAmount,
    generateAmountUnsafe,
    userProxyAddress,
  ) // CDP with 150% collateralization rate. Can be liquidated on next price update when the rate drops to 146%

  const toLiquidate = await openLockCoinAndDraw(
    provider,
    user,
    collateralAmount,
    generateAmountUnsafe,
    userProxyAddress,
  ) // CDP with 150% collateralization rate. Will be liquidated on next price update

  await triggerPriceUpdate(provider, liquidator)
  await liquidateCDP(provider, liquidator, toLiquidate)

  console.log('Safe CDP', safe.id)
  console.log('Unsafe CDP', unsafe.id)
  console.log('Liquidated CDP', toLiquidate.id)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
