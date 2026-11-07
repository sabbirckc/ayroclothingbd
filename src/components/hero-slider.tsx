'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  href?: string;
  position?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/hero-banner.jpg',
    alt: 'AYRO Timeless Essentials - Men\'s Fashion',
    href: '/clothes',
  },
  {
    id: 2,
    image: '/hero-banner-2.jpg',
    alt: 'AYRO Premium Button-Down Shirt Collection',
    href: '/clothes',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
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
      className="relative w-full aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/8] md:aspect-[2.4/1] min-h-[340px] xs:min-h-[400px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[640px] xl:min-h-[720px] max-h-[820px] overflow-hidden bg-neutral-900/5 dark:bg-neutral-950 select-none group"
    >
      {/* Slides crossfade */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <Link
            key={slide.id}
            href={slide.href || '/clothes'}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center select-none"
            />
          </Link>
        );
      })}

      {/* Manual Navigation Arrows (Only shown when there are multiple slides) */}
      {HERO_SLIDES.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Discreet bottom indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-sm">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${current === i ? 'w-7 sm:w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
              />
            ))}
          </div>
        </>
  )
}
    </div >
  );
}
