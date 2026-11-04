'use client';

import React from 'react';
import Link from 'next/link';

export function AyroLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const iconSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    const svgSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return(
        < Link href = "/" className = "flex items-center gap-2.5 group" >
          {/* Clean Hanger Icon Emblem */ }
          < div
  className = {`${iconSizes[size]} rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0 border border-border`
}
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
      </div >

  <div className="flex flex-col">
    <div className="flex items-center gap-1.5">
      <span className="font-heading font-black tracking-tight text-xl leading-none text-foreground">
        AYRO
      </span>
        <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground font-sans font-bold tracking-tight border border-border">
          ClothingBD
        </span>
    </div>
    <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mt-0.5">
      Timeless Essential
    </span>
  </div>
    </Link >
  );
}
