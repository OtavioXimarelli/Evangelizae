import React from 'react';
import { Card } from '@heroui/react';

interface EditorialCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'accent' | 'liturgical';
}

export function EditorialCard({ children, className = '', onClick, variant = 'default' }: EditorialCardProps) {
  const variantStyles = {
    default: 'bg-white/95 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:border-sacred-gold/60 hover:shadow-md text-slate-900 dark:text-white backdrop-blur-md',
    accent: 'bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/40 dark:border-amber-500/50 shadow-sm gold-glow text-slate-900 dark:text-white backdrop-blur-md',
    liturgical: 'cathedral-gradient text-white border border-white/15 shadow-xl'
  };

  return (
    <Card
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`w-full rounded-2xl p-6 sm:p-7 transition-all duration-300 ${variantStyles[variant]} ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </Card>
  );
}
