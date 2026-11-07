'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
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

  const currentPrice = Number(item.price) || 0;

  const formattedPrice = currentPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="group relative flex flex-col h-full bg-card border border-border/60 hover:border-[#1C3B27]/30 hover:shadow-md transition-all duration-300 overflow-hidden rounded-md">
      {/* Image Container with portrait aspect ratio */}
      <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
        <Link href={`/clothes/${clothId}`} className="block w-full h-full">
          <img
            src={item.image || '/image-1.jpg'}
            alt={item.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Button top-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(item);
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isSaved
            ? 'bg-[#1C3B27] border-[#1C3B27] text-white shadow-md'
            : 'bg-white/80 hover:bg-white border-border/60 text-muted-foreground hover:text-[#1C3B27]'
            }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Stock status overlay */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        ) : Number(item.stock) <= 3 ? (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/95 text-white shadow-sm">
              Only {item.stock} left!
            </span>
          </div>
        ) : null}
      </div>

      {/* Content Container below Image */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 items-center text-center justify-between gap-1.5">
        {/* Quick View Red Button/Link */}
        <Link
          href={`/clothes/${clothId}`}
          className="text-[#E51B24] hover:text-red-700 font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors pt-1 block"
        >
          QUICK VIEW
        </Link>

        {/* Title */}
        <Link href={`/clothes/${clothId}`} className="block w-full">
          <h3 className="font-heading font-medium text-xs sm:text-sm text-foreground/90 hover:text-[#1C3B27] transition-colors line-clamp-1">
            {item.title}
          </h3>
        </Link>

        {/* Price: Current TK */}
        <div className="pt-0.5">
          <span className="font-bold text-xs sm:text-sm text-foreground">
            TK {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
}

