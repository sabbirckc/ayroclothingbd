'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: any[];
  isInWishlist: (clothId: string) => boolean;
  toggleWishlist: (cloth: any) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  wishlistItems: [],
  isInWishlist: () => false,
  toggleWishlist: async () => { },
  loading: false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setWishlistIds([]);
        setWishlistItems([]);
      });
      return;
    }

    async function fetchWishlist() {
      try {
        setLoading(true);
        const res = await api.get('/api/wishlist');
        if (res.success) {
          setWishlistIds(res.ids || []);
          setWishlistItems(res.data || []);
        }
      } catch (err) {
        // Silently catch or handle
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [user]);

  const isInWishlist = (clothId: string) => {
    return wishlistIds.includes(clothId);
  };

  const toggleWishlist = async (cloth: any) => {
    if (!user) {
      toast.error('Please log in to save apparel to your wishlist.');
      return;
    }

    const clothId = cloth.id || cloth._id;
    const exists = isInWishlist(clothId);

    // Optimistic update
    if (exists) {
      setWishlistIds(prev => prev.filter(id => id !== clothId));
      setWishlistItems(prev => prev.filter(item => (item.id || item._id) !== clothId));
    } else {
      setWishlistIds(prev => [...prev, clothId]);
      setWishlistItems(prev => [...prev, cloth]);
    }

    try {
      const res = await api.post('/api/wishlist/toggle', { clothId });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err: any) {
      // Revert on error
      if (exists) {
        setWishlistIds(prev => [...prev, clothId]);
        setWishlistItems(prev => [...prev, cloth]);
      } else {
        setWishlistIds(prev => prev.filter(id => id !== clothId));
        setWishlistItems(prev => prev.filter(item => (item.id || item._id) !== clothId));
      }
      toast.error(err.message || 'Failed to update wishlist.');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

