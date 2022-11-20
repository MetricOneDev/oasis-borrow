import { ContentTypeSupport } from './support'

export const content: ContentTypeSupport = {
  title: 'FAQ',
  navigation: [
    { title: 'Using Metric Vaults', id: 'using-oasis' },
    // { title: 'Using MONE Wallet', id: 'using-stblwallet' },
    { title: 'Security', id: 'security' },
    { title: 'Buying MONE', id: 'buying-stbl' },
  ],
  sections: [
    {
      title: 'Using Metric Vaults',
      id: 'using-oasis',
      questions: [
        {
          question: 'What assets can I use as collateral?',
          answer: `You can use many different collateral types which are voted in by MetricOne Governance to the MetricOne Protocol, including MTR and wrapped BTC. You can see each one by visiting Metric Vaults with the corresponding Stability Fees and Minimum Collateralization Ratios.`,
        },

        {
          question: 'How much does it cost?',
          answer: `Opening and managing a Vault is free on Metric Vaults except for gas costs and Stability Fees. The Stability Fee is charged on the amount of MONE you have generated and goes directly to the MetricOne Protocol.`,
        },

        {
          question: 'How do I open a Vault?',
          answer: `To open a Vault, select the relevant Collateral and sub-type (e.g. MTR-A) from the homepage (Metric Vaults) and connect your preferred wallet and follow the on screen instructions that will guide you through.`,
        },

        {
          question: 'What is the difference between -A/-B/-C collateral Vaults?',
          answer: `There are multiple Vault types for some collaterals. Each type indicated by a letter has its own Collateralization Ratio, and Stability Fee. You can pick whatever type of Vault you want according to your needs and risk profile.`,
        },

        {
          question: 'What is a Proxy? Why do I need to generate one?',
          answer: `A Proxy is a smart contract that allows you to easily interact with supported protocols, including the MetricOne Protocol, to manage your Vaults, generate MONE and so on. You will only need to do this once per wallet and all your Vaults will be managed through this single Proxy. Please never send any funds to this Proxy address though.`,
        },

        {
          question: 'Why do I need to approve tokens? What is allowance?',
          answer: `Token allowances let you control how much the proxy contract can do with the token balance in your wallet. To allow the Proxy contract to pay back MONE, or interact with the collaterals in your wallet, you will need to authorize it by setting an allowance with each token that you want to use with Metric Vaults. You can set the allowance to the amount you want to use each time or you can set a higher allowance for future interactions with Metric Vaults. This will all be presented to you within the flows inside Metric Vaults, and you won’t have to do anything extra if you don’t see any prompts.`,
        },

        {
          question: 'What is the Liquidation Ratio?',
          answer: `The Liquidation Ratio is the Minimum Collateralization Ratio which you must keep your Vault at to not put it at risk of being liquidated. If your Vault goes below this Minimum Collateralization Ratio, your Vault could be liquidated and your collateral sold off to cover your debt. To understand more about collateralization ratio and liquidations follow the links to the Knowledge Base.`,
        },

        {
          question: 'What is the Liquidation Price?',
          answer: `The Liquidation Price is the price that your Vault will be at risk of liquidation based on the ‘Current Price’ from the Oracle Security Module of the MetricOne Procol. It is a helpful indicator to allow you to know when you could get liquidated. Please note however that if your Vault has a positive Stability Fee (i.e. >0) then your liquidation price will continually increase as more debt is added to your Vault.`,
        },

        {
          question: 'What is the Liquidation Penalty?',
          answer: `The Liquidation Penalty is the amount added to your debt once your Vault is liquidated. Each collateral and sub-type (e.g. MTR-A and MTR-B) can have their own liquidation penalties set by MetricOne Governance. This penalty is also paid directly to the MetricOne Protocol, and Metric Vaults does not charge you any additional fees for being liquidated.`,
        },

        {
          question: 'What is the minimum Vault Debt?',
          answer: `The minimum Vault Debt, also called Dust, is the minimum amount of MONE you must generate to open a new Vault, and maintain. This minimum Vault Debt value is set and can be adjusted at any time by MetricOne Governance. If the minimum is increased to a value above your current Debt, then you will experience reduced functionality of your Vault until you increase it to above the minimum again.`,
        },

        {
          question: 'What is the next price and how do you know?',
          answer: `Within the MetricOne Protocol, there are always two prices for the collateral, the current price and the next price. To protect the system and users from ‘bad actors’ and flash crashes, the MetricOne Protocol uses an ‘Oracle Security Module’. This means that all prices that go into the system are delayed by one hour, and only updated once per hour - roughly on the hour. The next price is the price that will come into the system as the ‘Current Price’. It is the Current Price that your Vault is always measured against, so you can only be liquidated once the ‘Current Price’ goes below your  ‘Liquidation Price’. This also means you have up to one hour to react if there is a big price drop and the next price is below your Liquidation Price.`,
        },

        {
          question: 'What is gas?',
          answer: `Gas is the unit of measure for paying for transactions on the Meter Blockchain. Gas prices are charged in MTR and you will always need to have MTR in your wallet to be able to interact with Metric Vaults. This Gas fee goes directly to Meter Miners who keep Meter running. Metric Vaults does not charge any fees for basic Vault management.`,
        },

        {
          question: 'Why would I change the transaction speed?',
          answer: `Transaction speed allows you to pay more gas to get your transactions mined faster. In case you are in a hurry, for example to increase your Collateralization Ratio to avoid liquidation, you can set a fast speed for your transactions.`,
        },

        {
          question: 'How can I contact the Metric Vaults team?',
          answer:
            'If you have any questions, reach out to us through our Contact page or on [Twitter](https://twitter.com/).',
        },
      ],
    },
    // {
    //   title: 'Using MONE Wallet',
    //   id: 'using-stblwallet',
    //   questions: [
    //     {
    //       question: 'What is MONE Wallet?',
    //       answer: `MONE Wallet is the home for everything you want to accomplish with MONE. A decentralized application that runs on the Meter blockchain, Metric Vaults MONE Wallet enables you to Buy, Send, and Manage your MONE all in one place.`,
    //     },
    //     {
    //       question: 'What is MONE?',
    //       answer: `MONE is a better, smarter digital currency for everyone. It is the world’s first unbiased currency and its value consistently tracks the US Dollar, which means it doesn't suffer from the volatility associated with many other digital currencies. To learn more about MONE, read our [short primer](/stblwallet/stbl).`,
    //     },
    //     {
    //       question: 'Do I need an account?',
    //       answer: `No. You do not need to create a new account to use MONE Wallet. You can get started with almost any EVM wallet, including Metamask or Coinbase Wallet, or you can use our new Magic.Link feature -- where you provide an email address, click a link in the email we send you in response, and you're logged in.`,
    //     },
    //     {
    //       question: 'Will I be charged fees?',
    //       answer:
    //         'Our MONE Wallet is currently free to use. However, you will have to pay transaction fees and, depending on the features you use, fees associated with MetricOne and other protocols, such as Stability or exchange fees.',
    //     },
    //     {
    //       question: 'Why do I need MTR to send or save my MONE?',
    //       answer: `To complete any transaction on the Meter blockchain, you need to pay a transaction fee using MTR, its default token. This fee is referred to as 'gas', and much like the gas that powers your car, this gas fee powers your transaction.`,
    //     },
    //     {
    //       question: 'How can I contact the Metric Vaults team?',
    //       answer:
    //         'If you have any questions, reach out to us through our [Contact page](/stblwallet/contact) or on [Twitter](https://twitter.com/).',
    //     },
    //   ],
    // },
    {
      title: 'Security',
      id: 'security',
      questions: [
        {
          question: 'Is Metric Vaults Secure?',
          answer:
            'Security is our top priority. We stringently follow the best security practices, and regularly conduct smart contract and code audits. In addition, Metric Vaults code is open-source, giving everyone in the community the ability to pressure test and audit the core technology.',
        },
        {
          question: 'Can Metric Vaults access the funds in my account or wallet?',
          answer:
            'No. With MONE, you - and only you - have access and control over your MONE. MONE uses blockchain technology to ensure the highest level of trust and transparency, and because of the way blockchain technology works, you ultimately get to decide just how secure you want it to be. This does mean you are your own security ultimately, so it is very important you keep access to your MONE and Metric Vaults account secure.',
        },
      ],
    },
    {
      title: 'Buying MONE',
      id: 'buying-stbl',
      questions: [
        {
          question: 'Can I buy MONE while using MONE Wallet?',
          answer: `Yes! Through connections with our partners, you can buy MONE in over 100 countries around the world, including Europe, the US, parts of Latin America. We have partnered with three registered third-party providers - Latamex, Wyre and Moonpay - to facilitate user purchases of  MONE using a range of debit or credit cards or bank transfers. Just connect to the app and hit the 'Buy MONE' button to see applicable providers for you.`,
        },
        {
          question: 'Is there a limit on how much MONE I can buy?',
          answer:
            'Yes, and it can vary depending on which third-party provider you use and what country you are in. Full details can be found on using the links; [Latamex Limits](https://latamex.zendesk.com/hc/es/articles/360037752631--Cu%C3%A1les-son-los-l%C3%ADmites-de-operaci%C3%B3n-), [Moonpay](https://support.moonpay.io/hc/en-gb/articles/360011931637-What-are-your-purchase-limits-) and [Wyre](https://support.sendwyre.com/en/articles/4457158-card-processing-faqs)',
        },
        {
          question: 'What is the minimum amount I can buy?',
          answer: `Like the maximum limits, there are also minimum amounts which are dependant on the third-party provider and location. Latamex: Argentina: 2000 ARS, Brazil: 80.00 BRL, Mexico: 270.00 MXN Moonpay: Minimum order is 20 MONE Wyre: Minimum order is 20 MONE`,
        },
        {
          question: 'Who are the fees going to?',
          answer: `Metric Vaults doesn't take any of the fees when you buy MONE or MTR through one of our partner providers. The fee you pay goes solely and directly to the third-party provider.`,
        },
        {
          question: 'Can I buy MTR on MONE Wallet to pay for my transaction fees?',
          answer:
            'Yes. Just like buying MONE, you can start the same process as you would to buy MONE, choose your third-party provider, and each offers an option to change MONE for MTR when you start the process.',
        },
      ],
    },
  ],
  cantFind: 'Can’t find what you’re looking for?',
  contactLink: 'Contact us here',
}
