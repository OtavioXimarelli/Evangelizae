'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { BookOpen, Sparkles, ShieldCheck, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function LiturgyPage() {
  const t = useTranslations('Liturgy');
  const [activeTab, setActiveTab] = React.useState<'first' | 'psalm' | 'second' | 'gospel'>('gospel');
  const [fontSize, setFontSize] = React.useState<'normal' | 'large' | 'xl'>('large');

  const readings = {
    first: {
      title: '1ª Leitura (Deuteronômio 30, 10-14)',
      snippet: `Moisés falou ao povo, dizendo: "Obedece à voz do Senhor teu Deus, guardando os seus mandamentos e preceitos escritos neste livro da Lei, e volta para o Senhor teu Deus de todo o teu coração e de toda a tua alma.\n\nPois este mandamento que hoje te prescrevo não é alto demais para ti nem está fora do teu alcance. Não está no céu, para que digas: 'Quem subirá ao céu por nós para trazê-lo e proclamá-lo a nós, a fim de que o cumpramos?' Nem está além do mar, para que digas: 'Quem atravessará o mar por nós para trazê-lo e proclamá-lo?'\n\nPelo contrário, a palavra está muito perto de ti, na tua boca e no teu coração, para que a ponhas em prática."`,
      ref: 'Dt 30, 10-14'
    },
    psalm: {
      title: 'Salmo Responsorial (Salmo 68/69)',
      snippet: `R. Humildes, buscai a Deus e o vosso coração reviverá!\n\n1. O vosso amor é bondade e compaixão; olhai para mim com a vossa imensa ternura! Não escondais o vosso rosto ao vosso servo; estou em angústia, respondei-me depressa!\n\n2. Vejam os humildes e se alegrem; vós que buscais a Deus, reviva o vosso coração! Pois o Senhor ouve os pobres e não despreza os seus cativos. Louvem-no os céus e a terra, os mares e tudo o que neles se move!`,
      ref: 'Sl 68(69), 14-31'
    },
    second: {
      title: '2ª Leitura (Colossenses 1, 15-20)',
      snippet: `Irmãos: Cristo é a imagem do Deus invisível, o primogênito de toda a criatura; porque nele foram criadas todas as coisas, nos céus e na terra, as visíveis e as invisíveis: Tronos, Soberanias, Principados, Potestades. Tudo foi criado por meio dele e para ele.\n\nEle existe antes de todas as coisas e nele tudo subsiste. Ele é também a Cabeça do corpo, que é a Igreja. Ele é o Princípio, o primogênito dentre os mortos, de sorte que em tudo tem a primazia, porque aprouve a Deus fazer habitar nele toda a plenitude e por ele reconciliar consigo todas as coisas, pacificando pelo sangue da sua cruz tanto as coisas da terra como as dos céus.`,
      ref: 'Cl 1, 15-20'
    },
    gospel: {
      title: 'Santo Evangelho segundo São Lucas (10, 25-37)',
      snippet: `Naquele tempo, um mestre da Lei se levantou e, querendo pôr Jesus à prova, perguntou: "Mestre, que devo fazer para receber em herança a vida eterna?"\n\nJesus lhe disse: "O que está escrito na Lei? Como lês?" Ele respondeu: "Amarás o Senhor teu Deus de todo o teu coração e de toda a tua alma, com toda a tua força e com todo o teu entendimento; e ao teu próximo como a ti mesmo!" Jesus lhe disse: "Respondeste corretamente. Faze isso e viverás."\n\nMas o mestre da Lei, querendo justificar-se, disse a Jesus: "E quem é o meu próximo?" Jesus respondeu: "Um homem descia de Jerusalém para Jericó e caiu nas mãos de assaltantes. Estes arrancaram-lhe tudo, espancaram-no e foram-se embora, deixando-o quase morto. Por acaso, um sacerdote estava descendo por aquele mesmo caminho; quando viu o homem, passou adiante, pelo outro lado. O mesmo aconteceu com um levita... Mas um samaritano, que estava viajando, chegou perto dele, viu e teve compaixão..."\n\nJesus perguntou: "Qual dos três te parece ter sido o próximo daquele que caiu nas mãos dos assaltantes?" O mestre da Lei respondeu: "Aquele que usou de compaixão para com ele." Então Jesus lhe disse: "Vai e faze tu a mesma coisa."`,
      ref: 'Lc 10, 25-37'
    }
  };

  const currentReading = readings[activeTab];

  const fontSizes = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose'
  };

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge="Tempo Comum — Liturgia da Palavra"
        icon={<BookOpen className="w-4 h-4" />}
        rightAction={
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl shadow-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`p-1.5 rounded-lg text-xs font-bold ${fontSize === 'normal' ? 'bg-sacred-gold text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Fonte normal"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`p-1.5 rounded-lg text-xs font-bold ${fontSize === 'large' ? 'bg-sacred-gold text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Fonte grande"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`p-1.5 rounded-lg text-xs font-bold ${fontSize === 'xl' ? 'bg-sacred-gold text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Fonte extra-grande"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'first', label: t('tabFirstReading') },
          { id: 'psalm', label: t('tabPsalm') },
          { id: 'second', label: t('tabSecondReading') },
          { id: 'gospel', label: t('tabGospel'), isGospel: true }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? tab.isGospel
                    ? 'bg-sacred-gold text-white shadow-md scale-105'
                    : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sacred-gold border border-slate-300 dark:border-slate-700'
              }`}
            >
              {tab.isGospel && <Sparkles className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Reading Card */}
      <EditorialCard className="p-6 sm:p-10 flex flex-col gap-6 min-h-[440px] border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {currentReading.title}
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sacred-gold/15 text-sacred-gold self-start sm:self-auto border border-sacred-gold/30">
            ✝ {currentReading.ref}
          </span>
        </div>

        {/* Scripture Text */}
        <div className={`font-serif text-slate-900 dark:text-white whitespace-pre-line py-4 font-medium ${fontSizes[fontSize]}`}>
          {currentReading.snippet}
        </div>
      </EditorialCard>

      {/* Theological Reflection Card */}
      <EditorialCard variant="accent" className="p-6 sm:p-8 flex flex-col gap-4 border-2 border-amber-500/40">
        <div className="flex items-center gap-2 text-sacred-gold">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            {t('reflectionTitle')}
          </h3>
        </div>
        <p className="font-serif italic text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
          {t('reflectionContent')}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-sacred-gold/30 font-medium">
          <span>Fonte de Consulta:</span>
          <span className="font-bold text-sacred-gold">Catecismo da Igreja Católica (§1825) & São João Crisóstomo</span>
        </div>
      </EditorialCard>
    </PageContainer>
  );
}
