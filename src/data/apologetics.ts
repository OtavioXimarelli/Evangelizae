export interface ApologeticsTract {
  id: string;
  title: string;
  category: "eucharist" | "papacy" | "mary" | "scripture" | "salvation";
  objection: string;
  shortAnswer: string;
  scriptureReferences: { reference: string; text: string }[];
  churchFathers: { author: string; quote: string; date: string }[];
  detailedExplanation: string;
}

export const apologeticsDataPT: ApologeticsTract[] = [
  {
    id: "eucharist-real-presence",
    title: "A Presença Real",
    category: "eucharist",
    objection: "A Eucaristia é apenas um símbolo. Jesus estava falando metaforicamente quando disse 'Isto é o meu corpo'.",
    shortAnswer: "Jesus foi literal. Em João 6, Ele repete que devemos 'comer a sua carne' usando palavras cada vez mais fortes, mesmo quando muitos discípulos o abandonaram por causa desse ensino duro.",
    scriptureReferences: [
      {
        reference: "João 6, 53-55",
        text: "Em verdade, em verdade vos digo: se não comerdes a carne do Filho do Homem e não beberdes o seu sangue, não tereis a vida em vós mesmos."
      },
      {
        reference: "1 Coríntios 11, 27",
        text: "Portanto, todo aquele que comer o pão ou beber o cálice do Senhor indignamente será culpável do corpo e do sangue do Senhor."
      }
    ],
    churchFathers: [
      {
        author: "Santo Inácio de Antioquia",
        quote: "Abstêm-se da Eucaristia e da oração, porque não confessam que a Eucaristia é a carne de nosso Salvador Jesus Cristo...",
        date: "Ano 110 d.C."
      }
    ],
    detailedExplanation: "A crença na Presença Real foi unânime na Igreja primitiva durante 1500 anos. O verbo grego original usado em João 6 (trogo) significa literalmente 'mastigar' ou 'roer', refutando a ideia de que era apenas uma metáfora."
  },
  {
    id: "papacy-peter-rock",
    title: "O Papado e São Pedro",
    category: "papacy",
    objection: "A pedra em Mateus 16 não é Pedro, é a declaração de fé que ele fez. Cristo não fundou uma hierarquia.",
    shortAnswer: "Jesus mudou o nome de Simão para Pedro (Kefas, que significa Pedra). Em aramaico, a língua que Jesus falava, não há distinção entre 'Pedra' e 'pedrinha'. Jesus deu a Pedro as chaves do Reino, um símbolo de autoridade dinástica.",
    scriptureReferences: [
      {
        reference: "Mateus 16, 18-19",
        text: "Tu és Pedro, e sobre esta pedra edificarei a minha Igreja... Eu te darei as chaves do Reino dos Céus."
      },
      {
        reference: "Isaías 22, 22",
        text: "Porei sobre seus ombros a chave da casa de Davi; ele abrirá, e ninguém fechará; fechará, e ninguém abrirá."
      }
    ],
    churchFathers: [
      {
        author: "São Cipriano de Cartago",
        quote: "Sobre ele [Pedro] Ele constrói a Igreja, e a ele confia as ovelhas para serem apascentadas.",
        date: "Ano 251 d.C."
      }
    ],
    detailedExplanation: "A entrega das 'Chaves' remete diretamente a Isaías 22, onde o mordomo do Rei (o Almezar) recebe a autoridade para governar na ausência do Rei. O Papa é o mordomo (Vigário) de Cristo."
  }
];

export const apologeticsDataEN: ApologeticsTract[] = [
  {
    id: "eucharist-real-presence",
    title: "The Real Presence",
    category: "eucharist",
    objection: "The Eucharist is just a symbol. Jesus was speaking metaphorically when He said 'This is my body'.",
    shortAnswer: "Jesus was literal. In John 6, He repeats that we must 'eat his flesh' using increasingly stronger words, even letting disciples walk away because of this hard teaching.",
    scriptureReferences: [
      {
        reference: "John 6:53-55",
        text: "Amen, amen, I say to you, unless you eat the flesh of the Son of Man and drink his blood, you do not have life within you."
      },
      {
        reference: "1 Corinthians 11:27",
        text: "Therefore whoever eats the bread or drinks the cup of the Lord unworthily will have to answer for the body and blood of the Lord."
      }
    ],
    churchFathers: [
      {
        author: "St. Ignatius of Antioch",
        quote: "They abstain from the Eucharist and from prayer, because they confess not the Eucharist to be the flesh of our Saviour Jesus Christ...",
        date: "110 A.D."
      }
    ],
    detailedExplanation: "Belief in the Real Presence was unanimous in the early Church for 1500 years. The original Greek verb used in John 6 (trogo) literally means 'to gnaw' or 'chew', refuting the idea that it was merely a metaphor."
  },
  {
    id: "papacy-peter-rock",
    title: "The Papacy and St. Peter",
    category: "papacy",
    objection: "The rock in Matthew 16 is not Peter, it's his declaration of faith. Christ didn't found a hierarchy.",
    shortAnswer: "Jesus changed Simon's name to Peter (Kephas, meaning Rock). In Aramaic, the language Jesus spoke, there is no distinction between 'Rock' and 'little stone'. Jesus gave Peter the keys to the Kingdom, a symbol of dynastic authority.",
    scriptureReferences: [
      {
        reference: "Matthew 16:18-19",
        text: "You are Peter, and upon this rock I will build my church... I will give you the keys to the kingdom of heaven."
      },
      {
        reference: "Isaiah 22:22",
        text: "I will place the key of the House of David on his shoulder; when he opens, no one shall shut, when he shuts, no one shall open."
      }
    ],
    churchFathers: [
      {
        author: "St. Cyprian of Carthage",
        quote: "Upon him [Peter], being one, He builds His Church, and commits His sheep to be fed.",
        date: "251 A.D."
      }
    ],
    detailedExplanation: "The giving of the 'Keys' refers directly to Isaiah 22, where the King's steward (the Almezar) receives the authority to govern in the King's absence. The Pope is the steward (Vicar) of Christ."
  }
];

export async function getApologeticsData(locale: string = "pt"): Promise<ApologeticsTract[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return locale === "pt" ? apologeticsDataPT : apologeticsDataEN;
}
