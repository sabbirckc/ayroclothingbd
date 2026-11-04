'use client';

import React from 'react';
import Link from 'next/link';

export function AyroLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const circleSizes = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-10 h-10 text-[11px]',
    lg: 'w-16 h-16 text-[15px]',
  };

  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Circular Cream Badge Logo matching @ayroclothingbd */}
      <div
        className={`${circleSizes[size]} rounded-full bg-[#F5EFEB] dark:bg-stone-900 border border-[#E3DAC9] dark:border-stone-700 flex flex-col items-center justify-center text-stone-900 dark:text-stone-100 shadow-sm group-hover:scale-105 transition-transform duration-200 select-none shrink-0`}
      >
        <span className="font-serif tracking-[0.22em] font-semibold pl-[0.22em] leading-tight">
          AYRO
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-heading font-black tracking-tight text-xl leading-none text-foreground">
            AYRO
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono font-medium">
            ClothSpace
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mt-0.5">
          Timeless Essential
        </span>
      </div>
    </Link>
  );
}
