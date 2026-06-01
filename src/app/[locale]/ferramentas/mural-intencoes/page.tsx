"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/page-transition";
import { PageHeader } from "@/components/page-header";
import { useIntentionsStore } from "@/store/use-intentions-store";
import { IntentionCategory } from "@/types/store";
import { Heart, Plus, Search, CheckCircle2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

const CATEGORIES: { id: IntentionCategory | "all"; labelKey: string; color: string }[] = [
  { id: "all", labelKey: "filters.all", color: "bg-muted text-muted-foreground border-transparent" },
  { id: "familia", labelKey: "filters.family", color: "bg-primary/10 text-primary border-primary/20" },
  { id: "saude", labelKey: "filters.health", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { id: "conversao", labelKey: "filters.conversion", color: "bg-secondary/10 text-secondary dark:text-primary border-secondary/20" },
  { id: "almas", labelKey: "filters.souls", color: "bg-accent/10 text-accent border-accent/20" },
  { id: "outros", labelKey: "filters.other", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" }
];

export default function IntentionsWallPage() {
  const t = useTranslations("Mural");
  const commonT = useTranslations("Common");
  const intentions = useIntentionsStore((s) => s.intentions);
  const addIntention = useIntentionsStore((s) => s.addIntention);
  const incrementPrayedCount = useIntentionsStore((s) => s.incrementPrayedCount);
  const markAsAnswered = useIntentionsStore((s) => s.markAsAnswered);

  const [activeFilter, setActiveFilter] = useState<IntentionCategory | "all">("all");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<IntentionCategory>("familia");
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIntentions = intentions.filter(i => {
    if (activeFilter !== "all" && i.category !== activeFilter) return false;
    if (search.trim() && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = intentions.filter(i => i.status === "active").length;
  const answeredCount = intentions.filter(i => i.status === "answered").length;

  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.right) / 2 / window.innerWidth;
    const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y },
      colors: ["#D4AF37", "#1E3A8A", "#FFFDF7"]
    });
  };

  const handleIncrement = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    triggerConfetti(e);
    incrementPrayedCount(id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addIntention(newTitle.trim(), newCategory);
    setNewTitle("");
    setIsCreating(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader title={t('title')} subtitle={t('subtitle')} icon="📌" />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-10">
          
          {/* Dashboard/Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2rem] bg-card border border-primary/10 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-4xl font-cinzel font-bold text-foreground">{activeCount}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mt-2">{t('activeIntentions')}</span>
            </div>
            <div className="p-8 rounded-[2rem] bg-card border border-primary/10 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-4xl font-cinzel font-bold text-primary">{answeredCount}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mt-2">{t('answeredGraces')}</span>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="p-8 rounded-[2rem] bg-gradient-to-br from-primary to-gold-dark flex flex-col justify-center items-center text-primary-foreground shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <Plus className="w-10 h-10 mb-2 transition-transform group-hover:rotate-90 duration-300" />
              <span className="font-cinzel font-bold tracking-[0.2em] text-xs uppercase">{t('newIntention')}</span>
            </button>
          </div>

          {/* Creation Form inline */}
          {isCreating && (
            <div className="p-8 rounded-[2.5rem] bg-card border border-primary/20 shadow-sacred animate-fade-up">
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 px-1">{t('yourIntention')}</label>
                  <textarea 
                    autoFocus
                    rows={3}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t('placeholder')}
                    className="w-full bg-background border border-primary/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-manrope font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 block px-1">{t('category')}</label>
                  <div className="flex flex-wrap gap-2.5">
                    {CATEGORIES.filter(c => c.id !== "all").map(c => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setNewCategory(c.id as IntentionCategory)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${newCategory === c.id ? c.color : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"}`}
                      >
                         {t(c.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-primary/10">
                  <Button type="button" variant="ghost" className="rounded-full px-6 font-bold" onClick={() => setIsCreating(false)}>{t('cancel')}</Button>
                  <Button type="submit" disabled={!newTitle.trim()} className="bg-gradient-to-r from-primary to-gold-dark text-primary-foreground rounded-full px-8 font-cinzel font-bold shadow-gold-glow">{t('publish')}</Button>
                </div>
              </form>
            </div>
          )}

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-card/50 p-4 rounded-3xl border border-primary/5 shadow-sm">
            <div className="flex overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-hide gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveFilter(c.id as any)}
                  className={`px-5 py-2.5 flex-shrink-0 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${activeFilter === c.id ? c.color : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50"}`}
                >
                  {t(c.labelKey)}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
              <input 
                placeholder={t('search')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-primary/10 rounded-full pl-11 pr-5 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Masonry Grid */}
          {filteredIntentions.length === 0 ? (
            <div className="text-center py-24 px-4 bg-muted/20 rounded-[3rem] border border-dashed border-primary/20">
              <span className="text-6xl block mb-6 animate-float">🕊️</span>
              <h3 className="text-2xl font-cinzel font-bold text-foreground mb-3">{t('emptyTitle')}</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">{t('emptyDesc')}</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredIntentions.map((intention) => {
                const isAnswered = intention.status === "answered";
                const catInfo = CATEGORIES.find(c => c.id === intention.category);

                return (
                  <div key={intention.id} className={`break-inside-avoid relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-gold-glow ${isAnswered ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30" : "bg-card border-primary/10 hover:border-primary/30"}`}>
                    <div className="flex items-start justify-between mb-6">
                      <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${catInfo?.color}`}>
                        {catInfo ? t(catInfo.labelKey) : intention.category}
                      </span>
                      {isAnswered && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                          <CheckCircle2 className="w-4 h-4" /> {t('answered')}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-foreground leading-relaxed font-manrope font-medium text-lg mb-8 ${isAnswered ? "italic opacity-80" : ""}`}>
                      &ldquo;{intention.title}&rdquo;
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/10">
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        <Heart className={`w-4 h-4 ${intention.prayedCount > 0 ? "text-rose-500 fill-rose-500/20" : ""}`} />
                        <span className={intention.prayedCount > 0 ? "text-primary" : ""}>
                          {t('prayedCount', { count: intention.prayedCount })}
                        </span>
                      </div>
                      
                      {!isAnswered ? (
                        <div className="flex gap-2">
                           <button 
                            onClick={() => markAsAnswered(intention.id)}
                            className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors px-2"
                            title={t('markAnswered')}
                          >
                            {t('markAnswered')}
                          </button>
                          <button 
                            onClick={(e) => handleIncrement(intention.id, e)}
                            className="bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-1.5 border border-primary/10 hover:shadow-sm"
                          >
                            <Plus className="w-3 h-3" /> {t('addPrayer')}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold italic">
                           {new Date(intention.answeredAt || Date.now()).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </PageTransition>
  );
}
