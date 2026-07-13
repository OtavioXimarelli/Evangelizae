export type MysteryType = 'gozosos' | 'luminosos' | 'dolorosos' | 'gloriosos';

export interface DecadeMystery {
  decadeNumber: number;
  namePt: string;
  nameEn: string;
  scripturePt: string;
  scriptureEn: string;
  fruitPt: string;
  fruitEn: string;
}

export interface RosaryMysteryGroup {
  type: MysteryType;
  titlePt: string;
  titleEn: string;
  daysPt: string;
  daysEn: string;
  decades: DecadeMystery[];
}

export type PrayerStepType = 
  | 'sign_of_cross' 
  | 'creed' 
  | 'our_father_pope' 
  | 'three_hail_marys' 
  | 'glory_be_fatima' 
  | 'mystery_intro' 
  | 'decade_our_father' 
  | 'decade_hail_mary' 
  | 'decade_glory_fatima' 
  | 'salve_regina';

export interface RosaryStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  type: PrayerStepType;
  titlePt: string;
  titleEn: string;
  prayerTextPt: string;
  prayerTextEn: string;
  latinText?: string;
  decadeNumber?: number;
  beadInDecade?: number; // 1 to 10
  mystery?: DecadeMystery;
}

export const ROSARY_MYSTERIES: Record<MysteryType, RosaryMysteryGroup> = {
  gozosos: {
    type: 'gozosos',
    titlePt: 'Mistérios Gozosos (A Encarnação)',
    titleEn: 'Joyful Mysteries (The Incarnation)',
    daysPt: 'Segunda-feira e Sábado',
    daysEn: 'Monday & Saturday',
    decades: [
      {
        decadeNumber: 1,
        namePt: 'A Anunciação do Anjo a Nossa Senhora',
        nameEn: 'The Annunciation of the Angel to Mary',
        scripturePt: 'E o Anjo disse-lhe: "Não temas, Maria, pois encontraste graça diante de Deus. Eis que conceberás e darás à luz um filho..." (Lc 1, 30-31)',
        scriptureEn: 'And the angel said to her, "Do not be afraid, Mary, for you have found favor with God..." (Lk 1:30-31)',
        fruitPt: 'A Humildade cristã',
        fruitEn: 'Christian Humility'
      },
      {
        decadeNumber: 2,
        namePt: 'A Visitação de Nossa Senhora a Santa Isabel',
        nameEn: 'The Visitation of Mary to St. Elizabeth',
        scripturePt: 'E aconteceu que, apenas Isabel ouviu a saudação de Maria, a criança exultou no seu seio... (Lc 1, 41)',
        scriptureEn: 'And when Elizabeth heard the greeting of Mary, the baby leaped in her womb... (Lk 1:41)',
        fruitPt: 'A Caridade para com o próximo',
        fruitEn: 'Fraternal Charity'
      },
      {
        decadeNumber: 3,
        namePt: 'O Nascimento de Nosso Senhor Jesus Cristo em Belém',
        nameEn: 'The Nativity of Our Lord Jesus Christ',
        scripturePt: 'E deu à luz o seu filho primogênito, envolveu-o em panos e deitou-o numa manjedoura... (Lc 2, 7)',
        scriptureEn: 'And she gave birth to her firstborn son and wrapped him in swaddling cloths and laid him in a manger... (Lk 2:7)',
        fruitPt: 'O Desapego das coisas do mundo',
        fruitEn: 'Detachment from worldly things'
      },
      {
        decadeNumber: 4,
        namePt: 'A Apresentação do Menino Jesus no Templo',
        nameEn: 'The Presentation of the Child Jesus in the Temple',
        scripturePt: 'E Simeão abençoou-os e disse a Maria: "Uma espada de dor trespassará a tua alma..." (Lc 2, 34-35)',
        scriptureEn: 'And Simeon blessed them and said to Mary his mother: "A sword will pierce through your own soul also..." (Lk 2:34-35)',
        fruitPt: 'A Obediência e Pureza',
        fruitEn: 'Obedience and Purity of Heart'
      },
      {
        decadeNumber: 5,
        namePt: 'O Encontro do Menino Jesus no Templo entre os Doutores',
        nameEn: 'The Finding of the Child Jesus in the Temple',
        scripturePt: 'E decorridos três dias, encontraram-no no Templo, sentado no meio dos doutores... (Lc 2, 46)',
        scriptureEn: 'After three days they found him in the temple, sitting among the teachers... (Lk 2:46)',
        fruitPt: 'O Fervor na busca de Deus',
        fruitEn: 'Fervor in seeking God'
      }
    ]
  },
  luminosos: {
    type: 'luminosos',
    titlePt: 'Mistérios Luminosos (A Vida Pública de Jesus)',
    titleEn: 'Luminous Mysteries (The Public Life of Jesus)',
    daysPt: 'Quinta-feira',
    daysEn: 'Thursday',
    decades: [
      {
        decadeNumber: 1,
        namePt: 'O Batismo de Jesus no Rio Jordão',
        nameEn: 'The Baptism of Jesus in the River Jordan',
        scripturePt: 'E abriu-se o céu e ouviu-se uma voz: "Este é o meu Filho amado, em quem me comprazo." (Mt 3, 17)',
        scriptureEn: 'And behold, a voice from heaven said, "This is my beloved Son, with whom I am well pleased." (Mt 3:17)',
        fruitPt: 'A Fidelidade às promessas do Batismo',
        fruitEn: 'Fidelity to Baptismal promises'
      },
      {
        decadeNumber: 2,
        namePt: 'A Auto-revelação nas Bodas de Caná',
        nameEn: 'The Wedding at Cana',
        scripturePt: 'Sua Mãe disse aos serventes: "Fazei tudo o que Ele vos disser." (Jo 2, 5)',
        scriptureEn: 'His mother said to the servants, "Do whatever he tells you." (Jn 2:5)',
        fruitPt: 'A Confiança filial na intercessão de Maria',
        fruitEn: 'Filial trust in Mary’s intercession'
      },
      {
        decadeNumber: 3,
        namePt: 'O Anúncio do Reino de Deus e o Convite à Conversão',
        nameEn: 'The Proclamation of the Kingdom and Call to Conversion',
        scripturePt: '"O tempo está cumprido e o Reino de Deus está próximo. Arrependei-vos e crede no Evangelho." (Mc 1, 15)',
        scriptureEn: '"The time is fulfilled, and the kingdom of God is at hand; repent and believe in the gospel." (Mk 1:15)',
        fruitPt: 'O Arrepndimento e Confissão dos pecados',
        fruitEn: 'Sincere Repentance and Conversion'
      },
      {
        decadeNumber: 4,
        namePt: 'A Transfiguração de Jesus no Monte Tabor',
        nameEn: 'The Transfiguration on Mount Tabor',
        scripturePt: 'E transfigurou-se diante deles; o seu rosto resplandeceu como o sol e as suas vestes tornaram-se brancas... (Mt 17, 2)',
        scriptureEn: 'And he was transfigured before them, and his face shone like the sun... (Mt 17:2)',
        fruitPt: 'O Desejo da santidade e contemplação',
        fruitEn: 'Desire for holiness and divine light'
      },
      {
        decadeNumber: 5,
        namePt: 'A Instituição da Santíssima Eucaristia na Última Ceia',
        nameEn: 'The Institution of the Holy Eucharist',
        scripturePt: '"Tomai e comei, isto é o meu Corpo... Tomai e bebei, isto é o meu Sangue da Nova Aliança." (Mt 26, 26-28)',
        scriptureEn: '"Take, eat; this is my body... Drink of it, all of you, for this is my blood of the covenant..." (Mt 26:26-28)',
        fruitPt: 'A Adoração e Fervor Eucarístico',
        fruitEn: 'Eucharistic Adoration and Devotion'
      }
    ]
  },
  dolorosos: {
    type: 'dolorosos',
    titlePt: 'Mistérios Dolorosos (A Paixão de Nosso Senhor)',
    titleEn: 'Sorrowful Mysteries (The Passion of Christ)',
    daysPt: 'Terça-feira e Sexta-feira',
    daysEn: 'Tuesday & Friday',
    decades: [
      {
        decadeNumber: 1,
        namePt: 'A Agonia de Jesus no Jardim das Oliveiras',
        nameEn: 'The Agony of Jesus in the Garden of Gethsemane',
        scripturePt: 'E, posto em agonia, orava mais intensamente. E o seu suor tornou-se como gotas de sangue... (Lc 22, 44)',
        scriptureEn: 'And being in agony he prayed more earnestly; and his sweat became like great drops of blood... (Lk 22:44)',
        fruitPt: 'O Contrição pelos nossos pecados',
        fruitEn: 'Sorrow for sin and conformity to God’s will'
      },
      {
        decadeNumber: 2,
        namePt: 'A Flagelação de Nosso Senhor atado à Coluna',
        nameEn: 'The Scourging at the Pillar',
        scripturePt: 'Então Pilatos tomou a Jesus e mandou flagelá-lo. (Jo 19, 1)',
        scriptureEn: 'Then Pilate took Jesus and flogged him. (Jn 19:1)',
        fruitPt: 'A Mortificação dos sentidos e pureza corporal',
        fruitEn: 'Mortification of the flesh and purity'
      },
      {
        decadeNumber: 3,
        namePt: 'A Coroação de Espinhos de Nosso Senhor',
        nameEn: 'The Crowning with Thorns',
        scripturePt: 'E os soldados, tecendo uma coroa de espinhos, puseram-lha na cabeça e vestiram-no com um manto de púrpura... (Jo 19, 2)',
        scriptureEn: 'And the soldiers twisted together a crown of thorns and put it on his head... (Jn 19:2)',
        fruitPt: 'O Desprezo pelas honras mundanas e soberba',
        fruitEn: 'Moral courage and humility'
      },
      {
        decadeNumber: 4,
        namePt: 'Jesus carrega a Cruz a caminho do Calvário',
        nameEn: 'The Carrying of the Cross to Calvary',
        scripturePt: 'E, levando a sua cruz, Jesus saiu para o lugar chamado Calvário... (Jo 19, 17)',
        scriptureEn: 'And he went out, bearing his own cross, to the place called the place of a skull... (Jn 19:17)',
        fruitPt: 'A Paciência nas tribulações e cruzes diárias',
        fruitEn: 'Patience in enduring trials'
      },
      {
        decadeNumber: 5,
        namePt: 'A Crucificação e Morte de Nosso Senhor Jesus Cristo',
        nameEn: 'The Crucifixion and Death of Our Lord Jesus Christ',
        scripturePt: 'Jesus deu um grande brado e disse: "Pai, nas tuas mãos entrego o meu espírito." E, dizendo isto, expirou. (Lc 23, 46)',
        scriptureEn: 'Then Jesus, calling out with a loud voice, said, "Father, into your hands I commit my spirit!" And having said this he breathed his last. (Lk 23:46)',
        fruitPt: 'O Amor a Deus e salvação das almas',
        fruitEn: 'Self-sacrificing love and perseverance'
      }
    ]
  },
  gloriosos: {
    type: 'gloriosos',
    titlePt: 'Mistérios Gloriosos (A Ressurreição e Glória)',
    titleEn: 'Glorious Mysteries (The Resurrection and Glory)',
    daysPt: 'Domingo e Quarta-feira',
    daysEn: 'Sunday & Wednesday',
    decades: [
      {
        decadeNumber: 1,
        namePt: 'A Triunfante Ressurreição de Jesus Cristo',
        nameEn: 'The Resurrection of Jesus Christ',
        scripturePt: 'O Anjo disse às mulheres: "Não temais! Sei que buscais Jesus, que foi crucificado. Ele não está aqui, ressuscitou, como disse!" (Mt 28, 5-6)',
        scriptureEn: 'But the angel said to the women, "Do not be afraid... He is not here, for he has risen, as he said." (Mt 28:5-6)',
        fruitPt: 'A Virtude teologal da Fé viva',
        fruitEn: 'The Theological Virtue of Faith'
      },
      {
        decadeNumber: 2,
        namePt: 'A Ascensão de Nosso Senhor ao Céu',
        nameEn: 'The Ascension of Our Lord into Heaven',
        scripturePt: 'E o Senhor Jesus, depois de lhes ter falado, elevou-se ao céu e sentou-se à direita de Deus. (Mc 16, 19)',
        scriptureEn: 'So then the Lord Jesus, after he had spoken to them, was taken up into heaven and sat down at the right hand of God. (Mk 16:19)',
        fruitPt: 'A Virtude teologal da Esperança e desejo do Céu',
        fruitEn: 'The Theological Virtue of Hope and longing for Heaven'
      },
      {
        decadeNumber: 3,
        namePt: 'A Vinda do Espírito Santo sobre os Apóstolos no Pentecostes',
        nameEn: 'The Descent of the Holy Spirit at Pentecost',
        scripturePt: 'E todos ficaram cheios do Espírito Santo e começaram a falar em outras línguas... (At 2, 4)',
        scriptureEn: 'And they were all filled with the Holy Spirit and began to speak in other tongues... (Acts 2:4)',
        fruitPt: 'O Amor divino e o zelo missionário pela Santa Igreja',
        fruitEn: 'Holy Wisdom and Missionary Zeal'
      },
      {
        decadeNumber: 4,
        namePt: 'A Assunção de Nossa Senhora em Corpo e Alma ao Céu',
        nameEn: 'The Assumption of the Blessed Virgin Mary into Heaven',
        scripturePt: 'E apareceu no céu um grande sinal: uma mulher vestida de sol, com a lua debaixo dos pés e uma coroa de doze estrelas na cabeça. (Ap 12, 1)',
        scriptureEn: 'And a great sign appeared in heaven: a woman clothed with the sun, with the moon under her feet... (Rev 12:1)',
        fruitPt: 'A Graça de uma santa e pacífica morte',
        fruitEn: 'Grace of a happy death and true devotion to Mary'
      },
      {
        decadeNumber: 5,
        namePt: 'A Coroação de Nossa Senhora como Rainha do Céu e da Terra',
        nameEn: 'The Coronation of the Blessed Virgin Mary as Queen of Heaven and Earth',
        scripturePt: '"Tu és a glória de Jerusalém, a alegria de Israel e a honra do nosso povo." (Jt 15, 9)',
        scriptureEn: '"You are the exaltation of Jerusalem, the great pride of Israel, and the great boast of our nation." (Jdt 15:9)',
        fruitPt: 'A Perseverança final e a coroa da glória eterna',
        fruitEn: 'Final perseverance and confidence in Our Lady’s Reign'
      }
    ]
  }
};

