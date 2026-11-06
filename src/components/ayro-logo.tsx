'use client';

import React from 'react';
import Link from 'next/link';

export function AyroLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('reset-home-view'));
    }
  };

  const iconSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
  };

  const svgSizes = {
    sm: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  };

  return (
    <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0">
      {/* Clean Hanger Icon Emblem */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0 border border-border`}
      >
        <svg
          className={`${svgSizes[size]} fill-none stroke-current`}
          viewBox="0 0 24 24"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Modern Coat Hanger */}
          <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1L3.5 13a2 2 0 0 0 1.2 3.5h14.6a2 2 0 0 0 1.2-3.5L14.2 7.1A3 3 0 0 0 15 5a3 3 0 0 0-3-3z" />
          <line x1="4" y1="16.5" x2="20" y2="16.5" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="font-heading font-black tracking-tight text-lg sm:text-xl leading-none text-foreground">
            AYRO
          </span>
          <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md bg-muted text-foreground font-sans font-bold tracking-tight border border-border">
            ClothingBD
          </span>
        </div>
        <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-muted-foreground font-semibold mt-1">
          Timeless Essential
        </span>
      </div>
    </Link>
  );
}
