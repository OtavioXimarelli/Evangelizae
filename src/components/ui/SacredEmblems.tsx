import React from 'react';

/**
 * Custom Sacred Vector Emblems for Evangelizae
 * Delivers an authentic Catholic visual identity with Gothic architecture,
 * gold filigree, stained glass geometry, and sacred emblems.
 */

export function RoseWindowMotif({ className = 'w-12 h-12 text-sacred-gold' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="1.5" />
      
      {/* 8 Petal Sacred Rosette */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 50 50)`}>
          <path d="M50 10 C42 26 42 38 50 50 C58 38 58 26 50 10Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" />
          <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <circle cx="50" cy="18" r="2" fill="currentColor" />
        </g>
      ))}
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

export function GothicArchFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-t-[5rem] rounded-b-3xl border border-amber-500/25 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 dark:from-slate-950/95 dark:to-slate-900/90 shadow-xl backdrop-blur-md ${className}`}>
      {/* Subtle Arch Highlight Arc */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-b from-amber-400/15 to-transparent blur-xl pointer-events-none" />
      {/* Golden Corner Accents */}
      <div className="absolute top-3 left-4 text-sacred-gold/40 text-xs select-none">❖</div>
      <div className="absolute top-3 right-4 text-sacred-gold/40 text-xs select-none">❖</div>
      {children}
    </div>
  );
}

export function GoldFiligreeDivider({ className = 'my-6' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-sacred-gold/60 select-none ${className}`}>
      <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-sacred-gold/40" />
      <span className="text-xs tracking-widest font-serif text-sacred-gold/80">❖ ─── ✝ ─── ❖</span>
      <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-sacred-gold/40" />
    </div>
  );
}

export function SacredRosaryEmblem({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="20" r="14" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      {/* Cross Spire hanging from Rosary */}
      <path d="M24 34 V44 M20 38 H28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Halo Glow Beads */}
      <circle cx="24" cy="6" r="2.5" fill="currentColor" />
      <circle cx="38" cy="20" r="2.5" fill="currentColor" />
      <circle cx="10" cy="20" r="2.5" fill="currentColor" />
      <circle cx="34" cy="30" r="2.5" fill="currentColor" />
      <circle cx="14" cy="30" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function SacredScriptureEmblem({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Open Book */}
      <path d="M8 12C14 10 20 12 24 15C28 12 34 10 40 12V36C34 34 28 36 24 38C20 36 14 34 8 36V12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="24" y1="15" x2="24" y2="38" stroke="currentColor" strokeWidth="2" />
      {/* Chi Rho / Cross Motif */}
      <path d="M16 22H20 M18 19V27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 22H32 M30 19V27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IntercessionCandleEmblem({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Candle Pillar */}
      <rect x="18" y="22" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
      {/* Flame & Radiant Rays */}
      <path d="M24 6 C21 12 21 16 24 20 C27 16 27 12 24 6 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="13" r="1.5" fill="#FFF" />
      <line x1="24" y1="2" x2="24" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="16" y1="10" x2="18" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="32" y1="10" x2="30" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function CathedralSpireEmblem({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Gothic Arch Façade */}
      <path d="M12 42 V24 L24 8 L36 24 V42 H12 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Central Spire Cross */}
      <path d="M24 2 V8 M21 5 H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Gothic Rose Portal */}
      <circle cx="24" cy="22" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 42 V32 C20 29.8 21.8 28 24 28 C26.2 28 28 29.8 28 32 V42" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
