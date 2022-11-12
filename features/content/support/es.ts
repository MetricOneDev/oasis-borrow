import { ContentTypeSupport } from './support'

export const content: ContentTypeSupport = {
  title: 'FAQ',
  navigation: [
    { title: 'Usar vaults.metric.one', id: 'using-oasis' },
    { title: 'Usar MONE Wallet', id: 'using-stblwallet' },
    { title: 'Seguridad', id: 'security' },
    { title: 'Comprar MONE', id: 'buying-stbl' },
  ],
  sections: [
    {
      title: 'Usar vaults.metric.one',
      id: 'using-oasis',
      questions: [
        {
          question: '¿Qué activos puedo utilizar como colateral?',
          answer: `Puedes utilizar muchos tipos diferentes de colateral incluyendo MTR y WBTC. Los colaterales son incorporados por el gobierno de MetricOne en el protocolo. Puedes ver cada uno visitando vaults.metric.one con su correspondiente tasa de estabilidad y su ratio de colateralización mínimo.`,
        },
        {
          question: '¿Cuanto cuesta?',
          answer: `Abrir y administrar un Vault es gratis en vaults.metric.one. Pagarás el gas para las transacciones y la tasa de estabilidad. La tasa de estabilidad es cobrada sobre el MONE que has generado y va directamente al protocolo MetricOne.`,
        },
        {
          question: '¿Cómo abro un Vault? ',
          answer: `Para abrir un Vault, selecciona el colateral y el subtipo (ej. MTR-A) en la página principal (vaults.metric.one), conecta tu cartera preferida y sigue las instrucciones que te guiarán en el proceso.`,
        },
        {
          question: '¿Qué es la tasa de estabilidad?',
          answer: `La tasa de estabilidad es la tasa variable anual (mostrada como porcentaje) que es añadida a tu deuda y deberás pagar. Esto puede ser visto como el costo para generar MONE, que es pagado directamente al protocolo MetricOne.`,
        },
        {
          question: '¿Cuál es la diferencia entre los Vaults de colateral -A/-B/-C?',
          answer: `Hay múltiples tipos de Vault para algunos colaterales. Cada tipo, indicado por una letra tiene su propio ratio de colateralización y tasa de estabilidad.. Puedes elegir cualquier tipo de Vault que quieras de acuerdo a tus necesidades y perfil de riesgo.`,
        },
        {
          question: '¿Qué es un Proxy? ¿Por qué necesito generar uno?',
          answer: `Un Proxy es un contrato inteligente que te permite interactuar fácilmente con protocolos soportados, incluyendo el protocolo MetricOne, para manejar tus Vaults, generar MONE, etc. Necesitarás hacer esto una sola vez por cartera y todos tus Vaults serán manejados por este único Proxy. Por favor nunca envíes fondos a la dirección del Proxy.`,
        },
        {
          question: '¿Por qué necesito aprobar los tokens? ¿Qué es el permiso?',
          answer: `Los permisos de los tokens te permiten controlar cuánto puede utilizar el contrato Proxy en relación al saldo de tu cartera. Para permitir al contrato Proxy pagar tu deuda o interactuar con los colaterales en tu cartera necesitarás autorizarlo configurando un permiso hasta el monto que quieras utilizar en cada ocasión. También puedes configurar un permiso más elevado para futuras interacciones con vaults.metric.one. Todo esto lo verás de modo interactivo al utilizar vaults.metric.one y no deberás tomar ninguna acción extra en caso de que no veas indicaciones al respecto.`,
        },
        {
          question: '¿Qué es el ratio de liquidación?',
          answer: `El ratio de liquidación es el ratio mínimo de colateralización sobre el cual debes mantener tu Vault con el fin de que no esté en riesgo de ser liquidado. Si tu Vault cae por debajo de este ratio mínimo de colateralización, tu Vault podría ser liquidado y tu colateral vendido para cubrir tu deuda.`,
        },
        {
          question: '¿Qué es el precio de liquidación?',
          answer: `El precio de liquidación es el precio en el cual tu Vault estará en riesgo de liquidación basado en el “Precio Actual” del Módulo de Seguridad del Oráculo del protocolo MetricOne. Es un útil indicador que te permite saber cuándo podrías ser liquidado. Por favor ten en cuenta que  si tu Vault tiene una tasa de estabilidad positiva (esto es >0) entonces tu precio de liquidación aumentará constantemente a medida que más deuda es añadida a tu Vault.`,
        },
        {
          question: '¿Qué es la penalidad por liquidación?',
          answer: `La penalidad por liquidación es el monto añadido a tu deuda una vez que tu Vault es liquidado. Cada colateral y subtipo (e.j. MTR-A y MTR-B) puede tener su propia penalidad por liquidación configurada por el gobierno de MetricOne. Esta penalidad es pagada directamente al protocolo MetricOne y vaults.metric.one no cobra ninguna tarifa adicional por ser liquidado.`,
        },
        {
          question: '¿Qué es la deuda mínima del Vault?',
          answer: `La deuda mínima del Vault, también llamada Dust, es el monto mínimo de MONE que debes generar y mantener para abrir un Vault. Este monto mínimo de deuda del Vault es configurado por el gobierno de MetricOne y puede ser ajustado en cualquier momento. Si el mínimo es elevado a un valor por encima de tu deuda actual, verás la funcionalidad de tu Vault reducida hasta que incrementes la deuda por arriba del mínimo nuevamente.`,
        },
        {
          question: '¿Qué es el próximo precio y cómo lo sabes?',
          answer: `Dentro del protocolo MetricOne existen siempre dos precios para el colateral. El precio actual y el próximo precio. Para proteger al sistema y los usuarios de “actores maliciosos” y flash crashes, el protocolo MetricOne utilizar un “Módulo de Seguridad del Oráculo”. Esto significa que todos los precios que se introducen en el sistema son demorados durante una hora y actualizados únicamente una vez por hora, aproximadamente en la hora. El próximo precio es el precio que se incorporará en el sistema como el “Precio actual”. Es el Precio actual contra el cual se mide tu Vault, por lo que sólo puedes ser liquidado una vez que el Precio actual se encuentre por debajo de tu Precio de liquidación. Esto significa que tienen hasta una hora para reaccionar en caso de que haya una gran caída en el precio y el próximo precio esté por debajo de tu precio de liquidación.`,
        },
        {
          question: 'Qué es el gas? ',
          answer: `El gas es la unidad de medidas para pagar por las transacciones en la blockchain de Meter. Los precios del Gas se cobran en MTR y siempre necesitarás tener MTR en tu cartera para poder interactuar con vaults.metric.one. Esta tarifa de gas va directamente a los mineros de Meter que mantienen Meter corriendo. vaults.metric.one no cobra ninguna tarifa por el manejo básico de los Vaults.`,
        },
        {
          question: '¿Por qué cambiaría la velocidad de la transacción?',
          answer: `La velocidad de la transacción te permite pagar más gas para que tu transacción sea minada más rápidamente. En caso de que estés apurado, por ejemplo para incrementar tu ratio de colateralización para evitar la liquidación, puedes seleccionar velocidad rápida para tus transacciones.`,
        },
        {
          question: '¿Cómo puedo contactar al equipo de MetricOne?',
          answer:
            'Si tienes preguntas, puedes comunicarte con nosotros a través de la [página de contacto](/stblwallet/contact) o en [Twitter](https://twitter.com/MetricOne).',
        },
      ],
    },
    {
      title: 'Usando MONE Wallet',
      id: 'using-stblwallet',
      questions: [
        {
          question: '¿Qué es MONE Wallet?',
          answer:
            'MONE Wallet es el sitio para todo lo que quieras lograr con MONE. Una aplicación descentralizada que corre sobre la blockchain de Meter, MetricOne MONE Wallet te permite comprar, enviar y administrar tu MONE, todo en un único lugar.',
        },
        {
          question: '¿Qué es MONE?',
          answer:
            'MONE es una moneda digital mejor y más inteligente, disponible para todos. Es la primera moneda imparcial del mundo cuyo valor sigue consistentemente el dólar estadounidense, esto significa que no sufre de la volatilidad asociada a muchas otras monedas digitales. Para conocer más sobre MONE, lee nuestra [breve introducción.](/stblwallet/stbl).',
        },
        {
          question: '¿Necesito crear una cuenta?',
          answer:
            'No. No necesitas creas una cuenta nueva para usar vaults.metric.one Puedes comenzar con casi cualquier cartera de Meter como Metamask o Coinbase Wallet. También puedes utilizar la funcionalidad de Magic.link, con la cual ingresas una dirección de email, y con un solo click en el link que enviaremos a tu bandeja de entrada ya puedes ingresar.',
        },
        {
          question: '¿MetricOne cobra comisión por su uso?',
          answer:
            'MONE Wallet es gratis actualmente. Sin embargo, tendrás que pagar los costos de las transacciones y dependiendo las funcionalidades que utilices, tendrás que pagar las comisiones asociadas con MetricOne y otros protocolos, tales cómo la tasa de estabilidad o bien las comisiones de los servicios de cambio de criptomonedas.',
        },
        {
          question: '¿Por qué necesito MTR para enviar o ahorrar mi MONE?',
          answer:
            'Para completar cualquier transacción en la blockchain de Meter, necesitas pagar una tarifa de transacción utilizando MTR, la criptomoneda por defecto de la red. Está tarifa se conoce como "gas", y es similar al combustible que da energía a tu automóvil, el gas impulsa tu transacción.',
        },
        {
          question: '¿Cómo puedo contactar al equipo de MetricOne?',
          answer:
            'Si tienes alguna pregunta contáctanos a través de nuestra [página de contacto](/stblwallet/contact) o en [Twitter](https://twitter.com/MetricOne).',
        },
      ],
    },
    {
      title: 'Seguridad',
      id: 'security',
      questions: [
        {
          question: '¿Es MetricOne seguro?',
          answer:
            'La seguridad es nuestra prioridad número uno. Seguimos las mejores prácticas de seguridad estrictamente y regularmente realizamos auditorias de nuestro código y los contratos inteligentes. Además, MetricOne es de código abierto, de este modo, todos en la comunidad tienen la posibilidad de auditar la tecnología empleada.',
        },
        {
          question: '¿Puede MetricOne acceder a los fondos en mi cuenta o cartera?',
          answer:
            'No. Con MONE, tu y solo tu, puedes acceder y controlar tus fondos. MONE usa tecnología de blockchain para asegurar el mayor nivel de confianza y transparencia. Por la forma en funciona la tecnología de blockchain, tú decides sobre el nivel de seguridad de tus fondos. Esto significa que eres tu propia seguridad en última instancia y es muy importante que mantengas el acceso a tu MONE y cuenta de MetricOne seguros.',
        },
      ],
    },
    {
      title: 'Buying MONE',
      id: 'buying-stbl',
      questions: [
        {
          question: 'Where can I buy MONE?',
          answer: `You can buy MONE at [wagyuswap](https://www.wagyuswap.app/)`,
        },
      ],
    },
  ],
  cantFind: '¿No puedes encontrar lo que estás buscando?',
  contactLink: 'Contactanos aquí.',
}
