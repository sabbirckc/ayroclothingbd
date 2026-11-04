'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Edit3, ArrowLeft, AlertCircle, Save, Check } from 'lucide-react';

export default function EditClothPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Streetwear');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [fabric, setFabric] = useState('');
  const [brandOrigin, setBrandOrigin] = useState('');
  const [image, setImage] = useState('');
  const [careInstructions, setCareInstructions] = useState<string[]>([]);
  const [overview, setOverview] = useState('');

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please log in to edit this listing.');
      router.push(`/login?redirect=/clothes/edit/${id}`);
    }
  }, [user, authLoading, router, id]);

  useEffect(() => {
    async function loadItem() {
      try {
        setFetching(true);
        const res = await api.get(`/api/clothes/${id}`);
        if (res.success && res.data) {
          const item = res.data;
          setTitle(item.title || '');
          setCategory(item.category || 'Streetwear');
          setPrice(String(item.price || ''));
          setStock(String(item.stock || ''));
          setSizes(item.sizes || ['M', 'L']);
          setFabric(item.fabric || '');
          setBrandOrigin(item.brandOrigin || '');
          setImage(item.image || '/image-1.jpg');
          setCareInstructions(item.careInstructions || ['Dry Clean Only']);
          setOverview(item.overview || '');
        }
      } catch (err: any) {
        toast.error('Failed to load item for editing.');
        router.push('/my-listings');
      } finally {
        setFetching(false);
      }
    }

    if (id && user) {
      loadItem();
    }
  }, [id, user, router]);

  const categoryOptions = [
    'Streetwear',
    'Formal Wear',
    'Casual Essentials',
    'Vintage & Retro',
    'Handcrafted Knitwear',
    'Outerwear',
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const careOptions = [
    'Dry Clean Only',
    'Cold Machine Wash',
    'Hand Wash Cold',
    'Iron Low Heat',
    'Do Not Tumble Dry',
    'Wash Inside Out',
  ];

  const presetImages = [
    { label: 'Wool Blazer', url: '/image-1.jpg' },
    { label: 'Hoodie', url: '/image-2.jpg' },
    { label: 'Denim Bomber', url: '/image-3.jpg' },
    { label: 'Knit Cardigan', url: '/image-4.jpg' },
    { label: 'Linen Trousers', url: '/image-5.jpg' },
    { label: 'Velvet Gown', url: '/image-6.jpg' },
    { label: 'Cargo Trench', url: '/image-7.jpg' },
    { label: 'Silk Kimono', url: '/image-8.jpg' },
    { label: 'Mohair Pullover', url: '/image-9.jpg' },
    { label: 'Selvedge Shirt', url: '/image-10.jpg' },
    { label: 'Avant Parka', url: '/image-11.jpg' },
  ];

  const handleSizeToggle = (s: string) => {
    if (sizes.includes(s)) {
      setSizes(sizes.filter((item) => item !== s));
    } else {
      setSizes([...sizes, s]);
    }
  };

  const handleCareToggle = (c: string) => {
    if (careInstructions.includes(c)) {
      setCareInstructions(careInstructions.filter((item) => item !== c));
    } else {
      setCareInstructions([...careInstructions, c]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !fabric.trim() || !price || stock === '') {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (sizes.length === 0) {
      setErrorMsg('Please select at least one available size.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.put(`/api/clothes/${id}`, {
        title: title.trim(),
        category,
        price: Number(price),
        stock: Number(stock),
        sizes,
        fabric: fabric.trim(),
        brandOrigin: brandOrigin.trim(),
        image: image.trim(),
        images: [image.trim()],
        careInstructions,
        overview: overview.trim(),
      });

      if (res.success) {
        toast.success('Apparel listing updated successfully!');
        router.push('/my-listings');
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to update listing.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || fetching || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Loading listing specifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Listings</span>
        </button>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
          Update Clothing Listing
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Modify pricing, available stock inventory, fabric details, and care guidelines.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
        {/* Read-Only Seller Information */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
              Listing Creator (Read-Only)
            </span>
            <span className="font-bold text-foreground">{user.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
              Registered Owner Email (Read-Only)
            </span>
            <span className="font-mono text-muted-foreground">{user.email}</span>
          </div>
        </div>

        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Clothing Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Available Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Price ($ USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Available Stock / Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
          </div>
        </div>

        {/* Fabric Type & Brand Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Fabric / Material Composition <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Studio / Brand Origin
            </label>
            <input
              type="text"
              value={brandOrigin}
              onChange={(e) => setBrandOrigin(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            />
          </div>
        </div>

        {/* Available Sizes (Checkboxes) */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-2">
            Available Sizes (Checkboxes) <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSizeToggle(s)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  sizes.includes(s)
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-background border-border text-foreground hover:bg-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Image Selection / URL */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-foreground">
            Apparel Image URL <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
          />

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
              Select alternative preview photo:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">
              {presetImages.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setImage(p.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    image === p.url ? 'border-rose-600 ring-2 ring-rose-500/30' : 'border-border/70 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  {image === p.url && (
                    <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Care Instructions (Checkboxes/Tags) */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-2">
            Care Instructions (Tags)
          </label>
          <div className="flex flex-wrap gap-2">
            {careOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCareToggle(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                  careInstructions.includes(c)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Overview */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Detailed Overview & Silhouette Notes <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => router.push('/my-listings')}
            disabled={submitting}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-border hover:bg-accent text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-md hover:shadow-rose-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Changes...' : 'Save & Update Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

