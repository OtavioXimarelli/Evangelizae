import React from 'react';

interface EditorialCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'accent' | 'liturgical';
}

export function EditorialCard({ children, className = '', onClick, variant = 'default' }: EditorialCardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-sacred-gold/50 hover:shadow-md text-slate-900 dark:text-white',
    accent: 'bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 shadow-sm gold-glow text-slate-900 dark:text-white',
    liturgical: 'cathedral-gradient text-white border border-white/10 shadow-lg'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 transition-all duration-300 ${variantStyles[variant]} ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
