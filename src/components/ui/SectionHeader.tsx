import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, badge, icon, rightAction }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-2">
        {badge && (
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-bold bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30">
            {icon && <span className="w-3.5 h-3.5">{icon}</span>}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-sans font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {rightAction && <div className="self-start md:self-end flex-shrink-0">{rightAction}</div>}
    </div>
  );
}
