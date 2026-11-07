'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';

import { toast } from 'sonner';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Shirt,



} from 'lucide-react';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const redirectedRef = React.useRef(false);

  useEffect(() => {
    if (!authLoading && !user && !redirectedRef.current) {
      redirectedRef.current = true;
      toast.error('Please log in to view your clothing listings.', { id: 'auth-required' });
      router.replace('/login?redirect=/my-listings');
    }
  }, [user, authLoading, router]);

  const fetchMyListings = async () => {
    try {
      const res = await api.get('/api/clothes/my-listings');
      if (res.success && Array.isArray(res.data)) {
        setListings(res.data);
      }
    } catch (err: unknown) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (user) {
      queueMicrotask(() => {
        if (!ignore) {
          fetchMyListings();
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [user]);

  const handleDeletePrompt = (item: any) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      setDeleting(true);
      const itemId = selectedItem.id || selectedItem._id;
      const res = await api.delete(`/api/clothes/${itemId}`);

      if (res.success) {
        toast.success(`"${selectedItem.title}" has been permanently deleted.`);
        setListings((prev) => prev.filter((i) => (i.id || i._id) !== itemId));
        setDeleteModalOpen(false);
        setSelectedItem(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete clothing piece.');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-heading font-black text-xl text-foreground">
              Sign In to Manage Listings
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Please sign in to your AYRO designer account to manage your atelier pieces, pricing, and stock inventory.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <Link
              href="/login?redirect=/my-listings"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all text-center"
            >
              Sign In to AYRO
            </Link>
            <Link
              href="/clothes"
              className="px-5 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground font-semibold text-xs transition-colors text-center"
            >
              Explore Apparel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Designer Dashboard</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            My Clothing Listings
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your atelier pieces, edit pricing and stock, or publish new apparel.
          </p>
        </div>

        <Link
          href="/add-cloth"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md hover:shadow-rose-500/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Clothing</span>
        </Link>
      </div>

      {/* Table / Card List */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile Card View (screens < lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {listings.map((item) => {
              const itemId = item.id || item._id;
              const isLow = Number(item.stock) <= 2;
              return (
                <div
                  key={itemId}
                  className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3 hover:border-border/80 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image || '/image-1.jpg'}
                      alt={item.title}
                      className="w-16 h-20 rounded-xl object-cover shrink-0 border border-border"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-semibold text-foreground border border-border">
                        {item.category}
                      </span>
                      <Link
                        href={`/clothes/${itemId}`}
                        className="font-heading font-bold text-sm text-foreground hover:text-[#1C3B27] transition-colors line-clamp-1 block pt-0.5"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {item.fabric}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-heading font-black text-sm text-foreground">
                          ${Number(item.price).toFixed(0)}
                        </span>
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${isLow
                            ? 'bg-rose-500/10 text-rose-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                            }`}
                        >
                          {item.stock} left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 gap-2">
                    <div className="flex gap-1 flex-wrap">
                      {item.sizes && item.sizes.length > 0 ? (
                        item.sizes.slice(0, 4).map((s: string) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded border border-border/80 bg-muted/30 text-[10px] font-mono text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-[10px]">-</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/clothes/${itemId}`}
                        title="View details"
                        className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/clothes/edit/${itemId}`}
                        title="Edit piece"
                        className="p-1.5 rounded-lg border border-border hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeletePrompt(item)}
                        title="Delete piece"
                        className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-[#1C3B27] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (screens >= lg) */}
          <div className="hidden lg:block rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 sm:px-6">Apparel Piece</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Sizes</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {listings.map((item) => {
                    const itemId = item.id || item._id;
                    const isLow = Number(item.stock) <= 2;
                    return (
                      <tr key={itemId} className="hover:bg-muted/20 transition-colors">
                        {/* Apparel Info */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || '/image-1.jpg'}
                              alt={item.title}
                              className="w-12 h-14 rounded-xl object-cover shrink-0 border border-border"
                            />
                            <div className="min-w-0">
                              <Link
                                href={`/clothes/${itemId}`}
                                className="font-heading font-bold text-sm text-foreground hover:text-[#1C3B27] transition-colors line-clamp-1"
                              >
                                {item.title}
                              </Link>
                              <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                                Fabric: {item.fabric}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-muted text-[11px] font-semibold text-foreground border border-border">
                            {item.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 font-heading font-black text-sm text-foreground">
                          ${Number(item.price).toFixed(0)}
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${isLow
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-emerald-500/10 text-emerald-600'
                              }`}
                          >
                            {item.stock} left
                          </span>
                        </td>

                        {/* Sizes */}
                        <td className="py-4 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {item.sizes && item.sizes.length > 0 ? (
                              item.sizes.map((s: string) => (
                                <span
                                  key={s}
                                  className="px-1.5 py-0.5 rounded border border-border/80 bg-muted/30 text-[10px] font-mono"
                                >
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-[11px]">-</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/clothes/${itemId}`}
                              title="View public details"
                              className="p-2 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <Link
                              href={`/clothes/edit/${itemId}`}
                              title="Edit piece"
                              className="p-2 rounded-lg border border-border hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeletePrompt(item)}
                              title="Delete piece"
                              className="p-2 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-[#1C3B27] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Shirt className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading font-bold text-lg text-foreground">
              No Clothing Listings Yet
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You haven&apos;t published any designer clothing or wardrobe pieces. Share your craftsmanship with the ClothSpace community today!
            </p>
          </div>
          <Link
            href="/add-cloth"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold shadow-md hover:from-rose-500 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Your First Clothing Piece</span>
          </Link>
        </div>
      )}

      {/* Custom Confirmation Modal Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Clothing Listing"
        itemName={selectedItem?.title || ''}
        isDeleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

