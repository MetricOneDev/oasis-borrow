import { WithConnection } from 'components/connectWallet/ConnectWallet'
import { MarketingLayout } from 'components/Layouts'
import { LandingView } from 'features/landing/LandingView'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default function LandingPage() {
  return (
    <WithConnection>
      <LandingView />
    </WithConnection>
  )
}

LandingPage.layout = MarketingLayout
LandingPage.layoutProps = {
  variant: 'landingContainer',
}
LandingPage.theme = 'Landing'
