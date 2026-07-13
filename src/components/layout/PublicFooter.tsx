'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
  ShieldCheck, 
  Heart, 
  Church, 
  Sparkles, 
  BookOpen, 
  Bot, 
  User, 
  Compass, 
  ArrowUpRight,
  Award
} from 'lucide-react';

export function PublicFooter() {
  const t = useTranslations('Footer');
  const tHeader = useTranslations('Header');

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Main Multi-Column Institutional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-200 dark:border-slate-800">
          
          {/* Column 1 & 2: Institutional Identity & Mission (Colspan 5 on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-5 pr-0 lg:pr-6">
            <Link href="/sanctuary" className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 rounded-xl cathedral-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <span className="font-serif text-xl font-bold">E✝</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-tight tracking-wide text-slate-900 dark:text-white">
                  Evangelizae
                </span>
                <span className="text-[10px] uppercase tracking-wider text-sacred-gold font-bold">
                  Veritas • Communio • Missio
                </span>
              </div>
            </Link>

            <p className="font-serif italic text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              &ldquo;{t('missionText')}&rdquo;
            </p>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs sm:text-sm font-semibold leading-relaxed shadow-xs">
              <ShieldCheck className="w-5 h-5 text-sacred-gold shrink-0 mt-0.5" />
              <span>{t('freePledge')}</span>
            </div>
          </div>

          {/* Column 3: Devotional Life & Liturgy (Colspan 3 on Desktop) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <Church className="w-4 h-4 text-sacred-gold" />
              <span>Vida Devocional & Liturgia</span>
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/sanctuary" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <span>✝</span>
                  <span>{tHeader('sanctuary')}</span>
                </Link>
              </li>
              <li>
                <Link href="/rosary" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <span>📿</span>
                  <span>{tHeader('rosary')} Guiado</span>
                </Link>
              </li>
              <li>
                <Link href="/liturgy" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <span>📖</span>
                  <span>{tHeader('liturgy')} & Lectio Divina</span>
                </Link>
              </li>
              <li>
                <Link href="/intentions" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <span>🙏</span>
                  <span>{tHeader('intentions')} Fraternas</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Formation & AI Magisterium (Colspan 2 on Desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sacred-gold" />
              <span>Formação & IA</span>
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/ai" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <Bot className="w-3.5 h-3.5 text-sacred-gold" />
                  <span>{tHeader('ai')}</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <User className="w-3.5 h-3.5 text-sacred-gold" />
                  <span>{tHeader('profile')}</span>
                </Link>
              </li>
              <li>
                <Link href="/sanctuary" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <Award className="w-3.5 h-3.5 text-sacred-gold" />
                  <span>Plano 30 Dias</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Mission & Support (Colspan 2 on Desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-sacred-gold" />
              <span>A Missão & Apoio</span>
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/about" className="text-sacred-gold font-bold hover:underline transition-colors flex items-center gap-1.5 py-0.5">
                  <span>{tHeader('about')} (Manifesto)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Doação (Providência)</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <span>🛡️ 3+1 Compromissos</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sacred-gold transition-colors flex items-center gap-2 py-0.5">
                  <span>⚖️ {t('privacy')}</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Institutional Copyright & Scripture Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>{t('copyright')}</span>
            <span>•</span>
            <span className="font-bold text-sacred-gold">AMDG</span>
          </div>
          <div className="italic text-center sm:text-right font-medium">
            &ldquo;De graça recebestes, de graça dai.&rdquo; (Mateus 10, 8)
          </div>
        </div>

      </div>
    </footer>
  );
}
