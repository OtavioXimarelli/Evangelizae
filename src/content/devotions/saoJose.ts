// Source: Milícia da Imaculada — "Como rezar o Terço de São José"
// https://www.miliciadaimaculada.org.br/espiritualidade/sao-jose/terco-de-sao-jose
// (accessed 2026-11-12). Traditional rosary-structured chaplet (5 decades).
// Pastoral review required before release.

export const SAO_JOSE_SOURCE = {
  provider: 'Milícia da Imaculada',
  fetchedAt: '2026-11-12',
  url: 'https://www.miliciadaimaculada.org.br/espiritualidade/sao-jose/terco-de-sao-jose',
} as const;

export const SAO_JOSE_SMALL_BEAD = 'São José, valei-me!';
export const SAO_JOSE_LARGE_BEAD = 'Meu glorioso São José, nas vossas maiores aflições e tribulações, não vos valeu o anjo do Senhor? Valei-me, São José!';

export const SAO_JOSE_OFFERING =
  'Oferecemos esse terço em louvor e glória de Jesus, Maria e José, para que sejam a nossa luz, guia, proteção, defesa, amparo e fortaleza em nossa vida, em todos os nossos trabalhos, alegrias, agonias e tribulações. Pelo Nome de Jesus e pela glória de Maria, imploramos de Vós, glorioso São José que alcanceis a graça que desejamos. Advogai a nossa causa, falai em nosso favor, no céu e na terra, alegrai a nossa alma, para honra e glória de Jesus e Maria. Amém!';

export const SAO_JOSE_CROSS =
  'Pelo sinal da Santa Cruz, livrai-nos, Deus, Nosso Senhor, dos nossos inimigos. Em nome do Pai e do Filho e do Espírito Santo. Amém.';

export const SAO_JOSE_CREED =
  'Creio em Deus-Pai, todo poderoso, Criador do céu e da Terra. E em Jesus Cristo seu único filho, Nosso Senhor. Que foi concebido pelo poder do Espírito Santo. Nasceu da Virgem Maria. Padeceu sob Pôncio Pilatos. Foi crucificado, morto e sepultado. Desceu à mansão dos mortos. Ressuscitou ao terceiro dia, subiu aos céus. Está sentado à direita de Deus Pai, todo poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém!';

export const SAO_JOSE_OREMOS =
  'Ó Deus, que por inefável providência Vos dignastes escolher a São José por esposo de vossa Mãe Santíssima; concedei-nos, Vo-lo pedimos, que mereçamos ter por intercessor no Céu, aquele que veneramos na Terra como protetor. Vós que viveis e reinais por todos os séculos dos séculos. Amém!';

export const SAO_JOSE_CLOSING_PRAISE = 'Louvado seja Nosso Senhor Jesus Cristo! Para sempre seja louvado!';

export interface SaoJoseContemplation {
  number: number;
  namePt: string;
  nameEn: string;
  scripturePt: string;
  scriptureEn: string;
}

export const SAO_JOSE_CONTEMPLATIONS: SaoJoseContemplation[] = [
  {
    number: 1,
    namePt: 'O anjo do Senhor aparece a José',
    nameEn: 'The angel of the Lord appears to Joseph',
    scripturePt: 'José, que era homem de bem, não queria difamar Maria e resolveu rejeitá-la secretamente. Enquanto estava pensando nisso, eis que um anjo do Senhor apareceu a ele num sonho e disse: — José, descendente de Davi, não tema receber Maria como sua esposa, pois o que nela foi concebido vem do Espírito Santo. Ela dará à luz a um filho, a quem porá o nome de Jesus, pois ele salvará o seu povo de seus pecados. (Mt 1, 19-21)',
    scriptureEn: 'Joseph, being a just man and unwilling to put her to shame, resolved to divorce her quietly. But as he considered this, behold, an angel of the Lord appeared to him in a dream, saying, "Joseph, son of David, do not fear to take Mary as your wife, for that which is conceived in her is of the Holy Spirit. She will bear a son, and you shall call his name Jesus, for he will save his people from their sins." (Mt 1:19-21)',
  },
  {
    number: 2,
    namePt: 'José recebe Maria e Jesus nasce',
    nameEn: 'Joseph receives Mary and Jesus is born',
    scripturePt: 'Despertando, José fez como o anjo do Senhor lhe havia mandado e recebeu Maria em sua casa como esposa. E sem que ela o tivesse conhecido, ela deu à luz ao seu filho que recebeu o nome de Jesus. (Mt 1, 24-25)',
    scriptureEn: 'When Joseph woke from sleep, he did as the angel of the Lord commanded him: he took his wife, but knew her not until she had given birth to a son; and he called his name Jesus. (Mt 1:24-25)',
  },
  {
    number: 3,
    namePt: 'A fuga para o Egito',
    nameEn: 'The flight into Egypt',
    scripturePt: 'Depois da partida dos sábios, um anjo do Senhor apareceu a José em sonho e lhe disse: — Levante-se! Pegue o menino e a mãe dele e fuja para o Egito. Fique lá até eu lhe avise, porque Herodes vai procurar o menino para matá-lo. José se levantou, pegou o menino e sua mãe e partiu para o Egito durante a noite. (Mt 2, 13-14)',
    scriptureEn: 'When they had departed, behold, an angel of the Lord appeared to Joseph in a dream and said, "Rise, take the child and his mother, and flee to Egypt, and remain there till I tell you; for Herod is about to search for the child, to destroy him." And he rose and took the child and his mother by night, and departed to Egypt. (Mt 2:13-14)',
  },
  {
    number: 4,
    namePt: 'O retorno do Egito',
    nameEn: 'The return from Egypt',
    scripturePt: 'Com a morte de Herodes, o anjo do Senhor apareceu em sonho a José, no Egito e disse: — Levanta-te, pega o menino e sua mãe e retorna à terra de Israel, porque morreram os que atentavam contra a vida do menino. (Mt 2, 19-20)',
    scriptureEn: 'When Herod died, behold, an angel of the Lord appeared in a dream to Joseph in Egypt, saying, "Rise, take the child and his mother, and go to the land of Israel, for those who sought the child\'s life are dead." (Mt 2:19-20)',
  },
  {
    number: 5,
    namePt: 'A morada em Nazaré',
    nameEn: 'Dwelling in Nazareth',
    scripturePt: 'José ficou com medo de voltar para a Judeia, pois quem reinava na época era Arquelau, filho de Herodes. Então, ele partiu para a região da Galileia e foi habitar na cidade de Nazaré, para que se cumprisse o que foi dito pelos profetas: — Será chamado Nazareno. (Mt 2, 22-23)',
    scriptureEn: 'But when he heard that Archelaus reigned over Judea in place of his father Herod, he was afraid to go there, and being warned in a dream he withdrew to the district of Galilee. And he went and dwelt in a city called Nazareth. (Mt 2:22-23)',
  },
];
