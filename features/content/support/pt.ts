import { ContentTypeSupport } from './support'

export const content: ContentTypeSupport = {
  title: 'FAQ',
  navigation: [
    { title: 'Utilizando Metric Vaults', id: 'using-oasis' },
    // { title: 'Utilizando MONE Wallet', id: 'using-stblwallet' },
    { title: 'Segurança', id: 'security' },
    { title: 'Comprando MONE', id: 'buying-stbl' },
  ],
  sections: [
    {
      title: 'Utilizando Metric Vaults',
      id: 'using-oasis',
      questions: [
        {
          question: 'Quais ativos posso usar como colateral?',
          answer: `Você pode usar os colaterais que são aprovados pela Governança do MetricOne, incluindo MTR e BTC envelopado ('wrapped BTC'). Você pode ver cada um dos tipos entrando no Metric Vaults, podendo checar inclusive a Taxa de Estabilidade e Ratio Mínimo de Colateralização.`,
        },

        {
          question: 'Quanto custa?',
          answer: `Abrir e gerir um Cofre (Vault) é grátis no Metric Vaults, exceto pelos custos com gás e Taxas de Estabilidade. A Taxa de Estabilidade é cobrada em cima da quantidade de MONE gerada e é destinada diretamente ao Protocolo MetricOne.`,
        },

        {
          question: 'Como eu abro um Cofre (Vault)',
          answer: `Para abrir um Cofre, selecione o colateral e seu sub-tipo (ex. MTR-A) na página inicial (Metric Vaults), connecte sua carteira escolhida e siga as instruções.`,
        },

        {
          question: 'O que é a Taxa de Estabilidade?',
          answer: `A Taxa de Estabilidade é a taxa anual varíavel (mostrada em porcentagem) adicionada a sua dívida - que deverá ser paga. Ela pode ser vista como o custo para gerar MONE, que é pago diretamente ao Protocolo MetricOne. Para ler mais sobre a Taxa de Estabilidade por favor cheque nossa Central de Conhecimento.`,
        },

        {
          question: 'Qual a diferença entre -A/-B/-C sub-tipos de Cofres?',
          answer: `Existem múltiplos tipos de Cofre para alguns colaterais. Cada tipo indicado pela letra tem seus próprios Ratios de Colateralização e Taxas de Estabilidade. Você pode escolher o tipo de Cofre que você preferir de acordo com suas necessidades e perfil de risco.`,
        },

        {
          question: 'O que é um Proxy? Por que eu preciso gerar um?',
          answer: `O Proxy é um contrato inteligente que facilita sua interação com protocolos, inclusive com o MetricOne. Ele auxilia na gestão do Cofre, geração de MONE, entre outros. Você precisa fazer isso apenas uma vez por carteira e todos os seus cofres serão geridos pelo Proxy. Por favor, nunca envie seus fundos diretamente para o endereço do Proxy.`,
        },

        {
          question: 'Por que eu preciso aprovar tokens? O que é a permissão ("allowance")?',
          answer: `As permissões de tokens permitem você controlar quanto o contrato Proxy pode interagir em relação ao balanço de sua carteira. Isso permite que o Contrato Proxy pague MONE ou interaja com os colaterais em sua carteira. Você precisará autorizar a permissão ("allowance") para cada token que deseja utilizar no Metric Vaults. Você pode configurar sua permisão ("allowance") para a quantia que você deseja usar cada vez ou para um valor maior, já pensando em futuras interações com Metric Vaults. Isso será apresentado para você dentro dos fluxos do Metric Vaults e você não terá que realizar ação alguma se você não encontrar avisos neste sentido.`,
        },

        {
          question: 'O que é o Ratio de Liquidação?',
          answer: `O Ratio de Liquidação é o Ratio Mínimo de Colateralização que você precisa manter para evitar que seu Cofre seja liquidado. Se seu Cofre for abaixo do Ratio Mínimo de Colateralização, seu Cofre pode ser liquidado e seu colateral vendido para pagar a dívida. Para entender mais sobre o Ratio de Colateralização e liquidações, entre neste links da nossa Central de Conhecimento.`,
        },

        {
          question: 'O que é o Preço de Liquidação?',
          answer: `O Preço de Liquidação é o preço no qual seu Cofre estará em risco de liquidação baseado no 'Preço Atual' do Módulo de Segurança do Protocolo MetricOne. É um indicador útil para você descobrir se pode ser liquidado. Por favor, note que se o seu Cofre tiver uma Taxa de Estabilidade positiva (>0), seu preço de liquidação continuará aumentando, já que mais dívida é adicionada ao seu Cofre. Você pode ler mais sobre Liquidação aqui.`,
        },

        {
          question: 'O que é Penalidade de Liquidação?',
          answer: `A Penalidade de Liquidação é a quantia adicionada a sua dívida quando seu Cofre é liquidado. Cada colateral e sub-tipo (ex. MTR-A e MTR-B) podem ter suas próprias características de penalidades, determinadas pela Governança MetricOne. Essa penalidade também é paga diretamente ao Protocolo MetricOne e Metric Vaults não cobra taxas adicionais em casos de liquidação.`,
        },

        {
          question: 'O que é a Dívida Mínima do Cofre?',
          answer: `A Dívida Mínima do Cofre, também chamada de pó (dust), é a quantia mínima de MONE que você precisa para abrir e manter um novo Cofre. Essa Dívida Mínima do Cofre é determinada pela Governança MetricOne e pode ser ajustada a qualquer momento. Se o mínimo for aumentado para um valor acima da sua dívida atual, você irá experenciar funcionalidade reduzida do seu Cofre até que você aumente sua dívida acima do mínimo novamente. Para ler mais sobre a Dívida Mínima do Cofre, acesse aqui.`,
        },

        {
          question: 'O que é o próximo preço e como você sabe?',
          answer: `Dentro do Protocolo MetricOne, sempre existem 2 preços para o colateral; o preço atual e o próximo preço. Para proteger o sistema e usuários de ‘agentes maliciosos’ e quedas repentinas (flash crashes), o Protocolo MetricOne usa o 'Módulo de Segurança'. Isso significa que todos os preços utilizados pelo sistema são atrasados em uma hora e apenas atualizados uma vez por hora - aproximadamente no arredondar da hora. O próximo preço é o preço que entrará no sistema como 'Preço Atual'. É o Preço Atual que seu Cofre utiliza como referência, podendo apenas ser liquidado se o 'Preço Atual' estiver abaixo do seu 'Preço de Liquidação'. Isso também significa que você tem até uma hora para reagir se houver uma grande queda no preço e o próximo preço estiver abaixo do seu Preço de Liquidação. Você pode ler mais sobre o Módulo de Segurança aqui.`,
        },

        {
          question: 'O que é gás?',
          answer: `Gás é unidade de medida utilizada para pagar por transações no blockchain do Meter. Os preços de gás são cobrados em MTR e você sempre precisará ter MTR em sua carteira para ser capaz de interagir com Metric Vaults. Essa taxa vai diretamente para os mineradores do Meter que mantém a rede do Meter funcionando. Metric Vaults não cobra taxas pelo uso de funcionalidades básicas do Cofre.`,
        },

        {
          question: 'Por que eu mudaria a velocidade da transação?',
          answer: `A velocidade na transação permite que você pague mais gás para ter sua transação minerada mais rapidamente. Se você estiver com pressa de, por exemplo, aumentar seu Ratio de Colateralização para evitar ser liquidado, você pode determinar uma velocidade mais rápida para esta transação.`,
        },

        {
          question: 'Como eu contato o time do Metric Vaults?',
          answer:
            'Se tiver alguma pergunta, nos [contate usando esta página](/stblwallet/contact) ou nos mande uma mensagem no [Twitter](https://twitter.com/).',
        },
      ],
    },
    // {
    //   title: 'Utilizando MONE Wallet',
    //   id: 'using-stblwallet',
    //   questions: [
    //     {
    //       question: 'O que é a MONE Wallet?',
    //       answer: `MONE Wallet é a plataforma ideal para tudo que você deseja realizar com MONE. Uma aplicação descentralizada no blockchain do Meter, MONE Wallet possibilita a compra, envio e gestão do MONE, tudo isso no mesmo lugar!`,
    //     },
    //     {
    //       question: 'O que é MONE?',
    //       answer: `MONE é uma forma melhor e mais inteligente de moeda virtual para todos. É a primeira moeda imparcial do mundo e seu valor é consistentemente atrelado ao dólar americano. Isso significa que ela não sofre com a volatilidade associada a várias outras moedas virtuais. Para conhecer mais sobre MONE, leia nossa [breve introdução.](/stblwallet/stbl).`,
    //     },
    //     {
    //       question: 'Preciso ter uma conta?',
    //       answer: `Não. Você não precisa criar uma nova conta para usar MONE Wallet. Você pode começar com praticamente qualquer carteira do Meter, incluindo Metamask ou Coinbase Wallet. Além disso, você também pode usar o Magic.Link, onde você deve informar seu email e clicar no link de login direto que enviaremos para sua caixa de entrada.`,
    //     },
    //     {
    //       question: 'Serei cobrado pelo uso?',
    //       answer:
    //         'Nossa MONE Wallet é atualmente grátis para uso. Contudo, você terá que pagar taxas da rede Meter e, dependendo das funcionalidades que use, taxas associadas ao MetricOne e outros protocolos, como Taxas de Estabilidade ou de corretoras de cripto.',
    //     },
    //     {
    //       question: 'Porque eu preciso de MTR para enviar ou poupar meu MONE?',
    //       answer: `Para realizar qualquer transação no blockchain do Meter, você precisa pagar a taxa com MTR, a moeda virtual nativa da rede do Meter. Essa taxa é conhecida como 'gás', e de forma semelhante ao que acontece com o combustível que impulsiona seu carro, o gás na rede é necessário para sua transação ser realizada com sucesso. Em breve, nós desejamos adicionar uma funcionalidade que permite pagar as taxas do gás com a própria MONE.`,
    //     },
    //     {
    //       question: 'Como posso contatar o time do Metric Vaults?',
    //       answer:
    //         'Se tiver alguma pergunta, nos mande uma mensagem no [Twitter](https://twitter.com/).',
    //     },
    //   ],
    // },
    {
      title: 'Segurança',
      id: 'security',
      questions: [
        {
          question: 'Metric Vaults é seguro?',
          answer:
            'A segurança é nossa prioridade número um. Nós seguimos rigidamente as melhores práticas de segurança e realizamos de forma constante auditorias em nosso código e contratos inteligentes. Além disso, o código do Metric Vaults é aberto, possibilitando que todos testem e auditem a tecnologia utilizada.',
        },
        {
          question: 'O Metric Vaults pode acessar meus fundos em minha conta ou carteira?',
          answer:
            'Não. Com MONE, você - e apenas você - possui acesso e controle sobre seu MONE. MONE utiliza tecnologia blockchain para prover o nível máximo de confiança e transparência. Em razão dos mecanismos de funcionamento do blockchain, você decide seu próprio nível de segurança. Isso significa que você, em última instância, é responsável por sua própria segurança. Por isso, é muito importante que você mantenha seguro o acesso ao MONE e à conta do Metric Vaults.',
        },
      ],
    },
    {
      title: 'Comprando MONE',
      id: 'buying-stbl',
      questions: [
        {
          question: 'Posso comprar MONE com a MONE Wallet?',
          answer: `Sim! Através de integrações com nossos parceiros, você pode comprar MONE em mais de 100 países, incluindo Europa, Estados Unidos e algumas regiões da América Latina. Nós fizemos parcerias com três empresas registradas - Latamex, Wyre e Moonpay - para facilitar compras de MONE pelos usuários por meio de transferências bancárias ou cartões de crédito e débito. Você deve apenas se conectar no app e clicar em 'Comprar MONE' para escolher os parceiros adequados para você.`,
        },
        {
          question: 'Há limites para compra de MONE?',
          answer:
            'Sim. O limite varia de acordo com o parceiro utilizado e o país em que você se encontra. Para mais detalhes, por favor acesse os links abaixo: [Latamex Limits](https://latamex.zendesk.com/hc/es/articles/360037752631--Cu%C3%A1les-son-los-l%C3%ADmites-de-operaci%C3%B3n-), [Moonpay](https://support.moonpay.io/hc/en-gb/articles/360011931637-What-are-your-purchase-limits-) e [Wyre](https://support.sendwyre.com/en/articles/4457158-card-processing-faqs).',
        },
        {
          question: 'Qual o mínimo para compra?',
          answer: `Assim como o valor máximo permitido, o valor mínimo também depende do parceiro escolhido e da localização. Latamex: Na Argentina, o valor mínimo é ARS2000. No Brasil, é BRL80.00. No Mexico, é MXN270.00 Moonpay: Valor mínimo é 20 MONE Wyre: Valor mínimo é 20 MONE.`,
        },
        {
          question: 'Para onde estão indo essas taxas?',
          answer: `A MONE Wallet não recebe nenhuma taxa quando você compra MONE ou MTR através de nossos parceiros. A taxa é paga única e diretamente para o parceiro.`,
        },
        {
          question: 'Posso comprar MTR na MONE Wallet para pagar minhas taxas?',
          answer:
            'Sim. Para comprar MTR, você pode iniciar o mesmo processo que você usaria para comprar MONE. Escolha o parceiro desejado e altere a moeda desejada para compra no início do processo, de MONE para MTR.',
        },
      ],
    },
  ],
  cantFind: 'Não consegue encontrar o que você está buscando?',
  contactLink: 'Nos contate aqui',
}
