"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  BookOpen,
  Compass,
  Globe,
  Home,
  LayoutDashboard,
  Play,
  Sparkles,
} from "lucide-react";

export function MobileNav() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navigateTo = (path: string) => {
    router.push(path as any);
    setMenuOpen(false);
    setLangOpen(false);
  };

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname as any, { locale: newLocale as any });
    setLangOpen(false);
  };

  const moreLinks = [
    { label: t("mysteries"), path: "/misterios-do-dia", icon: Sparkles },
    { label: t("prayers"), path: "/oracoes-tradicionais", icon: BookOpen },
    { label: t("resources"), path: "/recursos", icon: Compass },
    { label: t("about"), path: "/about", icon: Home },
  ];

  return (
    <>
      <nav className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 bg-background/95 backdrop-blur-xl shadow-sacred md:hidden">
        <div className="flex items-end justify-around px-2 pb-2 pt-2">
          <button
            onClick={() => navigateTo("/dashboard")}
            className={`flex w-14 flex-col items-center justify-center rounded-lg py-1 transition-colors ${
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <LayoutDashboard className={`h-[22px] w-[22px] ${pathname === "/dashboard" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
            <span className="mt-1 text-[10px] font-bold leading-tight">{t("dashboard")}</span>
          </button>

          <button
            onClick={() => navigateTo("/como-rezar")}
            className={`flex w-14 flex-col items-center justify-center rounded-lg py-1 transition-colors ${
              pathname === "/como-rezar" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BookOpen className={`h-[22px] w-[22px] ${pathname === "/como-rezar" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
            <span className="mt-1 text-[10px] font-bold leading-tight">{t("howToPray")}</span>
          </button>

          <button onClick={() => navigateTo("/ferramentas/guia-interativo")} className="-mt-4 flex flex-col items-center justify-center group">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold-dark shadow-gold-glow transition-transform active:scale-90">
              <Play className="ml-0.5 h-6 w-6 fill-primary-foreground text-primary-foreground" />
            </div>
            <span className="mt-1.5 text-[10px] font-bold leading-tight text-primary">Rezar</span>
          </button>

          <button
            onClick={() => navigateTo("/ensinamentos")}
            className={`flex w-14 flex-col items-center justify-center rounded-lg py-1 transition-colors ${
              pathname.startsWith("/ensinamentos") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Sparkles className={`h-[22px] w-[22px] ${pathname.startsWith("/ensinamentos") ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
            <span className="mt-1 text-[10px] font-bold leading-tight">{t("teachings")}</span>
          </button>

          <button
            onClick={() => {
              setMenuOpen((v) => !v);
              setLangOpen(false);
            }}
            className={`flex w-14 flex-col items-center justify-center rounded-lg py-1 transition-colors ${
              menuOpen ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Compass className={`h-[22px] w-[22px] ${menuOpen ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
            <span className="mt-1 text-[10px] font-bold leading-tight">{t("more")}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="animate-fade-up absolute bottom-20 left-4 right-4 overflow-hidden rounded-3xl border border-primary/10 bg-background/98 p-4 shadow-sacred backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 mx-auto h-1.5 w-12 rounded-full bg-primary/20" />
            <div className="space-y-1.5">
              {moreLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors active:bg-primary/10 ${
                    pathname === link.path ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${pathname === link.path ? "bg-primary/20" : "bg-primary/5"}`}>
                    <link.icon className={`h-6 w-6 ${pathname === link.path ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-left text-sm font-bold">{link.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setLangOpen((v) => !v);
              }}
              className="mt-4 flex w-full items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 px-4 py-4 text-foreground transition-all active:bg-primary/10"
            >
              <span className="inline-flex items-center gap-3 text-sm font-bold">
                <Globe className="h-5 w-5 text-primary" />
                Idioma / Language
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">{locale}</span>
            </button>

            {langOpen && (
              <div className="mt-2 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => changeLanguage("pt")}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all ${locale === "pt" ? "border border-primary/30 bg-primary/20 text-primary" : "bg-muted/50 text-foreground"}`}
                >
                  <span className="font-bold text-sm">🇧🇷 Português</span>
                  {locale === "pt" && <Sparkles className="h-4 w-4 fill-primary" />}
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-all ${locale === "en" ? "border border-primary/30 bg-primary/20 text-primary" : "bg-muted/50 text-foreground"}`}
                >
                  <span className="font-bold text-sm">🇺🇸 English</span>
                  {locale === "en" && <Sparkles className="h-4 w-4 fill-primary" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
