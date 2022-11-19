import React from 'react'
import { Link } from 'theme-ui'

interface IEtherscanLink {
  children: React.ReactNode
  transactionHash: string
  network: string
}

export const EtherscanLink = ({ children, transactionHash, network }: IEtherscanLink) => {
  const pathPrefix = network === 'meter' ? '' : `-warringstakes`
  const url = `https://scan${pathPrefix}.meter.io/tx/${transactionHash}`

  return (
    <Link target="_blank" href={url}>
      {children}
    </Link>
  )
}
