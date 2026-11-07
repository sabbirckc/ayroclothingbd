'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, AlertCircle, Save, Check, UploadCloud, Trash2, Edit } from 'lucide-react';

function EditClothContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Shirts');
  const [subCategory, setSubCategory] = useState('Classic Fit');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [fabric, setFabric] = useState('');
  const [brandOrigin, setBrandOrigin] = useState('');
  const [image, setImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [careInstructions, setCareInstructions] = useState<string[]>([]);
  const [overview, setOverview] = useState('');

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redirectedRef = React.useRef(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user && !redirectedRef.current) {
        redirectedRef.current = true;
        toast.error('Please log in to edit this listing.', { id: 'auth-required' });
        router.push(`/login?redirect=/clothes/edit/${id}`);
      } else if (user && user.role !== 'admin' && !redirectedRef.current) {
        redirectedRef.current = true;
        toast.error('Access denied. Admin permission required.', { id: 'admin-required' });
        router.push('/');
      }
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
          setCategory(item.category || 'Shirts');
          setSubCategory(item.subCategory || 'Classic Fit');
          setPrice(String(item.price || ''));
          setStock(String(item.stock || ''));
          setSizes(item.sizes || ['M', 'L']);
          setFabric(item.fabric || '');
          setBrandOrigin(item.brandOrigin || '');
          setImage(item.image || '/image-1.jpg');
          setCareInstructions(item.careInstructions || ['Dry Clean Only']);
          setOverview(item.overview || '');
        }
      } catch {
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
    'Shirts',
    'Katua',
    'Panjabi',
    'T-Shirt',
    'Polo Shirt',
    'Pant',
    'Winter',
  ];

  const subCategoryOptions: Record<string, string[]> = {
    Shirts: ['Classic Fit', 'Formal Shirt', 'Half Sleeve', 'Over Shirt'],
    Panjabi: ['Semi-Fitted Panjabi', 'Kabli Panjabi', 'Premium Cotton Panjabi', 'Silk Panjabi'],
    Pant: ['Chino Pant', 'Formal Trouser', 'Denim Jeans', 'Cargo Pant'],
    Winter: ['Hoodies & Sweatshirts', 'Jackets & Windbreakers', 'Sweaters & Knitwear', 'Blazers & Overcoats'],
  };

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
    { label: 'Burgundy Pinstripe', url: '/image-1.jpg' },
    { label: 'Deep Plum Oxford', url: '/image-2.jpg' },
    { label: 'Sky Blue Chambray', url: '/image-3.jpg' },
    { label: 'Earth Taupe Weave', url: '/image-4.jpg' },
    { label: 'Minimalist Olive Linen', url: '/image-5.jpg' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      setSelectedFileName(file.name);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
        toast.success(`Image "${file.name}" imported and saved to uploads folder!`);
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (err: unknown) {
      console.error('Image upload failed:', err);
      const msg = err instanceof Error ? err.message : 'Image upload failed. Please try again.';
      toast.error(msg);
      setSelectedFileName('');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
        subCategory,
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update listing.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (user && fetching)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Loading listing specifications...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-heading font-black text-xl text-foreground">
              Admin Access Required
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Only verified store administrators are authorized to edit apparel listings.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs transition-colors"
            >
              Return to Store
            </Link>
          </div>
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

        {/* Title, Category & Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              onChange={(e) => {
                const newCat = e.target.value;
                setCategory(newCat);
                const subOpts = subCategoryOptions[newCat];
                if (subOpts && subOpts.length > 0) {
                  setSubCategory(subOpts[0]);
                } else {
                  setSubCategory('Standard');
                }
              }}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Subcategory <span className="text-rose-500">*</span>
            </label>
            {subCategoryOptions[category] && subCategoryOptions[category].length > 0 ? (
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
              >
                {subCategoryOptions[category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Standard"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-foreground"
              />
            )}
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
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${sizes.includes(s)
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-background border-border text-foreground hover:bg-muted'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Device Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-foreground">
            Apparel Image <span className="text-rose-500">*</span>
          </label>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Upload Dropzone / Preview */}
          <div className="border-2 border-dashed border-border hover:border-rose-500/50 rounded-2xl p-4 sm:p-6 bg-card/60 transition-all">
            {image ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-border shadow-xs shrink-0 bg-muted/30">
                  <Image
                    src={image}
                    alt="Apparel preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{image.startsWith('/uploads') ? 'Uploaded from device' : 'Catalog image selected'}</span>
                  </div>
                  <p className="text-xs font-bold text-foreground truncate max-w-sm">
                    {selectedFileName || image}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Image is saved in your local folder and ready to publish.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Choose from Device'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setSelectedFileName('');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-[#1C3B27] hover:bg-[#1C3B27]/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center py-6 text-center cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-xs font-bold text-foreground group-hover:text-[#1C3B27] transition-colors">
                  {uploadingImage ? 'Uploading photo...' : 'Click to import image from your device'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Supports PNG, JPG, JPEG, WEBP or AVIF (auto-saved to folder)
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
              Or select alternative catalog photo:
            </span>
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">
              {presetImages.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => {
                    setImage(p.url);
                    setSelectedFileName(p.label);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${image === p.url ? 'border-rose-600 ring-2 ring-rose-500/30' : 'border-border/70 opacity-70 hover:opacity-100'
                    }`}
                >
                  <Image src={p.url} alt={p.label} fill unoptimized className="object-cover" />
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
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${careInstructions.includes(c)
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

export default function EditClothPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">Loading listing editor...</div>}>
      <EditClothContent />
    </Suspense>
  );
}

