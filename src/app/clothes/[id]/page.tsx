'use client';

import React, { useState, useEffect, Suspense } from 'react';

// Rest of imports
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/context/wishlist-context';
import { OrderModal } from '@/components/order-modal';
import { SizeChartModal } from '@/components/size-chart-modal';
import { DetailSkeleton } from '@/components/skeletons';
import { toast } from 'sonner';
import {
  Star,
  Heart,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  User,
  Ruler,
  Maximize2,
  Plus,
  Minus,
  X
} from 'lucide-react';

function ClothDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [cloth, setCloth] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  // Image Zoom & Lightbox states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin({ x, y });
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleMouseLeave = () => {
    if (isZoomed) {
      setIsZoomed(false);
    }
  };

  // Reset zoom when active image changes
  useEffect(() => {
    setIsZoomed(false);
    setLightboxZoom(1);
  }, [activeImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
        setLightboxZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await api.get(`/api/clothes/${id}`);
        if (res.success && res.data) {
          setCloth(res.data);
          setActiveImage(res.data.image || (res.data.images && res.data.images[0]) || '/image-1.jpg');
          if (res.data.sizes && res.data.sizes.length > 0) {
            setSelectedSize(res.data.sizes[0]);
          }
        }
      } catch {
        toast.error('Failed to load apparel details.');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!cloth) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-black text-2xl text-foreground">
          Apparel Listing Not Found
        </h2>
        <p className="text-xs text-muted-foreground">
          This piece may have been removed or sold out.
        </p>
        <Link
          href="/clothes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(cloth.id || cloth._id);
  const isOutOfStock = Number(cloth.stock) <= 0;
  const gallery = cloth.images && cloth.images.length > 0 ? cloth.images : [cloth.image || '/image-1.jpg'];

  const handleOrderClick = () => {
    if (!user) {
      toast.error('Please log in to place an order.');
      router.push(`/login?redirect=/clothes/${id}`);
      return;
    }
    setOrderModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Apparel Catalog</span>
        </button>
      </div>

      {/* Main Grid: Gallery & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Gallery Carousel & Thumbnails (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
            {/* Main Hero Image with Click-to-Zoom */}
            <div
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-muted shadow-lg select-none transition-colors ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              title={isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
            >
              <img
                src={activeImage || cloth.image}
                alt={cloth.title}
                style={{
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }}
                className="w-full h-full object-cover object-center transition-transform duration-200 ease-out pointer-events-none"
              />

              {/* Wishlist Heart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(cloth);
                }}
                aria-label="Save to Wishlist"
              className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all z-10 ${isSaved
                  ? 'bg-rose-600 border-rose-600 text-white shadow-lg'
                  : 'bg-background/80 hover:bg-background border-border text-muted-foreground hover:text-rose-500'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {/* Category Pill */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground font-bold text-xs uppercase tracking-wider border border-border shadow-sm">
                    {cloth.category}
                  </span>
                </div>



                {/* Fullscreen Expand Button (Bottom Left) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  aria-label="Fullscreen View"
                  title="Open Fullscreen Lightbox"
                  className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-background/90 backdrop-blur-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors shadow-sm cursor-pointer z-10"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 pointer-events-none">
                      <span className="px-4 py-2 rounded-full bg-rose-600 text-white font-bold text-sm uppercase tracking-widest shadow-xl">
                        Out of Stock
                      </span>
                    </div>
            )}
                  </div>

          {/* Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {gallery.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${activeImage === img
                          ? 'border-rose-600 shadow-md scale-95'
                          : 'border-border/80 opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications & Ordering Actions (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                      {cloth.brandOrigin || 'Milanese Tailoring Studio'}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 font-bold text-xs">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{Number(cloth.rating || 4.9).toFixed(1)}</span>
                      <span className="text-muted-foreground font-normal">
                        ({cloth.reviewsCount || 12} reviews)
                      </span>
                    </div>
                  </div>

                  <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-foreground">
                    {cloth.title}
                  </h1>

                  {/* Price & Stock Display */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="font-heading font-black text-3xl sm:text-4xl text-foreground">
                      ${Number(cloth.price).toFixed(2)}
                    </span>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'
                          }`}
                      />
                      <span className="text-xs font-semibold text-muted-foreground">
                        {isOutOfStock
                          ? 'Currently Out of Stock'
                          : `${cloth.stock} units available in atelier`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Overview */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Garment Overview & Story
                  </h3>
                  <p className="text-sm text-foreground/90 leading-relaxed font-light">
                    {cloth.overview ||
                      'Masterfully tailored garment made with exquisite attention to textile texture, durability, and wearable silhouette.'}
                  </p>
                </div>

                {/* Specifications Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase">Fabric & Composition</span>
                    <p className="text-xs font-bold text-foreground">{cloth.fabric}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase">Origin / Studio</span>
                    <p className="text-xs font-bold text-foreground">{cloth.brandOrigin || 'Verified Independent Designer'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase">Inventory Quantity</span>
                    <p className="text-xs font-bold text-foreground">{cloth.stock} units</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase">Garment Category</span>
                    <p className="text-xs font-bold text-foreground">{cloth.category}</p>
                  </div>
                </div>

                {/* Available Sizes Selection */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-foreground">
                      Available Sizes
                    </label>
                    <button
                      type="button"
                      onClick={() => setSizeChartOpen(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-accent text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all cursor-pointer shadow-xs group"
                      title="Open Sizes Chart & Measurement Guide"
                    >
                      <Ruler className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
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
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedSize === s
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                            : 'bg-card border-border hover:border-foreground/40 text-foreground'
                            }`}
                        >
                          {s}
                        </button>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">Free Size / Standard Fit</span>
                    )}
                  </div>
                </div>

                {/* Care Instructions Tags */}
                {cloth.careInstructions && cloth.careInstructions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">
                      Garment Care Instructions
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {cloth.careInstructions.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-medium text-muted-foreground"
                        >
                          • {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleOrderClick}
                    disabled={isOutOfStock}
                    className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl hover:shadow-rose-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isOutOfStock ? 'Sold Out / Double-Booking Protected' : 'Order Cloth Now'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(cloth)}
                    className="w-full sm:w-auto py-4 px-5 rounded-2xl border border-border bg-card hover:bg-accent text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isSaved ? 'In Wishlist' : 'Save to Wishlist'}</span>
                  </button>
                </div>

                {/* Designer / Seller Card */}
                <div className="p-4 rounded-2xl border border-border/80 bg-card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xs text-foreground">
                        {cloth.ownerName || 'Elena Rostova Atelier'}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Verified Designer • Contact: {cloth.ownerEmail || 'atelier@clothspace.com'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Creator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="border-t border-border pt-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-foreground">
                    Apparel Reviews & Fit Feedback
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Verified buyers who have worn and inspected this garment.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>4.9 / 5.0 Average Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    author: 'Julian Thorne',
                    date: '2 days ago',
                    rating: 5,
                    review: 'The fabric drape is magnificent. Exceeded expectations for fit and stitching precision. Arrived safely in reusable designer packaging.',
                  },
                  {
                    author: 'Camilla Vance',
                    date: '1 week ago',
                    rating: 5,
                    review: 'True to size! The materials feel luxurious and substantial. Great communication from the designer.',
                  },
                  {
                    author: 'Tariq Al-Mansoor',
                    date: '2 weeks ago',
                    rating: 5,
                    review: 'An absolute masterpiece. Pure authentic materials without synthetic shortcuts. Highly recommend this atelier.',
                  },
                ].map((rev, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">{rev.author}</span>
                      <span className="text-[11px] text-muted-foreground">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      &ldquo;{rev.review}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Modal Dialog */}
            <OrderModal
              isOpen={orderModalOpen}
              onClose={() => setOrderModalOpen(false)}
              cloth={cloth}
              onOrderSuccess={(order) => {
                // Decrement local stock
                setCloth((prev: any) => ({
                  ...prev,
                  stock: Math.max(0, Number(prev.stock) - order.quantity),
                }));
              }}
            />

            {/* Sizes Chart Modal */}
            <SizeChartModal
              isOpen={sizeChartOpen}
              onClose={() => setSizeChartOpen(false)}
              category={cloth?.category}
              selectedSize={selectedSize}
              clothTitle={cloth?.title}
            />

            {/* Fullscreen Lightbox / Zoom Modal */}
            {lightboxOpen && (
              <div
                onClick={() => {
                  setLightboxOpen(false);
                  setLightboxZoom(1);
                }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200"
              >
                {/* Top Bar: Title & Zoom Controls */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-5xl flex items-center justify-between text-white pb-3 z-10"
                >
                  <div className="space-y-0.5">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white/95">
                      {cloth.title}
                    </h3>
                    <p className="text-xs text-white/60">
                      Click image to toggle 2x zoom • Click outside to close (Esc)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLightboxZoom((prev) => Math.max(1, +(prev - 0.5).toFixed(1)))}
                      disabled={lightboxZoom <= 1}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 flex items-center justify-center text-white transition-colors cursor-pointer"
                      title="Zoom Out (-)"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-mono font-bold px-2 text-white/80 min-w-10 text-center">
                      {Math.round(lightboxZoom * 100)}%
                    </span>

                    <button
                      type="button"
                      onClick={() => setLightboxZoom((prev) => Math.min(3, +(prev + 0.5).toFixed(1)))}
                      disabled={lightboxZoom >= 3}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 flex items-center justify-center text-white transition-colors cursor-pointer"
                      title="Zoom In (+)"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {lightboxZoom > 1 && (
                      <button
                        type="button"
                        onClick={() => setLightboxZoom(1)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
                        title="Reset Zoom (100%)"
                      >
                        Reset
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setLightboxOpen(false);
                        setLightboxZoom(1);
                      }}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer ml-2"
                      title="Close Lightbox (Esc)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Center Zoomable Image View */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxZoom((prev) => (prev > 1 ? 1 : 2));
                  }}
                  className={`flex-1 w-full max-w-4xl flex items-center justify-center overflow-hidden my-2 select-none ${lightboxZoom > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                  title={lightboxZoom > 1 ? 'Click to zoom out' : 'Click to zoom in'}
                >
                  <img
                    src={activeImage || cloth.image}
                    alt={cloth.title}
                    style={{
                      transform: `scale(${lightboxZoom})`,
                      transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
                    }}
                    className="max-h-[75vh] max-w-full object-contain pointer-events-none"
                  />
                </div>

                {/* Bottom Thumbnails */}
                {gallery.length > 1 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 overflow-x-auto p-2 bg-white/10 rounded-2xl backdrop-blur-md max-w-md z-10"
                  >
                    {gallery.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`w-14 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${activeImage === img ? 'border-rose-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          );
}

          export default function ClothDetailsPage() {
  return (
          <Suspense fallback={<DetailSkeleton />}>
            <ClothDetailsContent />
          </Suspense>
          );
}

