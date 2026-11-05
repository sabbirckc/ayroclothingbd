'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/context/wishlist-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Package,
  ShoppingBag,
  Heart,
  Shirt,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface DashboardListing {
  id?: string;
  _id?: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface DashboardOrder {
  id?: string;
  _id?: string;
  clothTitle: string;
  clothImage?: string;
  clothPrice?: number;
  totalPrice?: number;
  size: string;
  quantity: number;
  status: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { wishlistIds } = useWishlist();

  const [listings, setListings] = useState<DashboardListing[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [catalogCount, setCatalogCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please log in to access your designer dashboard.');
      router.push('/login?redirect=/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        setLoading(true);
        const [listingsRes, ordersRes, clothesRes] = await Promise.all([
          api.get('/api/clothes/my-listings').catch(() => ({ success: false, data: [] })),
          api.get('/api/orders/my-orders').catch(() => ({ success: false, data: [] })),
          api.get('/api/clothes').catch(() => ({ success: false, data: [] }))
        ]);

        if (listingsRes.success && Array.isArray(listingsRes.data)) {
          setListings(listingsRes.data);
        }
        if (ordersRes.success && Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data);
        }
        if (clothesRes.success && Array.isArray(clothesRes.data)) {
          setCatalogCount(clothesRes.data.length);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const recentListings = listings.slice(0, 4);
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome & Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-card via-card to-muted/30 border border-border/80 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || '/client-review-1.jpg'}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-rose-500/20 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{user.role === 'designer' ? 'Master Artisan' : 'Fashion Collector'}</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-muted-foreground truncate max-w-sm sm:max-w-md">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0">
          <Link
            href="/add-cloth"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md hover:shadow-rose-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Clothing</span>
          </Link>
          <Link
            href="/clothes"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold text-xs transition-colors"
          >
            <Shirt className="w-4 h-4 text-muted-foreground" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Listings Count */}
        <Link
          href="/my-listings"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-rose-500/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {loading ? '...' : listings.length}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">My Clothing Listings</p>
        </Link>

        {/* Orders Count */}
        <Link
          href="/my-orders"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-emerald-500/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {loading ? '...' : orders.length}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">My Orders & Receipts</p>
        </Link>

        {/* Wishlist Count */}
        <Link
          href="/clothes?wishlist=true"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-pink-500/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {wishlistIds.length}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Saved Wishlist Pieces</p>
        </Link>

        {/* Marketplace Items Count */}
        <Link
          href="/clothes"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-blue-500/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground">
            {loading ? '...' : catalogCount}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Marketplace Catalog</p>
        </Link>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/add-cloth"
          className="p-4 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-rose-500/30 transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">Add New Clothing</p>
            <p className="text-[11px] text-muted-foreground truncate">Publish a designer garment</p>
          </div>
        </Link>

        <Link
          href="/my-listings"
          className="p-4 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-amber-500/30 transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">Manage Listings</p>
            <p className="text-[11px] text-muted-foreground truncate">Edit stock, sizes & prices</p>
          </div>
        </Link>

        <Link
          href="/my-orders"
          className="p-4 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-emerald-500/30 transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">My Orders</p>
            <p className="text-[11px] text-muted-foreground truncate">Track deliveries & PDF invoices</p>
          </div>
        </Link>

        <Link
          href="/clothes?wishlist=true"
          className="p-4 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-pink-500/30 transition-all flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">Saved Wishlist</p>
            <p className="text-[11px] text-muted-foreground truncate">Review favorited apparel</p>
          </div>
        </Link>
      </div>

      {/* Two Columns: Recent Listings & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-rose-500" />
              <h2 className="font-heading font-bold text-base text-foreground">Recent Listings</h2>
            </div>
            <Link
              href="/my-listings"
              className="text-xs font-semibold text-rose-600 hover:text-rose-500 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 w-full bg-muted/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentListings.length > 0 ? (
              recentListings.map((item) => {
                const itemId = item.id || item._id;
                return (
                  <div key={itemId} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image || '/placeholder-cloth.jpg'}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/clothes/${itemId}`}
                          className="font-heading font-bold text-xs text-foreground hover:text-rose-600 transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            ${Number(item.price).toFixed(2)}
                          </span>
                          <span>•</span>
                          <span>Stock: {item.stock}</span>
                          <span>•</span>
                          <span className="truncate">{item.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/clothes/edit/${itemId}`}
                        className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-medium hover:bg-accent transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/clothes/${itemId}`}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-3">
                <Shirt className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">
                  You haven&apos;t published any clothing items yet.
                </p>
                <Link
                  href="/add-cloth"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Publish First Piece</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <h2 className="font-heading font-bold text-base text-foreground">Recent Orders</h2>
            </div>
            <Link
              href="/my-orders"
              className="text-xs font-semibold text-rose-600 hover:text-rose-500 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 w-full bg-muted/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const orderId = order.id || order._id;
                const isCancelled = order.status === 'Cancelled';
                return (
                  <div key={orderId} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={order.clothImage || '/placeholder-cloth.jpg'}
                        alt={order.clothTitle}
                        className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-xs text-foreground truncate">
                          {order.clothTitle}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ${Number(order.totalPrice || order.clothPrice).toFixed(2)}
                          </span>
                          <span>•</span>
                          <span>Size {order.size}</span>
                          <span>•</span>
                          <span>Qty {order.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isCancelled
                            ? 'bg-rose-500/10 text-rose-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                          }`}
                      >
                        {isCancelled ? 'Cancelled' : 'Confirmed'}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-3">
                <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">
                  You haven&apos;t placed any clothing orders yet.
                </p>
                <Link
                  href="/clothes"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold"
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Explore Apparel</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}