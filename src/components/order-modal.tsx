'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Truck, AlertCircle, Ruler } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloth: any;
  onOrderSuccess: (order: any) => void;
}

export function OrderModal({ isOpen, onClose, cloth, onOrderSuccess }: OrderModalProps) {
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string>(
    cloth?.sizes && cloth.sizes.length > 0 ? cloth.sizes[0] : 'M'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash on Delivery');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !cloth) return null;

  const maxStock = Number(cloth.stock) || 0;
  const unitPrice = Number(cloth.price) || 0;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (maxStock <= 0) {
      setErrorMsg('This apparel piece is currently out of stock.');
      return;
    }

    if (quantity > maxStock) {
      setErrorMsg(`Cannot order ${quantity} units. Only ${maxStock} units currently available.`);
      return;
    }

    if (!selectedSize) {
      setErrorMsg('Please select a clothing size.');
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMsg('Please enter your shipping delivery address.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Please enter a valid contact phone number.');
      return;
    }

    try {
      setSubmitting(true);
      toast.loading('Placing your order...', { id: 'order-toast' });
      const res = await api.post('/api/orders', {
        clothId: cloth.id || cloth._id,
        size: selectedSize,
        quantity,
        shippingAddress: shippingAddress.trim(),
        phone: phone.trim(),
        paymentMethod,
        notes: notes.trim(),
      });

      if (res.success) {
        toast.success('Your order has been placed! The designer will prepare your piece.', { id: 'order-toast' });
        onOrderSuccess(res.data);
        onClose();
        router.push('/my-orders');
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to place order.';
      setErrorMsg(msg);
      toast.error(msg, { id: 'order-toast' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-accent"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-xl text-foreground">
              Order Designer Apparel
            </h2>
            <p className="text-xs text-muted-foreground">
              Peer-to-peer transparent checkout with atomic stock verification
            </p>
          </div>
        </div>

        {/* Apparel Preview Box */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-muted/40 border border-border mb-6">
          <img
            src={cloth.image || '/image-1.jpg'}
            alt={cloth.title}
            className="w-16 h-20 rounded-xl object-cover shrink-0 border border-border"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              {cloth.category}
            </span>
            <h4 className="font-heading font-bold text-sm text-foreground truncate">
              {cloth.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              Fabric: {cloth.fabric}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-black text-sm text-foreground">${unitPrice}</span>
              <span className="text-[11px] text-muted-foreground">• Available stock: {maxStock}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-foreground">
                Select Size <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('open-size-chart-modal', {
                      detail: { category: cloth?.category, title: cloth?.title, selectedSize },
                    })
                  )
                }
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3 h-3" />
                <span>Sizes Chart</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cloth.sizes && cloth.sizes.length > 0 ? (
                cloth.sizes.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${selectedSize === s
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-background border-border text-foreground hover:border-foreground/50'
                      }`}
                  >
                    {s}
                  </button>
                ))
              ) : (
                ['S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border ${selectedSize === s ? 'bg-rose-600 text-white border-rose-600' : 'bg-background'
                      }`}
                  >
                    {s}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Quantity (Max available: {maxStock})
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center font-bold hover:bg-accent text-foreground"
              >
                -
              </button>
              <span className="font-mono font-bold text-base w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                disabled={quantity >= maxStock}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center font-bold hover:bg-accent text-foreground disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Shipping Delivery Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Full street address, apartment/suite, city, zip code"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Contact Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Cash on Delivery', 'Direct Designer Escrow'].map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`p-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${paymentMethod === pm
                    ? 'border-rose-500 bg-rose-500/5 text-foreground'
                    : 'border-border bg-background text-muted-foreground'
                    }`}
                >
                  <span>{pm}</span>
                  {paymentMethod === pm && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Notes for the Designer (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please include garment dustbag, package as gift"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          {/* Price Breakdown */}
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Item Subtotal ({quantity}x ${unitPrice})</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Designer Packaging & Dispatch</span>
              <span className="text-emerald-500 font-semibold">Complimentary</span>
            </div>
            <div className="border-t border-border/60 pt-1.5 flex justify-between font-heading font-black text-sm text-foreground">
              <span>Total Payable</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent rounded-xl border border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || maxStock <= 0}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-xl shadow-md hover:shadow-rose-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>{submitting ? 'Verifying & Reserving...' : `Confirm & Place Order ($${totalPrice})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

