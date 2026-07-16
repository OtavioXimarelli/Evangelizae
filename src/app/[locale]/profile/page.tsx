'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { User, Flame, Sparkles, CheckCircle2, Church, Moon, Sun, ShieldCheck } from 'lucide-react';
import { Progress, Input, Button, Tag, Statistic, Switch } from 'antd';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const isMounted = useIsMounted();
  const { consecutiveDays, totalRosariesPrayed, lastCheckInDate } = usePrayerStore();

  const [parish, setParish] = React.useState('Paróquia Nossa Senhora do Carmo - São Paulo/SP');
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const willBeDark = !isDark;
      setIsDark(willBeDark);
      if (willBeDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('evangelizae-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('evangelizae-theme', 'light');
      }
    }
  };

  if (!isMounted) {
    return (
      <PageContainer>
        <div className="py-20 text-center font-serif text-slate-500 font-medium">
          {tCommon('loading')}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge="Fidelidade Pessoal (Sem Comparações)"
        icon={<User className="w-4 h-4 text-sacred-gold" />}
      />

      {/* Main Grid: Streak Card & Rosary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Streak Card */}
        <EditorialCard variant="accent" className="p-8 flex flex-col justify-between gap-6 border-2 border-amber-500/40">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Tag color="#d4af37" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white border-none shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-white shrink-0" />
                <span>Constância Diária</span>
              </Tag>
              {lastCheckInDate && (
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Último registro: {lastCheckInDate}
                </span>
              )}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span>{consecutiveDays} Dias Fies</span>
              <Flame className="w-8 h-8 fill-sacred-gold text-sacred-gold animate-bounce" />
            </h2>
            <p className="text-sm font-bold text-sacred-gold leading-relaxed">
              {t('streakSub')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            <strong className="font-bold">Fidelidade sem Vaidade:</strong> No Evangelizae, não existem rankings públicos ou competições. Sua oração é um diálogo íntimo com Deus e Sua Santa Igreja.
          </div>
        </EditorialCard>

        {/* Rosary & Devotion Summary */}
        <EditorialCard variant="default" className="p-8 flex flex-col justify-between gap-6 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <span className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Resumo de Orações Concluídas
              </span>
              <Sparkles className="w-5 h-5 text-sacred-gold" />
            </div>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col gap-1 border border-slate-200 dark:border-slate-700">
                <Statistic
                  value={totalRosariesPrayed}
                  prefix={<Sparkles className="w-4 h-4 text-sacred-gold inline mr-1" />}
                  valueStyle={{ fontWeight: 'bold', fontSize: '1.75rem', color: '#d4af37' }}
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Terços Rezados
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col gap-1 border border-slate-200 dark:border-slate-700">
                <Statistic
                  value="7 / 30"
                  valueStyle={{ fontWeight: 'bold', fontSize: '1.75rem', color: '#9333ea' }}
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Dias do Plano Espiritual
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Ao concluir o Terço no Santuário, o seu progresso espiritual é atualizado automaticamente, fortalecendo o hábito da oração mariana em sua rotina diária.
            </p>
          </div>
        </EditorialCard>

      </div>

      {/* 30-Day Spiritual Plan Progression Bar */}
      <EditorialCard className="p-6 sm:p-8 flex flex-col gap-6 border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sacred-gold" />
            <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
              {t('planTitle')} (O Oferecimento da Manhã)
            </h3>
          </div>
          <Tag color="success" className="text-xs font-bold px-3 py-1 rounded-full border-none">
            Fase 1: Construindo o Hábito
          </Tag>
        </div>

        {/* Ant Design Smooth Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Progresso Geral do Mês</span>
            <span>23% (Dia 7 de 30)</span>
          </div>
          <Progress percent={23} strokeColor="#d4af37" status="active" showInfo={false} className="w-full" />
        </div>

        {/* Checkmark Milestones */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 py-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
            const isDone = dayNum <= 7;
            const isCurrent = dayNum === 7;
            return (
              <div
                key={dayNum}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-sacred-gold text-white border-sacred-gold shadow-md scale-110'
                    : isDone
                    ? 'bg-sacred-gold/20 text-sacred-gold border-sacred-gold/40'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
                title={`Dia ${dayNum} do Plano Espiritual`}
              >
                <span>Dia {dayNum}</span>
                {isDone && <CheckCircle2 className="w-4 h-4 mt-1 stroke-[3]" />}
              </div>
            );
          })}
        </div>
      </EditorialCard>

      {/* Preferences & Parish Connection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Parish Connection Bridge */}
        <EditorialCard className="p-6 flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sacred-gold">
              <Church className="w-5 h-5" />
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                {t('parishTitle')}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              O Evangelizae existe para te guiar à Igreja física. Registre sua paróquia e capela de adoração eucarística:
            </p>
            <Input
              size="large"
              value={parish}
              onChange={(e) => setParish(e.target.value)}
              placeholder={t('parishPlaceholder')}
              prefix={<Church className="w-4 h-4 text-sacred-gold mr-2" />}
              className="mt-1 text-sm font-medium"
            />
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => alert('Paróquia atualizada em seu perfil pessoal.')}
            className="self-start px-6 font-bold shadow-xs bg-sacred-gold hover:bg-sacred-gold-light border-none"
          >
            {tCommon('save')}
          </Button>
        </EditorialCard>

        {/* Sacred Theme Toggle Card */}
        <EditorialCard className="p-6 flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-3">
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              {isDark ? <Moon className="w-5 h-5 text-sacred-gold" /> : <Sun className="w-5 h-5 text-sacred-gold" />}
              <span>{t('themeToggle')}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Alterne entre o tema <strong>Vaticano Branco</strong> (Luminoso e Solene) e o tema <strong>Sombra Mariana</strong> (Noturno, de paz e recolhimento para oração).
            </p>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isDark ? '🌙 Sombra Mariana (Escuro)' : '☀️ Vaticano Branco (Claro)'}
            </span>
            <Switch
              checked={isDark}
              onChange={toggleTheme}
              checkedChildren="Noite"
              unCheckedChildren="Solene"
            />
          </div>
        </EditorialCard>

      </div>
    </PageContainer>
  );
}
