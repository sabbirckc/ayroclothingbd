'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Compass, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-background text-foreground">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Creative Hanger / Needle Illustration */}
        <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-500/20 blur-xl animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl border-2 border-border bg-card shadow-2xl flex items-center justify-center">
            {/* Custom SVG Hanger & Broken Stitch Art */}
            <svg
              className="w-16 h-16 text-rose-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1L3.5 13a2 2 0 0 0 1.2 3.5h14.6a2 2 0 0 0 1.2-3.5L14.2 7.1A3 3 0 0 0 15 5a3 3 0 0 0-3-3z" />
              <line x1="12" y1="5" x2="12" y2="7" strokeDasharray="1 1" />
              <line x1="8" y1="14" x2="16" y2="14" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-xs shadow-md">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground">
            Wardrobe Piece Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            The clothing piece, designer studio, or route you are looking for has been tucked away, sold out, or moved to another rack in our atelier.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg hover:shadow-rose-500/25 flex items-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/clothes"
            className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4 text-rose-500" />
            <span>Explore Clothes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

