'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { generateOrderInvoice } from '@/lib/invoice';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileDown,
  RotateCcw,
  Shirt,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please log in to review your orders.');
      router.push('/login?redirect=/my-orders');
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/orders/my-orders');
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      const res = await api.patch(`/api/orders/${orderId}/cancel`);
      if (res.success) {
        toast.success('Order cancelled. Atelier inventory restored.');
        // Update local order status
        setOrders((prev) =>
          prev.map((o) =>
            (o.id || o._id) === orderId ? { ...o, status: 'Cancelled' } : o
          )
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadInvoice = (order: any) => {
    try {
      generateOrderInvoice(order);
      toast.success('Invoice PDF downloaded successfully!');
    } catch (err) {
      toast.error('Failed to generate PDF receipt.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Pending</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Loading your orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order History</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            My Clothing Orders
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track real-time garment status, cancel pending orders, or download PDF receipts.
          </p>
        </div>

        <Link
          href="/clothes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <Shirt className="w-4 h-4 text-rose-500" />
          <span>Explore More Apparel</span>
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
              <div className="h-16 w-full bg-muted/50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order.id || order._id;
            const isPending = order.status === 'Pending';

            return (
              <div
                key={orderId}
                className="p-5 sm:p-6 rounded-3xl border border-border bg-card hover:border-border/80 shadow-sm transition-all space-y-4"
              >
                {/* Header: Order ID, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        Order #{String(orderId).slice(-8).toUpperCase()}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Designer Atelier: <span className="font-semibold text-foreground">{order.sellerName}</span> ({order.sellerEmail})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}

                    {/* PDF Invoice Button */}
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      title="Download PDF Invoice Receipt"
                      className="px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5 text-rose-500" />
                      <span className="hidden sm:inline">Download Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Body: Apparel Image, Info & Price */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.clothImage || '/image-1.jpg'}
                      alt={order.clothTitle}
                      className="w-16 h-20 rounded-2xl object-cover shrink-0 border border-border"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        {order.clothCategory}
                      </span>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">
                        {order.clothTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Size: <strong className="text-foreground">{order.size}</strong></span>
                        <span>•</span>
                        <span>Qty: <strong className="text-foreground">{order.quantity}</strong></span>
                        <span>•</span>
                        <span>Fabric: <strong className="text-foreground">{order.fabric}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="text-left sm:text-right space-y-1 sm:self-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Total Payable ({order.paymentMethod})
                    </span>
                    <span className="font-heading font-black text-xl text-foreground">
                      ${Number(order.totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Footer: Shipping Address & Cancel Option */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  <div>
                    <span>Deliver to: </span>
                    <span className="text-foreground font-medium">{order.shippingAddress}</span>
                    <span className="ml-2 font-mono text-[11px]">({order.phone})</span>
                  </div>

                  {isPending && (
                    <button
                      onClick={() => handleCancelOrder(orderId)}
                      disabled={cancellingId === orderId}
                      className="text-xs font-bold text-rose-600 hover:text-rose-500 flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{cancellingId === orderId ? 'Restoring Stock...' : 'Cancel Order'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading font-bold text-lg text-foreground">
              You Have No Orders Yet
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you discover and order apparel from boutique creators, your live updates and PDF receipts will be listed here.
            </p>
          </div>
          <Link
            href="/clothes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold shadow-md hover:from-rose-500 transition-all"
          >
            <Shirt className="w-4 h-4" />
            <span>Discover Apparel Now</span>
          </Link>
        </div>
      )}
    </div>
  );
}

