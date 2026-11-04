'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface Slide {
  image: string;
  badge: string;
  headline: string;
  subtext: string;
  tag: string;
}

const slides: Slide[] = [
  {
    image: '/image-10.jpg',
    badge: 'AYRO Campaign Drop',
    headline: "Let's Go With AYRO — Timeless Essential Collection",
    subtext: 'Masterfully tailored button-downs and pinstripe pieces engineered with pure breathable cotton and precision collar architecture.',
    tag: '100% Pure Cotton',
  },
  {
    image: '/home-1.jpg',
    badge: 'Artisanal Menswear Tailoring',
    headline: 'Bespoke Textures, Mother-of-Pearl Buttons & Subtle Stripes',
    subtext: 'Every garment is tailored with enduring craftsmanship, French seams, and verified premium textiles.',
    tag: 'AYRO Verified Atelier',
  },
  {
    image: '/image-9.jpg',
    badge: 'Tailored Essentials',
    headline: 'Premium Button-Downs for Boardrooms, Weekends & Occasions',
    subtext: 'Discover transparent sizing, zero double-booking inventory, and authentic clothing directly from AYRO.',
    tag: 'Guaranteed Authentic Weaves',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl bg-slate-950 text-white shadow-2xl min-h-[460px] md:min-h-[540px] flex items-center group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 7s ease-out' }}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-2xl space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{slides[current].badge}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-[11px] text-white/80">{slides[current].tag}</span>
          </div>

          {/* Punchy Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            {slides[current].headline}
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200/90 leading-relaxed font-light">
            {slides[current].subtext}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/clothes"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-sm font-bold shadow-lg hover:shadow-rose-500/25 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <span>Explore Clothes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/add-cloth"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <Tag className="w-4 h-4 text-amber-400" />
              <span>List Your Apparel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === current ? 'w-8 h-2 bg-rose-500' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

