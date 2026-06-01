import { getDailyLiturgy } from "@/services/liturgyService";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbNav } from "@/components/learning/breadcrumb-nav";
import { getTranslations } from "next-intl/server";
import { BookOpen, Cross, Star, CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DailyLiturgyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Liturgy" });
  const commonT = await getTranslations({ locale, namespace: "Common" });
  const liturgy = await getDailyLiturgy();

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pb-24">
        <PageHeader title={t("title")} subtitle={t("subtitle")} icon="📖" />

        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <BreadcrumbNav
            items={[
              { label: commonT("teachings"), path: "/ensinamentos" },
              { label: t("title") },
            ]}
          />

          <div className="mt-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar / Metadata */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="sticky top-24 rounded-3xl border border-primary/20 bg-card p-6 shadow-sm">
                <div className="mb-6 border-b border-primary/10 pb-6 text-center">
                  <span className="text-4xl block mb-4">📅</span>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                    {t("today")}
                  </div>
                  <div className="font-cinzel text-xl font-bold text-foreground capitalize">
                    {new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }).format(new Date(liturgy.date))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      {t("color")}
                    </span>
                    <div className="flex items-center gap-2 text-sm font-semibold capitalize text-foreground">
                      <div className={`w-3 h-3 rounded-full bg-${liturgy.color}-500`} />
                      {t(`colors.${liturgy.color}`)}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
              {/* First Reading */}
              <section className="rounded-[2.5rem] border border-primary/10 bg-card p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-cinzel text-xl font-bold text-foreground">{t("firstReading")}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{liturgy.firstReading.reference}</p>
                  </div>
                </div>
                <div className="prose prose-lg dark:prose-invert prose-p:font-manrope prose-p:leading-relaxed max-w-none text-foreground/90">
                  <p>{liturgy.firstReading.text}</p>
                </div>
              </section>

              {/* Psalm */}
              <section className="rounded-[2.5rem] border border-primary/10 bg-card p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-cinzel text-xl font-bold text-foreground">{t("psalm")}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{liturgy.psalm.reference}</p>
                  </div>
                </div>
                <div className="mb-6 rounded-2xl bg-primary/5 p-4 text-center border border-primary/10">
                  <p className="font-cinzel font-bold text-primary">R. {liturgy.psalm.response}</p>
                </div>
                <div className="space-y-6 text-center italic text-foreground/80 font-medium">
                  {liturgy.psalm.text.map((stanza, index) => (
                    <p key={index} className="whitespace-pre-line leading-relaxed">
                      {stanza}
                    </p>
                  ))}
                </div>
              </section>

              {/* Gospel */}
              <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card p-8 sm:p-12 shadow-sacred">
                <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10">
                  <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-gold-dark shadow-gold-glow">
                      <Cross className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h2 className="font-cinzel text-3xl font-bold text-foreground mb-1">{t("gospel")}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{liturgy.gospel.reference}</p>
                  </div>
                  <div className="prose prose-lg dark:prose-invert prose-p:font-manrope prose-p:leading-relaxed max-w-none text-foreground/90 mb-8 text-center sm:text-left">
                    <p>{liturgy.gospel.text}</p>
                  </div>
                  <div className="text-center font-cinzel font-bold text-primary uppercase tracking-widest text-sm">
                    {t("wordOfSalvation")}
                  </div>
                </div>
              </section>

              {/* Reflection */}
              <section className="rounded-[2.5rem] bg-secondary/5 border border-primary/10 p-8 sm:p-10">
                <h3 className="mb-6 font-cinzel text-2xl font-bold text-foreground">{t("reflection")}</h3>
                <blockquote className="border-l-4 border-primary/40 pl-6 italic text-foreground/80 font-manrope leading-relaxed text-lg mb-4">
                  "{liturgy.reflection.text}"
                </blockquote>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">— {liturgy.reflection.author}</p>
              </section>

            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
