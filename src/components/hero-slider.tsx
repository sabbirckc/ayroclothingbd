'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  href?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/home-1.jpg',
    alt: 'AYRO Timeless Essentials Collection',
    href: '/clothes',
  },
  {
    id: 2,
    image: '/image-10.jpg',
    alt: 'Breathable Combed Cotton Series',
    href: '/clothes',
  },
  {
    id: 3,
    image: '/image-9.jpg',
    alt: 'Artisanal Tailoring & Heritage Weaves',
    href: '/clothes',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div
      id="hero-banner"
      className="relative w-full h-[360px] xs:h-[420px] sm:h-[520px] md:h-[600px] lg:h-[660px] overflow-hidden bg-muted select-none group"
    >
      {/* Slides crossfade */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <Link
            key={slide.id}
            href={slide.href || '/clothes'}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
          </Link>
        );
      })}

      {/* Manual Navigation Arrows (Discreet on hover) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Discreet bottom indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
              current === i ? 'w-7 sm:w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
