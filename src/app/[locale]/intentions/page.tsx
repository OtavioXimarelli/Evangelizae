'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { Heart, PlusCircle, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface IntentionItem {
  id: string;
  authorName: string;
  category: string;
  categoryKey: string;
  text: string;
  prayedCount: number;
  hasPrayed: boolean;
  timeAgo: string;
}

const INITIAL_INTENTIONS: IntentionItem[] = [
  {
    id: 'int-1',
    authorName: 'Maria Helena (Paróquia Santa Rita)',
    category: 'Saúde & Cura',
    categoryKey: 'categoryHealth',
    text: 'Peço orações pela recuperação do meu irmão Carlos após sua cirurgia cardíaca. Que Nossa Senhora o envolva em Seu manto.',
    prayedCount: 38,
    hasPrayed: false,
    timeAgo: 'Há 2 horas'
  },
  {
    id: 'int-2',
    authorName: 'Pe. Antônio M. (Diocese de Curitiba)',
    category: 'Vocação & Discernimento',
    categoryKey: 'categoryVocation',
    text: 'Pelos nossos seminaristas e por novas santas vocações sacerdotais e religiosas em nossa arquidiocese.',
    prayedCount: 64,
    hasPrayed: true,
    timeAgo: 'Há 4 horas'
  },
  {
    id: 'int-3',
    authorName: 'João e Ana Beatriz',
    category: 'Família & Matrimônio',
    categoryKey: 'categoryFamily',
    text: 'Pela paz e reconciliação em nosso lar e pela perseverança na oração do Terço em família todos os dias.',
    prayedCount: 29,
    hasPrayed: false,
    timeAgo: 'Há 5 horas'
  },
  {
    id: 'int-4',
    authorName: 'Gabriel S.',
    category: 'Conversão & Retorno à Igreja',
    categoryKey: 'categoryConversion',
    text: 'Pela conversão do meu melhor amigo que se afastou dos Sacramentos há 10 anos. Que o Espírito Santo toque o seu coração.',
    prayedCount: 52,
    hasPrayed: false,
    timeAgo: 'Há 7 horas'
  },
  {
    id: 'int-5',
    authorName: 'Lúcia de Fátima',
    category: 'Pelos Falecidos (Almas do Purgatório)',
    categoryKey: 'categoryDeceased',
    text: 'Pelo descanso eterno da alma do meu falecido avô José. Que contemple a face de Deus no Céu.',
    prayedCount: 41,
    hasPrayed: false,
    timeAgo: 'Há 9 horas'
  },
  {
    id: 'int-6',
    authorName: 'Comunidade Missionária São José',
    category: 'Ação de Graças',
    categoryKey: 'categoryThanksgiving',
    text: 'Agradecimento por uma grande graça de saúde alcançada através da novena à Divina Misericórdia!',
    prayedCount: 88,
    hasPrayed: true,
    timeAgo: 'Há 1 dia'
  }
];

export default function IntentionsPage() {
  const t = useTranslations('Intentions');
  const tCommon = useTranslations('Common');
  const [intentions, setIntentions] = React.useState<IntentionItem[]>(INITIAL_INTENTIONS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('categoryHealth');
  const [authorInput, setAuthorInput] = React.useState('');
  const [textInput, setTextInput] = React.useState('');

  const handlePrayedClick = (id: string) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15]);
      } catch (e) {}
    }

    setIntentions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.hasPrayed;
          return {
            ...item,
            hasPrayed: newStatus,
            prayedCount: newStatus ? item.prayedCount + 1 : item.prayedCount - 1
          };
        }
        return item;
      })
    );
  };

  const handlePostIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const categoryNames: Record<string, string> = {
      categoryHealth: t('categoryHealth'),
      categoryVocation: t('categoryVocation'),
      categoryFamily: t('categoryFamily'),
      categoryConversion: t('categoryConversion'),
      categoryDeceased: t('categoryDeceased'),
      categoryThanksgiving: t('categoryThanksgiving')
    };

    const newItem: IntentionItem = {
      id: `int-${Date.now()}`,
      authorName: authorInput.trim() || 'Irmão em Cristo',
      category: categoryNames[selectedCategory] || t('categoryHealth'),
      categoryKey: selectedCategory,
      text: textInput.trim(),
      prayedCount: 1,
      hasPrayed: true,
      timeAgo: 'Agora mesmo'
    };

    setIntentions([newItem, ...intentions]);
    setTextInput('');
    setAuthorInput('');
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge="Pilar III — Communio"
        icon={<Heart className="w-4 h-4 text-purple-500 fill-purple-500" />}
        rightAction={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sacred-gold hover:bg-sacred-gold-light text-white font-bold text-sm shadow-md gold-glow transition-all hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('btnSubmit')}</span>
          </button>
        }
      />

      {/* Serenity Notice Banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 text-xs sm:text-sm font-medium shadow-xs">
        <ShieldCheck className="w-5 h-5 text-purple-500 flex-shrink-0" />
        <p>
          <strong className="font-bold">Silêncio Sagrado:</strong> Para preservar a paz fraterna e evitar debates ou opiniões particulares, este muro funciona exclusivamente por intercessão orante (`{tCommon('prayedForYou')}`).
        </p>
      </div>

      {/* Intentions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {intentions.map((item) => (
          <EditorialCard
            key={item.id}
            className="flex flex-col justify-between gap-5 border-slate-200 dark:border-slate-700 transition-all hover:border-sacred-gold/60 hover:shadow-md"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold px-3 py-1 rounded-full bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30">
                  {item.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">{item.timeAgo}</span>
              </div>
              
              <p className="font-serif text-base text-slate-900 dark:text-white leading-relaxed pt-1 font-medium">
                &ldquo;{item.text}&rdquo;
              </p>
              
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 italic">
                — {item.authorName}
              </span>
            </div>

            {/* Prayed Button Action Strip */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                <strong className="text-sacred-gold font-extrabold text-sm">{item.prayedCount}</strong> {tCommon('peoplePrayed')}
              </span>

              <button
                onClick={() => handlePrayedClick(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  item.hasPrayed
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-slate-800 border-2 border-sacred-gold/60 text-sacred-gold hover:bg-sacred-gold hover:text-white shadow-xs'
                }`}
              >
                {item.hasPrayed ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Em oração por você</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{tCommon('prayedForYou')}</span>
                  </>
                )}
              </button>
            </div>
          </EditorialCard>
        ))}
      </div>

      {/* Submit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                {t('modalTitle')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-xl font-bold px-2"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePostIntention} className="flex flex-col gap-4">
              {/* Author field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Seu Nome ou Paróquia (Opcional)
                </label>
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  placeholder="Ex: João Silva (Paróquia N. Sra. do Carmo)"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-sacred-gold font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('modalCategoryLabel')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-sacred-gold font-medium text-slate-900 dark:text-white"
                >
                  <option value="categoryHealth">{t('categoryHealth')}</option>
                  <option value="categoryVocation">{t('categoryVocation')}</option>
                  <option value="categoryFamily">{t('categoryFamily')}</option>
                  <option value="categoryConversion">{t('categoryConversion')}</option>
                  <option value="categoryDeceased">{t('categoryDeceased')}</option>
                  <option value="categoryThanksgiving">{t('categoryThanksgiving')}</option>
                </select>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('modalTextLabel')}
                </label>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t('modalTextPlaceholder')}
                  required
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-sacred-gold resize-none font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sacred-gold hover:bg-sacred-gold-light text-white text-xs font-bold shadow-md gold-glow"
                >
                  {t('btnPost')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
