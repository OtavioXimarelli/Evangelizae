"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  BookOpen,
  Globe,
  Home,
  History,
  Menu,
  MessageCircleHeart,
  Moon,
  ScrollText,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";
import { useAuth, AUTH_DISABLED } from "@/providers/auth-provider";
import { useLocale, useTranslations } from "next-intl";
import { BRAND } from "@/config/brand";

export function PublicHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { openAuthModal } = useAuth();
  const t = useTranslations("PublicHeader");
  const navT = useTranslations("Navbar");
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname as any, { locale: newLocale as any });
    setLangOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path as any);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: navT("home"), icon: Home, path: "/" },
    { label: navT("howToPray"), icon: BookOpen, path: "/como-rezar" },
    { label: navT("mysteries"), icon: Sparkles, path: "/misterios-do-dia", badge: t("badgeToday") },
    { label: navT("prayers"), icon: ScrollText, path: "/oracoes-tradicionais" },
  ];

  const secondaryLinks = [
    { label: navT("history"), icon: History, path: "/historia" },
    { label: navT("about"), icon: MessageCircleHeart, path: "/about" },
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-primary/10 bg-background/95 shadow-lg backdrop-blur-xl"
            : "bg-background/80 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <button
              onClick={() => navigateTo("/")}
              className="group flex items-center gap-2 sm:gap-3"
              data-testid="header-logo"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold-dark shadow-lg transition-all group-hover:shadow-gold-glow sm:h-12 sm:w-12">
                <span className="text-xl sm:text-2xl">📿</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-cinzel text-lg font-bold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {BRAND.name}
                </h1>
              </div>
            </button>

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigateTo(link.path)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                    data-testid={`nav-${link.path.replace("/", "") || "home"}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={isActive ? "font-bold" : "font-medium"}>{link.label}</span>
                    {link.badge && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-300 ${
                    langOpen
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                  aria-label="Change language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase">{locale}</span>
                </button>

                {langOpen && (
                  <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 top-full z-[60] mt-2 w-40 overflow-hidden rounded-xl border border-primary/10 bg-card p-1 shadow-xl">
                    <button
                      onClick={() => changeLanguage("pt")}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${locale === "pt" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                    >
                      <span className="text-base">🇧🇷</span> Português
                    </button>
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${locale === "en" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                    >
                      <span className="text-base">🇺🇸</span> English
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="glass relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:shadow-gold-glow"
                aria-label={t("theme")}
                data-testid="theme-toggle"
              >
                <Sun className="h-4 w-4 scale-100 rotate-0 text-primary transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-4 w-4 scale-0 rotate-90 text-primary transition-transform duration-300 dark:scale-100 dark:rotate-0" />
              </button>

              {AUTH_DISABLED ? (
                <Button
                  size="sm"
                  onClick={() => navigateTo("/dashboard")}
                  className="rounded-full bg-gradient-to-r from-primary to-gold-dark font-cinzel font-bold text-primary-foreground hover:shadow-gold-glow"
                  data-testid="header-dashboard"
                >
                  {t("openDashboard")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAuthModal("login")}
                    className="rounded-full border-primary/20 hover:border-primary/40 hover:bg-primary/5 font-bold"
                    data-testid="header-login"
                  >
                    {t("login")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openAuthModal("signup")}
                    className="rounded-full bg-gradient-to-r from-primary to-gold-dark font-cinzel font-bold text-primary-foreground hover:shadow-gold-glow"
                    data-testid="header-signup"
                  >
                    {t("start")}
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="glass relative flex h-9 w-9 items-center justify-center rounded-full"
                aria-label={t("theme")}
              >
                <Sun className="h-4 w-4 scale-100 rotate-0 text-primary transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-4 w-4 scale-0 rotate-90 text-primary transition-transform duration-300 dark:scale-100 dark:rotate-0" />
              </button>
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="glass flex h-9 w-9 items-center justify-center rounded-full"
                aria-label={t("menu")}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="h-16 sm:h-20" />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="absolute left-4 right-4 top-24 rounded-2xl border border-primary/20 bg-background p-4 shadow-2xl">
            <div className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigateTo(link.path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                      isActive ? "bg-gold-500/10 text-gold-600 dark:text-gold-400" : "hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{link.label}</span>
                    {link.badge && (
                      <span className="ml-auto rounded-full border border-gold-500/30 bg-gold-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-600 dark:text-gold-300">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="my-2 border-t border-border/60" />

              {secondaryLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigateTo(link.path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                      isActive ? "bg-gold-500/10 text-gold-600 dark:text-gold-400" : "hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
