"use client";

import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbNav } from "@/components/learning/breadcrumb-nav";
import {
  Compass,
  Clock,
  BookOpen,
  Heart,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useState } from "react";
import { ComingSoonModal } from "@/components/coming-soon-modal";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/routing";

export default function FerramentasPage() {
  const router = useRouter();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");
  const t = useTranslations("Teachings.tools");

  const tools = [
    {
      id: "guia-interativo",
      title: t("list.guide.title"),
      description: t("list.guide.desc"),
      icon: Compass,
      gradient: "from-primary to-gold-dark",
      isNew: true,
      ready: true
    },
    {
      id: "diario-espiritual",
      title: t("list.journal.title"),
      description: t("list.journal.desc"),
      icon: Heart,
      gradient: "from-purple-500 to-purple-600",
      isNew: false,
      ready: true
    },
    {
      id: "temporizador",
      title: t("list.timer.title"),
      description: t("list.timer.desc"),
      icon: Clock,
      gradient: "from-blue-500 to-blue-600",
      isNew: false,
      ready: false
    },
    {
      id: "mural-intencoes",
      title: t("list.wall.title"),
      description: t("list.wall.desc"),
      icon: Sparkles,
      gradient: "from-rose-500 to-rose-600",
      isNew: false,
      ready: false
    }
  ];

  const handleToolClick = (tool: typeof tools[0] | { ready: boolean, title: string }) => {
    if (tool.ready && 'id' in tool) {
      router.push(`/ferramentas/${tool.id}`);
    } else {
      setSelectedFeature(tool.title);
      setComingSoonOpen(true);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          icon="🔧"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <BreadcrumbNav items={[{ label: t("breadcrumb") }]} />

          {/* Intro Section */}
          <section className="mb-16">
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 max-w-3xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-xl mb-6">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-foreground mb-4">
                  {t("heroTitle")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {t("heroDesc")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 rounded-full bg-background/50 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {t("f1")}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-background/50 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {t("f2")}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="group relative p-8 rounded-[2rem] glass sacred-border hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  {/* Hover background effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <tool.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      {tool.isNew && (
                        <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest animate-pulse">
                          {t("badge")}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-cinzel font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {tool.description}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                      {t("access")}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12 px-6 rounded-[2rem] bg-muted/30 border border-border/50">
            <BookOpen className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h3 className="text-xl font-cinzel font-bold text-foreground mb-2">{t("suggest.title")}</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {t("suggest.desc")}
            </p>
            <button
              onClick={() => handleToolClick({ ready: false, title: t("suggest.btn") })}
              className="text-primary font-bold uppercase tracking-widest hover:underline text-sm"
            >
              {t("suggest.btn")}
            </button>
          </section>
        </div>

        <ComingSoonModal
          isOpen={comingSoonOpen}
          onClose={() => setComingSoonOpen(false)}
          featureName={selectedFeature}
        />
      </main>
    </PageTransition>
  );
}
