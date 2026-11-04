'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClothCard, ClothItem } from '@/components/cloth-card';
import { ClothGridSkeleton } from '@/components/skeletons';
import { useWishlist } from '@/context/wishlist-context';
import { api } from '@/lib/api';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Shirt,
  X,
  Sparkles,
  Heart,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

function ClothesCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialWishlistOnly = searchParams.get('wishlist') === 'true';

  const { wishlistItems, wishlistIds } = useWishlist();

  const [clothes, setClothes] = useState<ClothItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [wishlistOnly, setWishlistOnly] = useState(initialWishlistOnly);

  const categories = [
    'all',
    'Streetwear',
    'Formal Wear',
    'Casual Essentials',
    'Vintage & Retro',
    'Handcrafted Knitwear',
  ];

  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Sync category or wishlist if searchParams change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const wl = searchParams.get('wishlist') === 'true';
    setWishlistOnly(wl);
  }, [searchParams]);

  useEffect(() => {
    async function fetchClothes() {
      if (wishlistOnly) {
        setClothes(wishlistItems);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (category && category !== 'all') params.category = category;
        if (selectedSize && selectedSize !== 'all') params.size = selectedSize;
        if (sortBy) params.sortBy = sortBy;

        const res = await api.get('/api/clothes', { params });
        if (res.success && Array.isArray(res.data)) {
          setClothes(res.data);
        }
      } catch (err) {
        console.error('Error fetching apparel catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchClothes();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category, selectedSize, sortBy, wishlistOnly, wishlistItems]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setSelectedSize('all');
    setSortBy('newest');
    setWishlistOnly(false);
    router.push('/clothes');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shirt className="w-3.5 h-3.5" />
            <span>Designer Marketplace</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground">
            {wishlistOnly ? 'Your Saved Fashion Wishlist' : 'Explore Designer Apparel'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {wishlistOnly
              ? `Reviewing your ${wishlistIds.length} favorited pieces.`
              : 'Discover bespoke evening wear, handcrafted knitwear, and architectural streetwear.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          {wishlistOnly && (
            <button
              onClick={() => {
                setWishlistOnly(false);
                router.push('/clothes');
              }}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-accent flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All Clothes</span>
            </button>
          )}
          <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg">
            {clothes.length} {clothes.length === 1 ? 'Piece' : 'Pieces'} Found
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 bg-card p-4 sm:p-6 rounded-2xl border border-border/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, fabric, origin..."
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Size Dropdown */}
          <div>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground font-medium"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Sizes (S, M, L...)' : `Size: ${s}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground font-medium"
            >
              <option value="newest">Sort: Newest Drops First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated Tailors</option>
              <option value="popular">Most Popular Pieces</option>
            </select>
          </div>
        </div>

        {/* Quick Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}

          {(category !== 'all' || selectedSize !== 'all' || search || sortBy !== 'newest') && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-rose-600 hover:text-rose-500 underline font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Results or Skeleton */}
      {loading ? (
        <ClothGridSkeleton count={8} />
      ) : clothes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clothes.map((cloth) => (
            <ClothCard key={cloth.id || cloth._id} item={cloth} />
          ))}
        </div>
      ) : (
        /* Empty State with Friendly CTA */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Shirt className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading font-bold text-lg text-foreground">
              No Apparel Matching Your Criteria
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We couldn't find any designer pieces matching your current filters. Try expanding your search terms or clearing selected tags.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-rose-600 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClothesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12"><ClothGridSkeleton count={8} /></div>}>
      <ClothesCatalogContent />
    </Suspense>
  );
}
