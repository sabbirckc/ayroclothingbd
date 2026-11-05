'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe2,
  Users,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 max-w-5xl">
      {/* Hero Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
          Our Story & Philosophy
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground">
          About ClothSpace
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Championing independent clothing designers, artisanal ateliers, and sustainable wardrobe circularity since 2026.
        </p>
      </div>

      {/* Narrative & Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="font-heading font-black text-2xl text-foreground">
            A New Horizon for Independent Apparel
          </h2>
          <p>
            Mass production fashion has diluted the artistry of garments. ClothSpace was founded on a simple conviction: the most exquisite clothing in the world is created by independent makers, boutique tailors, and passionate collectors.
          </p>
          <p>
            Whether it is an oversized 480 GSM French Terry streetwear hoodie, a hand-stitched Milanese wool blazer, or a vintage Japanese selvedge bomber jacket, every piece on our platform is a celebration of textile integrity and enduring design.
          </p>
          <p>
            By establishing peer-to-peer relationships between designers and clothing enthusiasts, we eliminate excessive markups, provide fair remuneration for creative craftsmanship, and cultivate a community that values garments as art.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border shadow-2xl aspect-[4/3] bg-muted relative">
          <img
            src="/home-1.jpg"
            alt="ClothSpace Atelier"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-300">
              The Artisan Atelier
            </span>
            <p className="text-base font-black mt-1">
              &ldquo;We don&apos;t manufacture trends. We circulate masterpieces.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="font-heading font-black text-2xl text-foreground">
            Our Core Principles
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-foreground">
              Conscious Circularity
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We extend the lifespan of designer fashion through transparent sharing, authentic resale, and mindful consumption.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-foreground">
              Creator Empowerment
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Direct access to patrons worldwide with zero retailer commissions, giving designers the autonomy they deserve.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-foreground">
              Fabric Authenticity
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zero tolerance for counterfeit materials or deceptive synthetic blends. Every listing is verified by textile specialists.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/5 p-8 sm:p-12 text-center space-y-4">
        <h3 className="font-heading font-black text-2xl text-foreground">
          Join the ClothSpace Revolution
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Explore our collection or list your own apparel pieces today.
        </p>
        <Link
          href="/clothes"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 text-white font-bold text-xs shadow-md transition-all"
        >
          <span>Explore All Apparel</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

