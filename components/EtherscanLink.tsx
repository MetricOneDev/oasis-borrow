import React from 'react'
import { Link } from 'theme-ui'

interface IEtherscanLink {
  children: React.ReactNode
  transactionHash: string
  network: string
}

export const EtherscanLink = ({ children, transactionHash, network }: IEtherscanLink) => {
  let url = ''
  if (network === 'velas') {
    url = `https://evmexplorer.velas.com/tx/${transactionHash}`
  } else if (network === 'velastestnet') {
    url = `https://evmexplorer.testnet.velas.com/tx/${transactionHash}`
  } else if (network === 'meter') {
    url = `https://scan.meter.io/tx/${transactionHash}`
  } else if (network === 'metertestnet') {
    url = `https://scan-warringstakes.meter.io/tx/${transactionHash}`
  } else {
    const pathPrefix = network === 'main' ? '' : `${network}.`
    url = `https://${pathPrefix}etherscan.io/tx/${transactionHash}`
  }
  return (
    <Link target="_blank" href={url}>
      {children}
    </Link>
  )
}
