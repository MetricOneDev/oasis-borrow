// @ts-ignore
import { Icon } from '@makerdao/dai-ui-icons'
import BigNumber from 'bignumber.js'
import { useAppContext } from 'components/AppContextProvider'
import { disconnect, getConnectionKindMessage } from 'components/connectWallet/ConnectWallet'
import { AppLink } from 'components/Links'
import { Modal, ModalCloseIcon } from 'components/Modal'
import { formatAddress, formatCryptoBalance } from 'helpers/formatters/format'
import { ModalProps, useModal } from 'helpers/modalHook'
import { useObservable } from 'helpers/observableHook'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'
// @ts-ignore
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { TRANSITIONS } from 'theme'
import { Box, Button, Card, Flex, Grid, Heading, Text, Textarea } from 'theme-ui'
import Web3 from "web3";

import { PendingTransactions, RecentTransactions } from './TransactionManagerView'

function UsdvIndicator({ usdvBalance }: { usdvBalance: BigNumber | undefined }) {
  return (
    <Flex
      sx={{
        position: 'relative',
        alignItems: 'center',
        bg: 'warning',
        borderRadius: 'round',
        p: 1,
      }}
    >
      <Icon sx={{ zIndex: 1 }} name="usdv_circle_color" size={30} />
      <Box sx={{ mx: 2, color: 'onWarning' }}>
        {usdvBalance ? formatCryptoBalance(usdvBalance) : '0.00'}
      </Box>
    </Flex>
  )
}
export function AccountIndicator({ address }: { address: string }) {
  return (
    <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', mx: 3 }}>
      <Text variant="paragraph4" sx={{ fontWeight: 'bold' }}>
        {formatAddress(address)}
      </Text>
    </Flex>
  )
}

const buttonMinWidth = '150px'

export function AccountButton() {
  const { accountData$, context$ } = useAppContext()
  const accountData = useObservable(accountData$)
  const context = useObservable(context$)
  const { t } = useTranslation()
  const openModal = useModal()

  if (context === undefined) {
    return null
  }

  if (context?.status === 'connectedReadonly') {
    return (
      <AppLink
        sx={{
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 2,
          borderRadius: 'mediumLarge',
          transition: 'background 0.2s',
          '&:hover, &:focus ': {
            color: 'initial',
            bg: 'ghost',
            '& svg': {
              left: '4px',
            },
          },
        }}
        href="/connect"
        variant="nav"
      >
        {t('connect-wallet-button')}
        <Icon
          name="arrow_right"
          size={14}
          sx={{ ml: 1, position: 'relative', transition: 'ease-in-out 0.2s', left: 0 }}
        />
      </AppLink>
    )
  }

  if (accountData === undefined) {
    return null
  }

  return (
    <Flex
      sx={{
        position: 'relative',
        justifyContent: 'flex-end',
        minWidth: 'auto',
      }}
    >
      <Button
        variant="secondary"
        sx={{
          boxSizing: 'border-box',
          minWidth: buttonMinWidth,
          zIndex: 1,
          background: 'white',
          boxShadow: 'table_hovered',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          transition: 'border-color ease-in 0.2s',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#D8E0E300',
          '&:hover, &:focus-visible': {
            borderColor: '#D8E0E3FF',
          },
          ':focus': {
            outline: 'none',
          },
        }}
        onClick={() => openModal(AccountModal)}
      >
        <AccountIndicator address={context.account} />
        <UsdvIndicator usdvBalance={accountData.usdvBalance} />
      </Button>
      <Button
        variant="secondary"
        sx={{
          boxSizing: 'border-box',
          minWidth: buttonMinWidth,
          zIndex: 1,
          background: 'white',
          boxShadow: 'table_hovered',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          transition: 'border-color ease-in 0.2s',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#D8E0E300',
          '&:hover, &:focus-visible': {
            borderColor: '#D8E0E3FF',
          },
          ':focus': {
            outline: 'none',
          },
        }}
        onClick={() => openModal(BuyUsdvOnUtorgModal)}
      >
        {t('buy-utorg')}
      </Button>
    </Flex>
  )
}

async function signMessageForUtorg(message: string, web3: Web3, account: string): Promise<string> {
  // @ts-ignore
  return web3.eth.personal.sign(message, account)
}

interface IUtorgUrls {
  usdv: string;
  vlx: string;
}

async function createUtorgUrl(web3: Web3, account: string, chainId: number): Promise<IUtorgUrls> {
  const currency = 'USDV'
  const alg = 'WEB3'
  const sid = chainId === 106 ? 'vaultsVelerofinance' : 'veleroTESTfinance'
  const domain = chainId === 106 ? 'app.utorg.pro' : 'app-stage.utorg.pro'

  const ts = Date.now()
  try {
    const sign = await signMessageForUtorg(`Access to UTORG. Timestamp: ${ts}`, web3, account)
    return {
      usdv: `https://${domain}/direct/${sid}/${account}?currency=${currency}&timestamp=${ts}&alg=${alg}&publicKey=${account}&signature=${sign}`,
      vlx: `https://${domain}/direct/${sid}/${account}?timestamp=${ts}&alg=${alg}&publicKey=${account}&signature=${sign}`,
    }
  } catch (e) {
      console.error(e)
      return {
        usdv: '/',
        vlx: '/',
      }
  }
}

