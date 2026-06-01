"use client";

import { BRAND } from "@/config/brand";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("Landing");
  const footerT = useTranslations("Landing.footer");
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  const footerLinks = [
    { label: footerT("aboutLinks.0"), path: "/como-rezar" },
    { label: footerT("aboutLinks.1"), path: "/historia" },
    { label: footerT("aboutLinks.2"), path: "/misterios-do-dia" },
    { label: footerT("aboutLinks.3"), path: "/oracoes-tradicionais" },
  ];

  const communityLinks = [
    { label: footerT("communityLinks.0"), path: "/about" },
    { label: footerT("communityLinks.1"), path: "/dashboard" },
    { label: footerT("communityLinks.2"), path: "/ensinamentos" },
    { label: footerT("communityLinks.3"), path: "/dashboard" }, // Placeholder for stats
  ];

  return (
    <footer className="relative overflow-hidden border-t border-primary/10 bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(var(--primary)/0.08)_0%,transparent_60%)]" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold-dark shadow-gold-glow">
              <span className="text-2xl">📿</span>
            </div>
            <h3 className="mb-4 font-cinzel text-2xl font-bold tracking-tight text-foreground">{BRAND.name}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {footerT("desc")}
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-cinzel text-sm font-bold uppercase tracking-widest text-primary">
              {footerT("about")}
            </h4>
            <ul className="space-y-4">
              {footerLinks.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <button 
                    onClick={() => navigateTo(link.path)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-cinzel text-sm font-bold uppercase tracking-widest text-primary">
              {footerT("community")}
            </h4>
            <ul className="space-y-4">
              {communityLinks.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <button 
                    onClick={() => navigateTo(link.path)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 w-full border-t border-primary/10 pt-8 text-center">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {footerT("credits", { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs italic text-muted-foreground/60 max-w-md mx-auto">
            {footerT("quote")}
          </p>
        </div>
      </div>
    </footer>
  );
}
