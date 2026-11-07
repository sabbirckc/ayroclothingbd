'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Heart, ArrowUpRight } from 'lucide-react';
import { useWishlist } from '@/context/wishlist-context';

export interface ClothItem {
  id: string;
  _id?: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  sizes?: string[];
  fabric: string;
  brandOrigin?: string;
  image: string;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  overview?: string;
  ownerName?: string;
}

export function ClothCard({ item }: { item: ClothItem }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const clothId = item.id || item._id || '';
  const isSaved = isInWishlist(clothId);

  const isOutOfStock = Number(item.stock) <= 0;

  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-border/80 bg-card hover:border-[#1C3B27]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Container with fixed uniform aspect ratio */}
      <div className="relative w-full aspect-[4/5] bg-muted overflow-hidden">
        <img
          src={item.image || '/image-1.jpg'}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Shade on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Heart Button top-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(item);
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isSaved
            ? 'bg-[#1C3B27] border-[#1C3B27] text-white shadow-md'
            : 'bg-background/80 hover:bg-background border-border text-muted-foreground hover:text-[#1C3B27]'
            }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Stock status overlay */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        ) : Number(item.stock) <= 3 ? (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-500/90 text-white backdrop-blur-sm">
              Only {item.stock} left!
            </span>
          </div>
        ) : null}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        {/* Title & Star Rating */}
        <div className="flex items-center justify-between gap-2">
          <Link href={`/clothes/${clothId}`} className="block flex-1 min-w-0">
            <h3 className="font-heading font-bold text-base text-foreground group-hover:text-[#1C3B27] transition-colors line-clamp-1">
              {item.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px] shrink-0">
            <Star className="w-3 h-3 fill-current" />
            <span>{Number(item.rating || 4.9).toFixed(1)}</span>
          </div>
        </div>

        {/* Footer: Price & View Details Button */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
          <span className="font-heading text-lg font-black text-foreground">
            ${Number(item.price).toFixed(0)}
          </span>

          <Link
            href={`/clothes/${clothId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#1C3B27] text-white hover:bg-[#152e1e] hover:text-white transition-all shadow-sm"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
      );
}

