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
    <div className="group relative flex flex-col h-full rounded-2xl border border-border/80 bg-card hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
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

        {/* Category Badge top-left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-full bg-background/90 backdrop-blur-md text-foreground border border-border shadow-sm">
            {item.category}
          </span>
        </div>

        {/* Wishlist Heart Button top-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(item);
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isSaved
              ? 'bg-rose-600 border-rose-600 text-white shadow-md'
              : 'bg-background/80 hover:bg-background border-border text-muted-foreground hover:text-rose-500'
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
        <div>
          {/* Origin / Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="truncate max-w-[65%] font-medium">
              {item.brandOrigin || 'Boutique Atelier'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{Number(item.rating || 4.9).toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/clothes/${clothId}`} className="block">
            <h3 className="font-heading font-bold text-base text-foreground group-hover:text-rose-600 transition-colors line-clamp-1">
              {item.title}
            </h3>
          </Link>

          {/* Fabric details */}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            <span className="font-medium text-foreground/80">Fabric:</span> {item.fabric}
          </p>

          {/* Available Sizes preview */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Sizes:</span>
              <div className="flex items-center gap-1">
                {item.sizes.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-1.5 py-0.5 rounded border border-border/80 bg-muted/40 font-mono text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
                {item.sizes.length > 4 && (
                  <span className="text-[9px] text-muted-foreground">+{item.sizes.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Price & View Details Button */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Price</span>
            <span className="font-heading text-lg font-black text-foreground">
              ${Number(item.price).toFixed(0)}
            </span>
          </div>

          <Link
            href={`/clothes/${clothId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-rose-600 hover:text-white transition-all shadow-sm"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

