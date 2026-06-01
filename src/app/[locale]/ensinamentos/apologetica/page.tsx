import { getApologeticsData } from "@/data/apologetics";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbNav } from "@/components/learning/breadcrumb-nav";
import { getTranslations } from "next-intl/server";
import { Shield, BookOpen, UserCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ApologeticsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Apologetics" });
  const commonT = await getTranslations({ locale, namespace: "Common" });
  const tracts = await getApologeticsData(locale);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pb-24">
        <PageHeader title={t("title")} subtitle={t("subtitle")} icon="🛡️" />

        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { label: commonT("teachings"), path: "/ensinamentos" },
              { label: t("title") },
            ]}
          />

          <div className="mt-12 space-y-16">
            {tracts.map((tract) => (
              <section key={tract.id} className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card p-6 sm:p-10 shadow-sacred">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        <Shield className="h-3 w-3" />
                        {t(`categories.${tract.category}`)}
                      </span>
                      <h2 className="font-cinzel text-3xl font-bold text-foreground">{tract.title}</h2>
                    </div>
                  </div>

                  {/* Objection vs Catholic Answer */}
                  <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
                      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-destructive">
                        {t("objection")}
                      </h3>
                      <p className="font-manrope text-sm font-medium leading-relaxed text-foreground/80 italic">
                        "{tract.objection}"
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        {t("catholicAnswer")}
                      </h3>
                      <p className="font-manrope text-sm font-medium leading-relaxed text-foreground">
                        {tract.shortAnswer}
                      </p>
                    </div>
                  </div>

                  {/* Evidence Section */}
                  <div className="space-y-8">
                    {/* Scripture */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 font-cinzel text-lg font-bold text-primary">
                        <BookOpen className="h-5 w-5" />
                        {t("scriptureEvidence")}
                      </h3>
                      <div className="space-y-4">
                        {tract.scriptureReferences.map((ref, idx) => (
                          <div key={idx} className="rounded-2xl bg-muted/30 p-5">
                            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                              {ref.reference}
                            </p>
                            <p className="font-manrope text-sm leading-relaxed text-foreground/90">
                              "{ref.text}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Church Fathers */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 font-cinzel text-lg font-bold text-primary">
                        <UserCircle2 className="h-5 w-5" />
                        {t("traditionEvidence")}
                      </h3>
                      <div className="space-y-4">
                        {tract.churchFathers.map((father, idx) => (
                          <div key={idx} className="rounded-2xl border-l-2 border-primary/40 bg-primary/5 p-5">
                            <p className="font-manrope text-sm italic leading-relaxed text-foreground/90">
                              "{father.quote}"
                            </p>
                            <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-primary">
                              <span>— {father.author}</span>
                              <span>{father.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Deep Dive */}
                    <div className="rounded-2xl border border-primary/10 p-6">
                      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {t("detailedExplanation")}
                      </h3>
                      <p className="font-manrope text-sm leading-relaxed text-foreground/80">
                        {tract.detailedExplanation}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
