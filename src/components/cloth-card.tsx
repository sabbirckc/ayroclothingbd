'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
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

  return (
    <div className="group relative flex flex-col h-full bg-white border border-black/15 hover:border-black/40 hover:shadow-md transition-all duration-300 overflow-hidden rounded-md text-black">
      {/* Image Container with portrait aspect ratio */}
      <div className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden">
        <Link href={`/clothes/${clothId}`} className="block w-full h-full">
          <img
            src={item.image || '/classic-shirt-1.jpg'}
            alt={item.title}
            onError={(e) => {
              const target = e.currentTarget;
              if (item.image && item.image.includes('/products/')) {
                const fallback = item.image.replace('/products/', '/');
                if (target.src !== fallback) {
                  target.src = fallback;
                  return;
                }
              }
              target.src = '/classic-shirt-1.jpg';
            }}
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
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${isSaved
            ? 'bg-black border-black text-white shadow-md'
            : 'bg-white/80 hover:bg-white border-black/15 text-black hover:text-black'
            }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-white' : 'text-black'}`} />
        </button>

        {/* Stock status overlay */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-black text-white text-[11px] font-bold uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        ) : Number(item.stock) <= 3 ? (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-black text-white shadow-sm">
              Only {item.stock} left!
            </span>
          </div>
        ) : null}
      </div>

      {/* Content Container below Image - Left-aligned matching reference */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 items-start text-left justify-between gap-1">
        {/* Title */}
        <Link href={`/clothes/${clothId}`} className="block w-full">
          <h3 className="font-heading font-medium text-xs sm:text-sm text-black hover:opacity-75 transition-opacity line-clamp-2 leading-snug">
            {item.title}
          </h3>
        </Link>

        {/* 5-Star Rating */}
        <div className="flex items-center gap-0.5 text-amber-400 my-0.5" aria-label={`Rating: ${item.rating || 0} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = Boolean(item.rating && (item.reviewsCount || 0) > 0 && star <= Math.round(item.rating));
            return (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  isFilled ? 'fill-amber-400 text-amber-400' : 'text-amber-400 fill-transparent'
                }`}
                strokeWidth={1.5}
              />
            );
          })}
        </div>

        {/* Price: ৳ */}
        <div className="pt-0.5">
          <span className="font-bold text-xs sm:text-sm text-black font-sans">
            ৳ {currentPrice.toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </div>
  );
}
