'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Shirt, Tag, Scissors } from 'lucide-react';

interface SlideData {
  id: number;
  badge: string;
  badgeIcon: any;
  headline: string;
  subtext: string;
  image: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    badge: 'AYRO Timeless Essentials',
    badgeIcon: Sparkles,
    headline: 'High-Performance Designer Apparel for Visionary Creators',
    subtext: 'Discover pristine tailored shirts, handcrafted textures, and architectural silhouettes with transparent pricing and real-time inventory.',
    image: '/home-1.jpg',
    primaryCtaText: 'Explore Clothes',
    primaryCtaLink: '/clothes',
    secondaryCtaText: 'List Your Apparel',
    secondaryCtaLink: '/add-cloth',
  },
  {
    id: 2,
    badge: '100% Breathable Combed Cotton',
    badgeIcon: Shirt,
    headline: 'Premium Button-Downs for Boardrooms, Weekends & Occasions',
    subtext: 'Discover transparent sizing, zero double-booking inventory, and authentic clothing directly from AYRO.',
    image: '/image-10.jpg',
    primaryCtaText: 'Explore Collection',
    primaryCtaLink: '/clothes?category=Formal%20Wear',
    secondaryCtaText: 'List Your Apparel',
    secondaryCtaLink: '/add-cloth',
  },
  {
    id: 3,
    badge: 'Artisanal Tailoring & Heritage Weaves',
    badgeIcon: Scissors,
    headline: 'Bespoke Textures, Mother-of-Pearl Buttons & Subtle Pinstripes',
    subtext: 'Every stitch tells a story. Connect directly with boutique creators and experience craftsmanship untainted by mass production.',
    image: '/image-9.jpg',
    primaryCtaText: 'Explore All Apparel',
    primaryCtaLink: '/clothes',
    secondaryCtaText: 'List Your Apparel',
    secondaryCtaLink: '/add-cloth',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[current];
  const ActiveIcon = activeSlide.badgeIcon;

  return (
    <div
      id="hero-banner"
      className="scroll-mt-20 relative w-full min-h-[440px] h-[calc(100vh-5rem)] max-h-[660px] overflow-hidden bg-black select-none"
    >
      {/* Background Images Crossfade */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Dark Cinematic Gradients matching StudioSpace */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        );
      })}

      {/* Active Slide Text Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-10 sm:pb-0 z-10">
        <div
          key={activeSlide.id}
          className="max-w-2xl space-y-3 sm:space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-forwards"
        >
          {/* Feature Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider max-w-[95%] truncate">
            <ActiveIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{activeSlide.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-black text-xl xs:text-2xl sm:text-4xl lg:text-6xl text-white tracking-tight leading-snug sm:leading-[1.1]">
            {activeSlide.headline}
          </h1>

          {/* Subtext */}
          <p className="text-xs sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none">
            {activeSlide.subtext}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <Link
              href={activeSlide.primaryCtaLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-white/90 shadow-lg hover:shadow-white/20 transition-all group"
            >
              <span>{activeSlide.primaryCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={activeSlide.secondaryCtaLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all"
            >
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{activeSlide.secondaryCtaText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 items-center justify-center transition-all cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 items-center justify-center transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Navigation Indicators */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              current === i ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
