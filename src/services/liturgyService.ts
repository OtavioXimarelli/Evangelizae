import { getLocale } from "next-intl/server";

export interface DailyLiturgy {
  date: string;
  color: "green" | "purple" | "white" | "red" | "rose";
  firstReading: {
    reference: string;
    text: string;
  };
  psalm: {
    reference: string;
    response: string;
    text: string[];
  };
  gospel: {
    reference: string;
    text: string;
  };
  reflection: {
    author: string;
    text: string;
  };
}

const mockLiturgyPT: DailyLiturgy = {
  date: new Date().toISOString().split("T")[0],
  color: "green",
  firstReading: {
    reference: "Romanos 12, 1-2",
    text: "Eu vos exorto, pois, irmãos, pelas misericórdias de Deus, a oferecerdes vossos corpos em sacrifício vivo, santo, agradável a Deus: é este o vosso culto espiritual. Não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso espírito, para que possais discernir qual é a vontade de Deus, o que é bom, o que lhe agrada e o que é perfeito.",
  },
  psalm: {
    reference: "Salmo 1",
    response: "Feliz é o homem que na lei do Senhor Deus põe seu encanto!",
    text: [
      "Feliz é todo aquele que não anda\nconforme os conselhos dos perversos;",
      "que não entra no caminho dos malvados,\nnem junto aos zombadores vai sentar-se;",
      "mas encontra seu prazer na lei de Deus\ne a medita, dia e noite, sem cessar.",
    ],
  },
  gospel: {
    reference: "Mateus 5, 13-16",
    text: "Naquele tempo, disse Jesus a seus discípulos: 'Vós sois o sal da terra. Ora, se o sal se tornar insosso, com que salgaremos? Ele não servirá para mais nada, senão para ser jogado fora e ser pisado pelos homens. Vós sois a luz do mundo. Não pode ficar escondida uma cidade construída sobre um monte. Ninguém acende uma lâmpada e a coloca debaixo de uma vasilha, mas sim, num candelabro, onde brilha para todos os que estão na casa. Assim também brilhe a vossa luz diante dos homens, para que vejam as vossas boas obras e louvem o vosso Pai que está nos céus'.",
  },
  reflection: {
    author: "São João Crisóstomo",
    text: "Aquele que é o sal da terra e a luz do mundo não vive para si mesmo, mas para aqueles a quem deve iluminar e preservar da corrupção. A fé sem obras é morta; portanto, que a vossa vida seja o testemunho mais eloquente do Evangelho.",
  },
};

const mockLiturgyEN: DailyLiturgy = {
  date: new Date().toISOString().split("T")[0],
  color: "green",
  firstReading: {
    reference: "Romans 12:1-2",
    text: "I urge you therefore, brothers, by the mercies of God, to offer your bodies as a living sacrifice, holy and pleasing to God, your spiritual worship. Do not conform yourselves to this age but be transformed by the renewal of your mind, that you may discern what is the will of God, what is good and pleasing and perfect.",
  },
  psalm: {
    reference: "Psalm 1",
    response: "Blessed are they who hope in the Lord.",
    text: [
      "Blessed the man who follows not\nthe counsel of the wicked",
      "Nor walks in the way of sinners,\nnor sits in the company of the insolent,",
      "But delights in the law of the LORD\nand meditates on his law day and night.",
    ],
  },
  gospel: {
    reference: "Matthew 5:13-16",
    text: "Jesus said to his disciples: 'You are the salt of the earth. But if salt loses its taste, with what can it be seasoned? It is no longer good for anything but to be thrown out and trampled underfoot. You are the light of the world. A city set on a mountain cannot be hidden. Nor do they light a lamp and then put it under a bushel basket; it is set on a lampstand, where it gives light to all in the house. Just so, your light must shine before others, that they may see your good deeds and glorify your heavenly Father.'",
  },
  reflection: {
    author: "St. John Chrysostom",
    text: "He who is the salt of the earth and the light of the world does not live for himself, but for those whom he must illuminate and preserve from corruption. Faith without works is dead; therefore, let your life be the most eloquent testimony of the Gospel.",
  },
};

export async function getDailyLiturgy(): Promise<DailyLiturgy> {
  const locale = await getLocale();
  // Simulate network delay for realistic MVP feel
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  return locale === "pt" ? mockLiturgyPT : mockLiturgyEN;
}