/**
 * Calculates the Mystery of the Day according to official Catholic tradition (*Rosarium Virginis Mariae*)
 */
export function getDailyMysteryType(date: Date = new Date()): MysteryType {
  const dayOfWeek = date.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  switch (dayOfWeek) {
    case 0: // Sunday
    case 3: // Wednesday
      return 'gloriosos';
    case 1: // Monday
    case 6: // Saturday
      return 'gozosos';
    case 2: // Tuesday
    case 5: // Friday
      return 'dolorosos';
    case 4: // Thursday
      return 'luminosos';
    default:
      return 'gloriosos';
  }
}

/**
 * Builds the complete sequence of steps to pray the Rosary from start to finish
 * Total beads in decades = 50 Hail Marys + 5 Our Fathers + Intro prayers
 */
export function buildRosarySequence(mysteryType: MysteryType): RosaryStep[] {
  const group = ROSARY_MYSTERIES[mysteryType];
  const steps: RosaryStep[] = [];
  let stepIndex = 1;

  // 1. Sign of the Cross & St. Louis de Montfort Offering
  steps.push({
    id: 'intro-cross',
    stepNumber: stepIndex++,
    totalSteps: 0, // will adjust
    type: 'sign_of_cross',
    titlePt: 'Sinal da Cruz & Oferecimento de Montfort',
    titleEn: 'Sign of the Cross & St. Louis de Montfort Offering',
    prayerTextPt: `Em nome do Pai, do Filho e do Espírito Santo. Amém.\n\nOferecimento: "Uno-me a todos os santos do Céu, a todos os justos da terra e a todas as almas fiéis que estão neste momento louvando a Deus. Ofertamos este Terço em reparação aos pecados cometidos contra o Imaculado Coração de Maria e o Sagrado Coração de Jesus, pelas intenções do Santo Padre e pela santificação da Igreja."`,
    prayerTextEn: `In the name of the Father, and of the Son, and of the Holy Spirit. Amen.\n\nOffering: "I unite myself with all the saints in Heaven, with all the just on earth, and with all faithful souls currently praising God. We offer this Rosary in reparation for sins against the Immaculate Heart of Mary and the Sacred Heart of Jesus, for the intentions of the Holy Father, and for the sanctification of the Church."`,
    latinText: `In nomine Patris, et Filii, et Spiritus Sancti. Amen.`
  });

  // 2. Apostles' Creed
  steps.push({
    id: 'intro-creed',
    stepNumber: stepIndex++,
    totalSteps: 0,
    type: 'creed',
    titlePt: 'Credo dos Apóstolos',
    titleEn: 'Apostles\' Creed',
    prayerTextPt: `Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai Todo-Poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.`,
    prayerTextEn: `I believe in God, the Father Almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`,
    latinText: `Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum... Amen.`
  });

  // 3. Our Father for the Intentions of the Holy Father
  steps.push({
    id: 'intro-our-father',
    stepNumber: stepIndex++,
    totalSteps: 0,
    type: 'our_father_pope',
    titlePt: 'Pai Nosso (Pelas intenções do Santo Padre e exaltação da Fé)',
    titleEn: 'Our Father (For the Holy Father\'s intentions and increase in Faith)',
    prayerTextPt: `Pai Nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`,
    prayerTextEn: `Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.`,
    latinText: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum... Amen.`
  });

  // 4. Three Hail Marys (Faith, Hope, Charity)
  const theologicalVirtuesPt = ['Pela virtude teologal da Fé', 'Pela virtude teologal da Esperança', 'Pela virtude teologal da Caridade'];
  const theologicalVirtuesEn = ['For the theological virtue of Faith', 'For the theological virtue of Hope', 'For the theological virtue of Charity'];

  for (let i = 1; i <= 3; i++) {
    steps.push({
      id: `intro-hail-mary-${i}`,
      stepNumber: stepIndex++,
      totalSteps: 0,
      type: 'three_hail_marys',
      titlePt: `Ave Maria (${theologicalVirtuesPt[i - 1]})`,
      titleEn: `Hail Mary (${theologicalVirtuesEn[i - 1]})`,
      prayerTextPt: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.`,
      prayerTextEn: `Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`,
      latinText: `Ave Maria, gratia plena, Dominus tecum... Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`
    });
  }

  // 5. Glory Be & Fatima Prayer
  steps.push({
    id: 'intro-glory',
    stepNumber: stepIndex++,
    totalSteps: 0,
    type: 'glory_be_fatima',
    titlePt: 'Glória ao Pai & Oração de Fátima',
    titleEn: 'Glory Be & Fatima Prayer',
    prayerTextPt: `Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.\n\nOração de Fátima: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da vossa misericórdia."`,
    prayerTextEn: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.\n\nFatima Prayer: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy."`,
    latinText: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`
  });

  // 6. Decades Loop (1 to 5)
  group.decades.forEach((decade) => {
    // Mystery Contemplation Step
    steps.push({
      id: `decade-${decade.decadeNumber}-intro`,
      stepNumber: stepIndex++,
      totalSteps: 0,
      type: 'mystery_intro',
      titlePt: `${decade.decadeNumber}º Mistério: ${decade.namePt}`,
      titleEn: `${decade.decadeNumber}st Mystery: ${decade.nameEn}`,
      prayerTextPt: `Palavra de Deus: ${decade.scripturePt}\n\n🙏 Fruto da contemplação: ${decade.fruitPt}`,
      prayerTextEn: `Word of God: ${decade.scriptureEn}\n\n🙏 Spiritual Fruit: ${decade.fruitEn}`,
      decadeNumber: decade.decadeNumber,
      mystery: decade
    });

    // 1 Our Father
    steps.push({
      id: `decade-${decade.decadeNumber}-our-father`,
      stepNumber: stepIndex++,
      totalSteps: 0,
      type: 'decade_our_father',
      titlePt: `Pai Nosso (${decade.decadeNumber}º Mistério)`,
      titleEn: `Our Father (${decade.decadeNumber}st Mystery)`,
      prayerTextPt: `Pai Nosso que estais nos céus, santificado seja o vosso nome... O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas... e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`,
      prayerTextEn: `Our Father, who art in heaven, hallowed be Thy name... Give us this day our daily bread... and lead us not into temptation, but deliver us from evil. Amen.`,
      latinText: `Pater noster, qui es in caelis, sanctificetur nomen tuum... Amen.`,
      decadeNumber: decade.decadeNumber,
      mystery: decade
    });

    // 10 Hail Marys
    for (let bead = 1; bead <= 10; bead++) {
      steps.push({
        id: `decade-${decade.decadeNumber}-hail-mary-${bead}`,
        stepNumber: stepIndex++,
        totalSteps: 0,
        type: 'decade_hail_mary',
        titlePt: `Ave Maria (${bead}ª Conta — ${decade.decadeNumber}º Mistério)`,
        titleEn: `Hail Mary (Bead ${bead} — ${decade.decadeNumber}st Mystery)`,
        prayerTextPt: `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.`,
        prayerTextEn: `Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`,
        latinText: `Ave Maria, gratia plena, Dominus tecum... Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`,
        decadeNumber: decade.decadeNumber,
        beadInDecade: bead,
        mystery: decade
      });
    }

    // Glory Be & Fatima Prayer
    steps.push({
      id: `decade-${decade.decadeNumber}-glory`,
      stepNumber: stepIndex++,
      totalSteps: 0,
      type: 'decade_glory_fatima',
      titlePt: `Glória & Oração de Fátima (${decade.decadeNumber}º Mistério)`,
      titleEn: `Glory Be & Fatima Prayer (${decade.decadeNumber}st Mystery)`,
      prayerTextPt: `Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.\n\n"Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno; levai as almas todas para o Céu e socorrei principalmente as que mais precisarem da vossa misericórdia."`,
      prayerTextEn: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.\n\n"O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy."`,
      latinText: `Gloria Patri, et Filio, et Spiritui Sancto... Amen.`,
      decadeNumber: decade.decadeNumber,
      mystery: decade
    });
  });

  // 7. Closing: Hail, Holy Queen (Salve Rainha)
  steps.push({
    id: 'closing-salve-regina',
    stepNumber: stepIndex++,
    totalSteps: 0,
    type: 'salve_regina',
    titlePt: 'Salve Rainha & Agradecimento Final',
    titleEn: 'Hail, Holy Queen & Final Thanksgiving',
    prayerTextPt: `Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva; a vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro nos mostrai Jesus, bendito fruto do vosso ventre, ó clemente, ó piedosa, ó doce sempre Virgem Maria.\n\nV. Rogai por nós, Santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo. Amém.`,
    prayerTextEn: `Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve: to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious Advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary!\n\nV. Pray for us, O Holy Mother of God.\nR. That we may be made worthy of the promises of Christ. Amen.`,
    latinText: `Salve, Regina, mater misericordiae; vita, dulcedo et spes nostra, salve... Amen.`
  });

  const total = steps.length;
  return steps.map(s => ({ ...s, totalSteps: total }));
}
