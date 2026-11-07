'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClothCard, ClothItem } from '@/components/cloth-card';
import { ClothGridSkeleton } from '@/components/skeletons';
import { useWishlist } from '@/context/wishlist-context';
import { api } from '@/lib/api';
import {
  Shirt,
  Heart,
} from 'lucide-react';

function ClothesCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSubCategory = searchParams.get('subCategory') || searchParams.get('subcategory') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialWishlistOnly = searchParams.get('wishlist') === 'true';

  const { wishlistItems } = useWishlist();

  const [clothes, setClothes] = useState<ClothItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [subCategory, setSubCategory] = useState(initialSubCategory);
  const [selectedSize] = useState('all');
  const [sortBy] = useState('newest');
  const [wishlistOnly, setWishlistOnly] = useState(initialWishlistOnly);

  // Sync category, subCategory, search, or wishlist if searchParams change
  useEffect(() => {
    queueMicrotask(() => {
      const cat = searchParams.get('category') || 'all';
      const subCat = searchParams.get('subCategory') || searchParams.get('subcategory') || '';
      const s = searchParams.get('search') || '';
      const wl = searchParams.get('wishlist') === 'true';
      setCategory(cat);
      setSubCategory(subCat);
      setSearch(s);
      setWishlistOnly(wl);
    });
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
        if (subCategory && subCategory !== 'all') params.subCategory = subCategory;
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
}, [search, category, subCategory, selectedSize, sortBy, wishlistOnly, wishlistItems]);

return (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    {/* Grid Results or Skeleton */}
    {loading ? (
      <ClothGridSkeleton count={8} />
    ) : clothes.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clothes.map((cloth) => (
          <ClothCard key={cloth.id || cloth._id} item={cloth} />
        ))}
      </div>
    ) : wishlistOnly ? (
      /* Dedicated Wishlist Empty State */
      <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-8 h-8 fill-rose-500/20" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-lg text-foreground">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            You haven&apos;t saved any clothing pieces yet. Tap the heart icon on any piece to save it to your wishlist.
          </p>
        </div>
        <button
          onClick={() => {
            setWishlistOnly(false);
            router.push('/clothes');
          }}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-rose-600 transition-colors inline-flex items-center gap-2"
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Explore Designer Apparel</span>
        </button>
      </div>
    ) : (
      /* Catalog Empty State - No "Clear All Filters" button */
      <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto shadow-inner">
          <Shirt className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-lg text-foreground">
            No Apparel Matching Your Criteria
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            We couldn&apos;t find any designer pieces matching your current filters.
          </p>
        </div>
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

