"use client";

import { useState, useRef } from "react";
import { Download, Loader2, Sparkles, Quote, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import html2canvas from "html2canvas";
import { BRAND } from "@/config/brand";

const QUOTES = [
  {
    id: "q1",
    text: "Fizeste-nos, Senhor, para ti, e o nosso coração anda inquieto enquanto não descansar em ti.",
    author: "Santo Agostinho",
  },
  {
    id: "q2",
    text: "Para quem tem fé, nenhuma explicação é necessária. Para quem não tem fé, nenhuma explicação é possível.",
    author: "São Tomás de Aquino",
  },
  {
    id: "q3",
    text: "A Eucaristia é a minha autoestrada para o Céu.",
    author: "Beato Carlo Acutis",
  },
  {
    id: "q4",
    text: "Não tenhais medo! Abri, melhor, escancarai as portas a Cristo!",
    author: "São João Paulo II",
  }
];

export function ApostolicCardGenerator() {
  const t = useTranslations("Landing.mission.generator");
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [selectedQuote, setSelectedQuote] = useState(QUOTES[0]);
  const [selectedTheme, setSelectedTheme] = useState<"marian" | "vatican">("marian");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsGenerating(true);
      // Brief delay to ensure state reflects loading if needed, though html2canvas is synchronous blocking
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High-res export
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `evangelizae-card-${Date.now()}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left mb-20" data-magic-bento>
      
      {/* Controls / Left Column */}
      <div className="col-span-1 lg:col-span-5 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-5 h-5 text-primary" />
            <h3 className="font-cinzel font-bold text-foreground text-xl uppercase tracking-widest">{t("quoteLabel")}</h3>
          </div>
          <div className="space-y-3">
            {QUOTES.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQuote(q)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${
                  selectedQuote.id === q.id 
                    ? "bg-primary/10 border-primary/40 shadow-sm" 
                    : "bg-card border-border hover:border-primary/20"
                }`}
              >
                <p className={`font-manrope text-sm leading-relaxed italic line-clamp-2 ${selectedQuote.id === q.id ? "text-foreground" : "text-muted-foreground"}`}>
                  "{q.text}"
                </p>
                <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 block ${selectedQuote.id === q.id ? "text-primary" : "text-muted-foreground/60"}`}>
                  — {q.author}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="font-cinzel font-bold text-foreground text-xl uppercase tracking-widest">{t("themeLabel")}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedTheme("marian")}
              className={`p-4 rounded-2xl transition-all duration-300 border flex flex-col items-center justify-center gap-3 ${
                selectedTheme === "marian"
                  ? "border-primary bg-primary/5 shadow-gold-glow"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="w-full h-12 rounded-xl bg-gradient-to-b from-[#0B1224] to-[#1A2A4A] border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest text-center ${selectedTheme === "marian" ? "text-primary" : "text-muted-foreground"}`}>
                {t("themes.marian")}
              </span>
            </button>

            <button
              onClick={() => setSelectedTheme("vatican")}
              className={`p-4 rounded-2xl transition-all duration-300 border flex flex-col items-center justify-center gap-3 ${
                selectedTheme === "vatican"
                  ? "border-primary bg-primary/5 shadow-gold-glow"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="w-full h-12 rounded-xl bg-gradient-to-b from-[#FFFDF7] to-[#F3EFE5] border border-border flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest text-center ${selectedTheme === "vatican" ? "text-primary" : "text-muted-foreground"}`}>
                {t("themes.vatican")}
              </span>
            </button>
          </div>
        </div>

        <Button 
          size="lg" 
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full rounded-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-cinzel font-bold px-8 py-7 tracking-widest uppercase hover:shadow-gold-glow-lg transition-all border-none"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Download className="w-5 h-5 mr-3" />
              {t("downloadBtn")}
            </>
          )}
        </Button>
      </div>

      {/* Preview / Right Column */}
      <div className="col-span-1 lg:col-span-7 flex justify-center lg:justify-end perspective-1000">
        
        {/* The Card Container - 9:16 Aspect Ratio (Instagram Story) */}
        {/* We use a specific aspect ratio container, scaled down for preview but renders full res in canvas */}
        <div className="relative w-full max-w-[360px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 hover:rotate-y-2 hover:-rotate-x-2 border-2 border-primary/20">
          
          {/* 
            This inner div is what html2canvas captures. 
            We force absolute sizing to ensure the exported image is always perfectly 1080x1920 scaled by the canvas scale factor.
          */}
          <div 
            ref={cardRef}
            className={`absolute top-0 left-0 w-full h-full flex flex-col p-10 sm:p-12 ${
              selectedTheme === "marian" 
                ? "bg-gradient-to-br from-[#0B1224] via-[#101F4A] to-[#0B1224] text-[#FFFDF7]" 
                : "bg-gradient-to-br from-[#FFFDF7] via-[#FEF9E7] to-[#FFFDF7] text-[#0B1224]"
            }`}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Background effects */}
            <div className="absolute inset-0 opacity-30 noise-overlay pointer-events-none" />
            <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${
              selectedTheme === "marian" ? "bg-primary/20" : "bg-primary/30"
            }`} />
            <div className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
              selectedTheme === "marian" ? "bg-secondary/40" : "bg-primary/10"
            }`} />

            {/* Sacred Border Decor */}
            <div className={`absolute inset-4 sm:inset-5 border pointer-events-none ${
              selectedTheme === "marian" ? "border-primary/20" : "border-primary/30"
            }`} />
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-primary" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-primary" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary" />

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10">
              <Quote className={`w-12 h-12 mb-8 opacity-40 mx-auto ${
                selectedTheme === "marian" ? "text-primary" : "text-primary"
              }`} />
              
              <h2 className="font-cinzel font-bold text-2xl sm:text-3xl lg:text-4xl leading-relaxed mb-8">
                "{selectedQuote.text}"
              </h2>
              
              <div className="flex flex-col items-center">
                <div className={`w-12 h-1 rounded-full mb-4 ${
                  selectedTheme === "marian" ? "bg-primary" : "bg-primary"
                }`} />
                <p className="font-manrope font-bold uppercase tracking-[0.2em] text-sm sm:text-base opacity-90">
                  {selectedQuote.author}
                </p>
              </div>
            </div>

            {/* Footer / Watermark */}
            <div className="mt-auto relative z-10 flex flex-col items-center justify-center pt-8">
              <div className="flex items-center gap-2 opacity-60">
                <span className="text-xl">📿</span>
                <span className="font-cinzel font-bold tracking-[0.3em] uppercase text-xs">
                  {BRAND.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
