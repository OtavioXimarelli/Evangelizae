"use client";

import { useRouter } from "@/i18n/routing";
import { HeroSection } from "@/components/hero-section";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ComingSoonModal } from "@/components/coming-soon-modal";

import { BRAND } from "@/config/brand";

export default function HomePage() {
  const { openAuthModal } = useAuth();
  const t = useTranslations("Landing");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");

  const openSignup = () => openAuthModal("signup");
  const openComingSoon = (feature: string) => {
    setComingSoonFeature(feature);
    setComingSoonOpen(true);
  };

  const witnesses = [
    { name: "Maria S.", text: "Gratias Deo. The recovery was a miracle through your collective prayers in the St. Jude Circle.", time: "2h ago", category: t("witness.categories.testimonium") },
    { name: "John D.", text: "Found peace during a difficult week at work by meditating on the Sorrowful Mysteries.", time: "5h ago", category: t("witness.categories.testimonium") },
    { name: "Lucas P.", text: "The new lesson on the Eucharist completely changed how I see the Mass.", time: "1d ago", category: t("witness.categories.insight") },
  ];

  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        <HeroSection />

        {/* Section 1: Witness Feed (Testimonium) */}
        <section id="witness" className="relative px-4 py-24 sm:px-6 lg:px-8 bg-sacred-cream dark:bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 opacity-30 noise-overlay" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <span className="text-gold-600 dark:text-gold-400 font-cinzel text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
                {BRAND.latin.witness}
              </span>
              <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-foreground mb-6">
                {t("witness.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("witness.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {witnesses.map((w, idx) => (
                <div key={idx} className="glass-card p-8 flex flex-col justify-between min-h-[250px] group hover:border-gold-leaf transition-all duration-500">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-bold tracking-widest text-gold-leaf uppercase px-2 py-1 border border-gold-leaf/20 rounded">
                        {w.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{w.time}</span>
                    </div>
                    <p className="text-lg italic font-manrope leading-relaxed text-foreground group-hover:text-gold-leaf/90 transition-colors">
                      "{w.text}"
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-leaf/20 flex items-center justify-center text-gold-leaf font-bold text-xs">
                      {w.name[0]}
                    </div>
                    <span className="text-sm font-semibold">{w.name}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                variant="outline" 
                className="rounded-full border-gold-leaf/30 hover:border-gold-leaf/60 text-gold-leaf px-8"
                onClick={() => openComingSoon(t("witness.cta"))}
              >
                {t("witness.cta")}
              </Button>
            </div>
          </div>
        </section>

        {/* Section 2: Mission Power-ups (Communio) */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold-leaf font-cinzel text-sm font-bold tracking-[0.3em] uppercase mb-4 block text-center lg:text-left">
                {BRAND.latin.community}
              </span>
              <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-8 text-center lg:text-left">
                {t.rich("community.title", {
                  span: (chunks) => <span className="text-gold-leaf">{chunks}</span>,
                  br: () => <br />
                })}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed text-center lg:text-left">
                {t("community.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="rounded-full bg-gold-leaf text-sacred-blue font-bold px-8"
                  onClick={() => openComingSoon(t("community.cta1"))}
                >
                  {t("community.cta1")}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full border-white/20 hover:bg-white/5 px-8"
                  onClick={() => openComingSoon(t("community.cta2"))}
                >
                  {t("community.cta2")}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-8 border-gold-leaf/40 relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-cinzel font-bold text-lg">{t("community.activeMission", { topic: "Peace in families" })}</h4>
                  <span className="text-gold-leaf text-xs font-bold">{t("community.live")}</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("community.groupProgress")}</span>
                      <span className="text-gold-leaf">84%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-leaf" style={{ width: '84%' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-gold-leaf">1,240</div>
                      <div className="text-[10px] uppercase tracking-tighter text-slate-400">{t("community.rosariesPrayed")}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-gold-leaf">58</div>
                      <div className="text-[10px] uppercase tracking-tighter text-slate-400">{t("community.membersActive")}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold-leaf/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold-leaf/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Section 3: Apostolic Shareables (Missio) */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-background">
          <div className="relative mx-auto max-w-7xl text-center">
            <span className="text-gold-600 dark:text-gold-400 font-cinzel text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              {BRAND.latin.mission}
            </span>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-foreground mb-8">
              {t("mission.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
              {t("mission.description")}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-[4/5] rounded-2xl overflow-hidden group shadow-2xl">
                   <div className={`absolute inset-0 bg-gradient-to-br ${i === 1 ? 'from-slate-900 to-sacred-blue' : i === 2 ? 'from-gold-leaf/20 to-gold-leaf/40' : 'from-slate-800 to-slate-950'}`} />
                   <div className="absolute inset-0 p-8 flex flex-col justify-between text-left border border-white/10">
                      <div>
                        <div className="text-2xl text-gold-leaf mb-4">"</div>
                        <p className="text-xl font-cinzel font-medium text-white leading-tight">
                          {i === 1 ? "The Rosary is the weapon for these times." : i === 2 ? "Be a Light in the Digital World." : "Do whatever he tells you."}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                          {i === 1 ? "St. Padre Pio" : i === 2 ? "Evangelizae" : "Mother Mary"}
                        </span>
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                           <span className="text-xs text-gold-leaf">📿</span>
                        </div>
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Button 
                        className="rounded-full bg-white text-black font-bold"
                        onClick={() => openComingSoon(t("mission.cta"))}
                      >
                        {t("mission.cta")}
                      </Button>
                   </div>
                </div>
              ))}
            </div>

            <Button size="lg" onClick={openSignup} className="rounded-full bg-gradient-to-r from-gold-leaf to-gold-muted text-sacred-blue font-bold px-12 py-8 text-xl hover:shadow-gold-glow-lg transition-all">
              {t("mission.finalCta")}
            </Button>
          </div>
        </section>

        <footer className="relative overflow-hidden border-t border-gold-500/15 bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.12)_0%,transparent_55%)]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20">
              <span className="text-3xl">📿</span>
            </div>
            <h3 className="mb-3 text-2xl font-cinzel font-bold text-white">{BRAND.name}</h3>
            <p className="mb-8 max-w-2xl leading-relaxed text-slate-300">{t("footer.desc")}</p>

            <div className="w-full border-t border-slate-800/90 pt-6">
              <p className="mb-2 text-sm text-slate-400">{t("footer.credits", { year: new Date().getFullYear() })}</p>
              <p className="text-sm italic text-slate-500">{t("footer.quote")}</p>
            </div>
          </div>
        </footer>

        <ComingSoonModal 
          isOpen={comingSoonOpen} 
          onClose={() => setComingSoonOpen(false)} 
          featureName={comingSoonFeature} 
        />
      </main>
    </PageTransition>
  );
}