export function BuyUsdvOnUtorgModal({ close }: ModalProps) {
  const { web3Context$ } = useAppContext()
  const web3Context = useObservable(web3Context$)
  const { t } = useTranslation()

  if (web3Context?.status !== 'connected') return null
  const { account, web3, chainId } = web3Context

  setTimeout(() => {
    void createUtorgUrl(web3, account, chainId).then(result => {
      setTimeout(() => {
        // document.getElementById(`utorgURL`)?.setAttribute('href', result.usdv)
        document.getElementById(`utorgURLBuyVLX`)?.setAttribute('href', result.vlx)
      })
    })
  })

  return (
    <Modal close={close} sx={{ maxWidth: '530px', margin: '0px auto' }}>
      <ModalCloseIcon {...{ close }} />
      <Grid gap={2} pt={3} mt={1}>
        <Box
          px={3}
          mx={1}
          sx={{
            '&:last-child': {
              pb: 3,
              mb: 1,
            },
          }}
        >
          <Heading mb={3}>{t('your-wallet')}</Heading>
          {/*<a*/}
          {/*  href="/"*/}
          {/*  onClick={close}*/}
          {/*  id="utorgURL"*/}
          {/*  color="primary"*/}
          {/*  target="_blank"*/}
          {/*  style={{ color: "black", textDecoration: "none", alignContent: "center" }}*/}
          {/*>*/}
          {/*  <Card variant="secondary">*/}
          {/*    {t('buy-usdv-utorg')}*/}
          {/*  </Card>*/}
          {/*</a>*/}
          {/*<br/>*/}
          <a
            href="/"
            onClick={close}
            id="utorgURLBuyVLX"
            color="primary"
            target="_blank"
            style={{ color: "black", textDecoration: "none", alignContent: "center" }}
          >
            <Card variant="secondary">
              {t('buy-vlx-utorg')}
            </Card>
          </a>
        </Box>
      </Grid>
    </Modal>
  )

}

export function AccountModal({ close }: ModalProps) {
  const { web3Context$, accountData$ } = useAppContext()
  const accountData = useObservable(accountData$)
  const web3Context = useObservable(web3Context$)
  const clipboardContentRef = useRef<HTMLTextAreaElement>(null)
  const { t } = useTranslation()

  function disconnectHandler() {
    disconnect(web3Context)
    close()
  }

  function copyToClipboard() {
    const clipboardContent = clipboardContentRef.current

    if (clipboardContent) {
      clipboardContent.select()
      document.execCommand('copy')
    }
  }

  if (web3Context?.status !== 'connected') return null

  const { account, connectionKind } = web3Context

  return (
    <Modal close={close} sx={{ maxWidth: '530px', margin: '0px auto' }}>
      <ModalCloseIcon {...{ close }} />
      <Grid gap={2} pt={3} mt={1}>
        <Box
          px={3}
          mx={1}
          sx={{
            '&:last-child': {
              pb: 3,
              mb: 1,
            },
          }}
        >
          <Heading mb={3}>{t('your-wallet')}</Heading>
          <Card variant="secondary">
            <Grid>
              <Flex sx={{ justifyContent: 'space-between' }}>
                {connectionKind === 'network' ? (
                  <Text sx={{ fontWeight: 'semiBold' }}>{t('connected-in-readonly-mode')}</Text>
                ) : (
                  <Text sx={{ fontWeight: 'semiBold' }}>
                    {t('connected-with', {
                      connectionKind: getConnectionKindMessage(connectionKind),
                    })}
                  </Text>
                )}
              </Flex>
              <Flex sx={{ alignItems: 'center' }}>
                <Box mr={2}>
                  <Jazzicon diameter={28} seed={jsNumberForAddress(account)} />
                </Box>
                <Text sx={{ fontSize: 5, mx: 1 }}>{formatAddress(account)}</Text>
                <Icon
                  name="copy"
                  sx={{
                    ml: 2,
                    cursor: 'pointer',
                    color: 'mutedAlt',
                    transition: TRANSITIONS.global,
                    '&:hover': { color: 'primaryEmphasis' },
                  }}
                  onClick={() => copyToClipboard()}
                />
                {/* Textarea element used for copy to clipboard using native API, custom positioning outside of screen */}
                <Textarea
                  ref={clipboardContentRef}
                  sx={{ position: 'absolute', top: '-1000px', left: '-1000px' }}
                  value={account}
                  readOnly
                />
              </Flex>
              <Flex>
                <AppLink
                  sx={{ mr: 3 }}
                  onClick={close}
                  href="/owner/[address]"
                  as={`/owner/${account}`}
                >
                  {t('your-vaults')}{' '}
                  {accountData?.numberOfVaults !== undefined && `(${accountData.numberOfVaults})`}
                </AppLink>
                <Button
                  variant="textual"
                  sx={{
                    textAlign: 'left',
                    p: 0,
                    verticalAlign: 'baseline',
                  }}
                  onClick={disconnectHandler}
                >
                  {t(`disconnect${connectionKind === 'magicLink' ? '-magic' : ''}`)}
                </Button>
              </Flex>
            </Grid>
          </Card>
        </Box>
        <Flex
          sx={{
            fontWeight: 'semiBold',
            px: 3,
            my: 3,
            py: 1,
            mx: 1,
          }}
        >
          <AppLink
            sx={{ color: 'primary', mr: 3 }}
            withAccountPrefix={false}
            href="/terms"
            onClick={close}
          >
            {t('account-terms')}
          </AppLink>
          <AppLink
            sx={{ color: 'primary', mr: 3 }}
            withAccountPrefix={false}
            href="/privacy"
            onClick={close}
          >
            {t('account-privacy')}
          </AppLink>
          <AppLink
            sx={{ color: 'primary' }}
            withAccountPrefix={false}
            href="/support"
            onClick={close}
          >
            {t('account-support')}
          </AppLink>
        </Flex>
        <PendingTransactions />
        <RecentTransactions />
      </Grid>
    </Modal>
  )
}
