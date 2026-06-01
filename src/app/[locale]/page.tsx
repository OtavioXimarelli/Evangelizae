"use client";

import { HeroSection } from "@/components/hero-section";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { ComingSoonModal } from "@/components/coming-soon-modal";
import { BRAND } from "@/config/brand";
import { CommunityFeed } from "@/components/community-feed";
import { Footer } from "@/components/footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const { openAuthModal } = useAuth();
  const t = useTranslations("Landing");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      if (!section) return;
      
      const elements = section.querySelectorAll('[data-magic-bento]');
      
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          }
        );
      } else {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const openSignup = () => openAuthModal("signup");
  const openComingSoon = (feature: string) => {
    setComingSoonFeature(feature);
    setComingSoonOpen(true);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background selection:bg-primary/30">
        <HeroSection />

        {/* Testimonium Section */}
        <section ref={addToRefs} id="witness" className="relative py-24 lg:py-40 overflow-hidden">
          <div className="container relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="font-cinzel text-primary font-bold tracking-[0.4em] text-[10px] sm:text-xs uppercase mb-6 block">
                {BRAND.latin.witness}
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-foreground mb-8 leading-tight">
                {t("witness.title")}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-manrope font-medium">
                {t("witness.description")}
              </p>
            </div>
            
            <CommunityFeed limit={3} />
            
            <div className="text-center mt-16">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full border-primary/20 hover:border-primary/40 px-10 py-6 font-cinzel font-bold text-sm tracking-widest uppercase transition-all hover:bg-primary/5 shadow-sm"
                onClick={() => openComingSoon(t("witness.cta"))}
              >
                {t("witness.cta")}
              </Button>
            </div>
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-[100%] blur-[120px] -z-10" />
        </section>

        {/* Communio Section */}
        <section ref={addToRefs} id="community" className="relative py-24 lg:py-40 bg-secondary/5 border-y border-primary/10 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_hsla(var(--primary)/0.03)_0%,transparent_70%)]" />
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
              <div>
                <span className="font-cinzel text-primary font-bold tracking-[0.4em] text-[10px] sm:text-xs uppercase mb-6 block">
                  {BRAND.latin.community}
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-foreground mb-10 leading-tight">
                  {t.rich("community.title", {
                    br: () => <br />
                  })}
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed font-manrope font-medium">
                  {t("community.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Button 
                    size="lg" 
                    className="rounded-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-cinzel font-bold px-10 py-7 text-sm tracking-widest uppercase shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
                    onClick={() => openComingSoon(t("community.cta1"))}
                  >
                    {t("community.cta1")}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="rounded-full border-primary/20 hover:bg-primary/5 px-10 py-7 font-cinzel font-bold text-sm tracking-widest uppercase shadow-sm"
                    onClick={() => openComingSoon(t("community.cta2"))}
                  >
                    {t("community.cta2")}
                  </Button>
                </div>
              </div>
              <div className="relative" data-magic-bento>
                <div className="glass-card p-10 sm:p-12 border-primary/30 relative z-10 shadow-sacred">
                  <div className="flex items-center justify-between mb-10">
                    <h4 className="font-cinzel font-bold text-xl uppercase tracking-widest text-primary">{t("community.activeMission", { topic: "Peace in families" })}</h4>
                    <span className="text-primary text-[10px] font-bold animate-pulse uppercase tracking-[0.2em]">{t("community.live")}</span>
                  </div>
                  <div className="space-y-10">
                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                        <span className="text-muted-foreground">{t("community.groupProgress")}</span>
                        <span className="text-primary">84%</span>
                      </div>
                      <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                        <div className="h-full bg-gradient-to-r from-primary to-gold-dark" style={{ width: '84%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 shadow-sm">
                        <div className="text-3xl font-cinzel font-bold text-primary mb-1">1,240</div>
                        <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground">{t("community.rosariesPrayed")}</div>
                      </div>
                      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 shadow-sm">
                        <div className="text-3xl font-cinzel font-bold text-primary mb-1">58</div>
                        <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground">{t("community.membersActive")}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-16 -right-16 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Missio Section */}
        <section ref={addToRefs} id="mission" className="relative py-24 lg:py-40 overflow-hidden border-b border-primary/10">
          <div className="container relative z-10 text-center">
            <span className="font-cinzel text-primary font-bold tracking-[0.4em] text-[10px] sm:text-xs uppercase mb-6 block">
              {BRAND.latin.mission}
            </span>
            <div className="max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-foreground mb-8 leading-tight">
                {t("mission.title")}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-manrope font-medium">
                {t("mission.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[1, 2, 3].map((i) => (
                <div key={i} data-magic-bento className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-primary/20 shadow-lg hover:shadow-gold-glow transition-all duration-700 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent z-10" />
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-700" />
                  <div className="absolute inset-0 flex flex-col justify-end p-10 z-20 text-left">
                    <div className="h-1 w-16 bg-primary mb-6 rounded-full" />
                    <h4 className="font-cinzel font-bold text-2xl text-foreground mb-3 uppercase tracking-widest">Apostolic Card #{i}</h4>
                    <p className="text-sm text-muted-foreground mb-8 font-manrope font-medium">"Be a Light in the Digital World"</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-fit rounded-full border-primary/30 hover:bg-primary text-primary hover:text-primary-foreground font-cinzel font-bold text-[10px] tracking-widest uppercase px-6"
                      onClick={() => openComingSoon(t("mission.cta"))}
                    >
                      {t("mission.cta")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" onClick={openSignup} className="rounded-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-cinzel font-bold px-12 py-8 text-base tracking-[0.2em] uppercase hover:shadow-gold-glow-lg transition-all border-none">
              {t("mission.finalCta")}
            </Button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </section>

        <Footer />

        <ComingSoonModal 
          isOpen={comingSoonOpen} 
          onClose={() => setComingSoonOpen(false)} 
          featureName={comingSoonFeature} 
        />
      </main>
    </PageTransition>
  );
}
