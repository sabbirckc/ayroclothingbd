'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Scissors,
  Shirt,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
          Transparent Fashion Marketplace
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-foreground">
          How ClothSpace Works
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          From artisanal loom to your doorstep—how our peer-to-peer apparel platform empowers boutique designers and conscious fashion lovers.
        </p>
      </div>

      {/* 4-Step Process Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            step: '01',
            title: 'Discover Unique Styles & Drops',
            desc: 'Browse our curated catalog of bespoke streetwear, Milanese wool blazers, raw denim bombers, and handcrafted knitwear directly listed by boutique creators.',
            icon: Compass,
            badge: 'Curation First',
          },
          {
            step: '02',
            title: 'Inspect Dynamic Sizes & Textiles',
            desc: 'Check detailed fabric compositions, genuine material origins (such as Mongolian cashmere or Japanese selvedge denim), and dynamic size availability.',
            icon: Scissors,
            badge: 'Textile Integrity',
          },
          {
            step: '03',
            title: 'Order with Atomic Stock Protection',
            desc: 'Place your order instantly with verified inventory deduction. Our platform eliminates out-of-stock cancellations and double-booking down to the millisecond.',
            icon: Shirt,
            badge: 'Zero Double-Booking',
          },
          {
            step: '04',
            title: 'Receive, Wear & Circulate',
            desc: 'Enjoy authentic garments packaged with designer care, complete with downloadable PDF order receipts and 7-day sizing exchange guarantees.',
            icon: Sparkles,
            badge: 'Hassle-Free Guarantee',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="p-8 rounded-3xl border border-border bg-card shadow-sm hover:border-rose-500/50 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-black text-rose-500">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-[11px] font-bold uppercase tracking-wider">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Designer & Buyer Guarantees */}
      <div className="p-8 sm:p-12 rounded-3xl bg-muted/30 border border-border space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            Platform Guarantees
          </h2>
          <p className="text-xs text-muted-foreground">
            We hold both creators and buyers to the highest standards of trust and craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h4 className="font-heading font-bold text-sm text-foreground">
              Authentic Fabrics Audit
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every seller profile is vetted to ensure only pure natural fibers, authentic vintage cuts, and genuine slow-fashion textiles.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <Lock className="w-6 h-6 text-blue-500" />
            <h4 className="font-heading font-bold text-sm text-foreground">
              Escrow & Buyer Protection
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Payments are held securely until delivery is confirmed and the fit has been verified against specifications.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <RotateCcw className="w-6 h-6 text-amber-500" />
            <h4 className="font-heading font-bold text-sm text-foreground">
              Direct Cancellations
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Buyers can cancel any pending order with a single click, instantly replenishing the designer&apos;s stock inventory.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="text-center py-8 space-y-4">
        <h3 className="font-heading font-black text-xl text-foreground">
          Ready to experience conscious designer fashion?
        </h3>
        <div className="flex justify-center gap-3">
          <Link
            href="/clothes"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md hover:from-rose-500 transition-all flex items-center gap-2"
          >
            <span>Explore Clothes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/add-cloth"
            className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold text-xs transition-colors"
          >
            <span>List Your Apparel</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

