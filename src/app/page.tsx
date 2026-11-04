'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { HeroSlider } from '@/components/hero-slider';
import { ClothCard, ClothItem } from '@/components/cloth-card';
import { ClothGridSkeleton } from '@/components/skeletons';
import { api } from '@/lib/api';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Headphones,
  CheckCircle,
  Shirt,
  Scissors,
  Layers,
  Sparkle,
  Compass,
  Star,
  Quote,
  Search,
  X
} from 'lucide-react';

export default function HomePage() {
  const [featuredClothes, setFeaturedClothes] = useState<ClothItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Home Page live search state
  const [showSearchSection, setShowSearchSection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [searchResults, setSearchResults] = useState<ClothItem[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Relatable product suggestions autocomplete state
  const [suggestions, setSuggestions] = useState<ClothItem[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Listen to navbar search button trigger
  useEffect(() => {
    const handleToggle = () => {
      setShowSearchSection(true);
      setTimeout(() => {
        const input = document.getElementById('home-search-input');
        if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          input.focus();
        }
      }, 150);
    };

    window.addEventListener('toggle-home-search', handleToggle);

    // Also check if opened via query
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('search') === 'open') {
        setShowSearchSection(true);
      }
    }

    return () => window.removeEventListener('toggle-home-search', handleToggle);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced relatable product name fetcher on typing
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSuggesting(true);
        const res = await api.get('/api/clothes', { params: { search: query, limit: 6 } });
        if (res.success && Array.isArray(res.data)) {
          setSuggestions(res.data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Relatable products fetch error:', err);
      } finally {
        setIsSuggesting(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await api.get('/api/clothes/featured');
        if (res.success && Array.isArray(res.data)) {
          setFeaturedClothes(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured clothes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleHomeSearch = async (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    const query = (term !== undefined ? term : searchQuery).trim();
    if (!query) {
      setSearchResults(null);
      setActiveSearch('');
      setShowSearchSection(false);
      return;
    }
    try {
      setSearching(true);
      setActiveSearch(query);
      // Automatically close search section when searched is complete
      setShowSearchSection(false);
      const res = await api.get('/api/clothes', { params: { search: query, limit: 12 } });
      if (res.success && Array.isArray(res.data)) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error('Home search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSearchResults(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const categories = [
    {
      name: 'Streetwear',
      description: 'Heavyweight hoodies, cargo trench coats & raw cyberpunk silhouettes.',
      image: '/image-2.jpg',
      count: '40+ pieces',
      slug: 'Streetwear',
    },
    {
      name: 'Formal Wear',
      description: 'Structured wool-blend blazers, silk tuxedos & velvet evening gowns.',
      image: '/image-1.jpg',
      count: '32+ pieces',
      slug: 'Formal Wear',
    },
    {
      name: 'Casual Essentials',
      description: 'Belgian linen trousers, slub cotton overshirts & relaxed tailoring.',
      image: '/image-5.jpg',
      count: '55+ pieces',
      slug: 'Casual Essentials',
    },
    {
      name: 'Vintage & Retro',
      description: 'Curated 90s selvedge denim bombers & antique reversible silk kimonos.',
      image: '/image-3.jpg',
      count: '28+ pieces',
      slug: 'Vintage & Retro',
    },
    {
      name: 'Handcrafted Knitwear',
      description: 'Pure Mongolian cashmere cardigans & brushed open-stitch mohair pullovers.',
      image: '/image-4.jpg',
      count: '24+ pieces',
      slug: 'Handcrafted Knitwear',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-16 md:space-y-24 pb-20">
      {/* 1. Hero Slider Section - Full Width Edge-to-Edge */}
      <HeroSlider />

      {/* 2. Featured Clothes & Live Search Section */}
      <section id="clothes-section" className="container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          {/* Search Bar on Home Page - Toggled when clicking search button, auto-closes on completion */}
          {showSearchSection && (
                <div
                  ref={searchContainerRef}
                  className="mb-8 p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm relative animate-in fade-in slide-in-from-top-3 duration-300"
                >
                  {/* Header with Title & Close Button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Search Apparel & Fabric
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSearchSection(false);
                        handleClearSearch();
                      }}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                      title="Close search"
                    >
                      <X className="w-4 h-4" />
                    </button>
              </div>

                  <form onSubmit={handleHomeSearch} className="flex flex-col sm:flex-row gap-3 relative">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="home-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => {
                          if (searchQuery.trim().length > 0) setShowSuggestions(true);
                        }}
                        placeholder="Search clothing by name, fabric, style (e.g. Cotton, Linen, Formal, Blazer)..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-sans"
                        autoComplete="off"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Relatable Product Suggestions Dropdown */}
                      {showSuggestions && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-border/60 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-2.5 bg-muted/30 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Relatable Products ({suggestions.length})</span>
                            </div>
                            {isSuggesting && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                                <div className="w-2.5 h-2.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                <span>Matching...</span>
                              </span>
                            )}
                          </div>

                          {suggestions.length > 0 ? (
                            <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
                              {suggestions.map((item) => (
                                <Link
                                  key={item.id || item._id}
                                  href={`/clothes/${item.id || item._id}`}
                                  onClick={() => setShowSuggestions(false)}
                                  className="flex items-center gap-3.5 p-3 sm:px-4 hover:bg-accent/60 transition-colors group"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-11 h-11 rounded-lg object-cover border border-border shrink-0 group-hover:scale-105 transition-transform"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate transition-colors">
                                      {item.title}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                      <span className="font-medium text-foreground/80">{item.category}</span>
                                      <span className="mx-1.5">•</span>
                                      <span>{item.fabric}</span>
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-bold font-mono text-foreground block">
                                      ${item.price}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground block">
                                      {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : !isSuggesting && searchQuery.trim().length >= 1 ? (
                            <div className="p-6 text-center text-xs text-muted-foreground">
                              <p>No relatable product found for &ldquo;{searchQuery}&rdquo;.</p>
                              <p className="text-[11px] mt-1 text-muted-foreground/80">
                                Try searching by fabric like &ldquo;Cotton&rdquo;, &ldquo;Linen&rdquo;, or &ldquo;Streetwear&rdquo;.
                              </p>
                            </div>
                          ) : null}

                          {suggestions.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                setShowSuggestions(false);
                                handleHomeSearch(e);
                              }}
                              className="w-full py-2.5 px-4 bg-muted/40 hover:bg-muted text-xs font-semibold text-rose-600 dark:text-rose-400 text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <span>View all relatable products on home page</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={searching}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs tracking-wider uppercase hover:opacity-90 shadow-sm transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {searching ? (
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>Search</span>
                    </button>
                  </form>

                  {/* Quick search suggestion tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground font-medium text-[11px]">Popular:</span>
                    {['Cotton', 'Linen', 'Shirt', 'Formal', 'Streetwear', 'Knitwear'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                          handleHomeSearch(undefined, tag);
                        }}
                        className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors cursor-pointer ${activeSearch.toLowerCase() === tag.toLowerCase()
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-muted/40 hover:bg-muted text-foreground border-border'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {activeSearch && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="ml-auto text-rose-500 hover:underline text-[11px] font-semibold cursor-pointer"
                      >
                        Clear Search & Reset to Featured
                      </button>
                    )}
                  </div>
                </div>
          )}

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                {activeSearch ? <Search className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{activeSearch ? 'Search Results' : 'Curated Highlights'}</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-foreground">
                {activeSearch
                  ? `Search Results for "${activeSearch}"`
                  : 'Featured Designer Apparel'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                {activeSearch
                  ? `Showing ${searchResults?.length || 0} apparel item(s) matching "${activeSearch}".`
                  : 'Hand-selected garments from verified independent ateliers, displaying transparent pricing and real-time inventory.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all cursor-pointer shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset to Featured</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowSearchSection((prev) => {
                    const next = !prev;
                    if (next) {
                      setTimeout(() => document.getElementById('home-search-input')?.focus(), 150);
                    }
                    return next;
                  });
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-semibold text-foreground transition-all cursor-pointer shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-rose-500" />
                <span>{showSearchSection ? 'Hide Search' : activeSearch ? 'Search Again' : 'Search Apparel'}</span>
              </button>

              <Link
                href="/clothes"
                className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-500 transition-colors group"
              >
                <span>Explore Full Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          {searching || loading ? (
            <ClothGridSkeleton count={6} />
          ) : activeSearch ? (
            searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {searchResults.map((item) => (
                  <ClothCard key={item.id || item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 p-8 border border-dashed border-border rounded-2xl bg-muted/20">
                <Shirt className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-heading font-bold text-base text-foreground">
                  No Apparel Found for &ldquo;{activeSearch}&rdquo;
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  We couldn&apos;t find any items matching your search. Try different keywords or reset to featured apparel.
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset to Featured Clothes</span>
                </button>
              </div>
            )
          ) : featuredClothes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredClothes.slice(0, 6).map((item) => (
                <ClothCard key={item.id || item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 p-8 border border-dashed border-border rounded-2xl bg-muted/20">
              <Shirt className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-heading font-bold text-base text-foreground">
                No Apparel Found
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Check back shortly or publish your own piece.
              </p>
            </div>
          )}
      </section>

      {/* 3. Browse by Clothing Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Apparel Collections</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-foreground">
            Browse by Clothing Categories
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Filter our peer-to-peer inventory by garment taxonomy, tailoring style, and occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/clothes?category=${encodeURIComponent(cat.slug)}`}
              className="group relative flex flex-col justify-end p-5 rounded-2xl overflow-hidden border border-border/80 bg-card hover:border-rose-500/60 shadow-sm hover:shadow-xl transition-all duration-300 min-h-[260px]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.6] contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 space-y-1.5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300">
                  {cat.count}
                </span>
                <h3 className="font-heading font-bold text-lg text-white group-hover:text-rose-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-light">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Extra Section 1: How Ordering Works (4-Step Workflow) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-gradient-to-b from-card to-muted/20 p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              Seamless Peer-to-Peer Process
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-foreground mt-2">
              How Ordering Works on ClothSpace
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Our 4-step workflow gives buyers complete transparency and designers guaranteed protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Discover Styles',
                desc: 'Explore curated designer drops, rare vintage denim, and handcrafted knitwear with transparent pricing and real-time stock availability.',
                icon: Compass,
              },
              {
                step: '02',
                title: 'Select Size & Fit',
                desc: 'Inspect exact fabric origin, garment dimensions, care tags, and dynamic size availability before making your selection.',
                icon: Scissors,
              },
              {
                step: '03',
                title: 'Order Instantly',
                desc: 'Confirm your delivery details with atomic stock deduction that guarantees zero double-booking or accidental overselling.',
                icon: Shirt,
              },
              {
                step: '04',
                title: 'Wear & Flaunt',
                desc: 'Receive atelier-packaged clothing with a printable order invoice and 7-day fit exchange assurance from verified creators.',
                icon: Sparkles,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="relative p-6 rounded-2xl border border-border/80 bg-card hover:border-rose-500/50 shadow-sm transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-rose-500/30">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {st.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Extra Section 2: Buyer Protection & Designer Guarantee */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Assurances</span>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight">
              Buyer Protection & Designer Guarantee
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Every garment circulating on ClothSpace adheres to stringent quality audits. We protect the time and craftsmanship of independent creators while offering buyers unparalleled peace of mind.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <h4>Authentic Quality Fabrics</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Verified pure wool, organic cotton, silk, and selvedge textiles with no misleading synthetic blends.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <h4>Verified Sellers</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Independent boutique studios with authenticated designer profiles and peer reviews.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <RotateCcw className="w-4 h-4" />
                  <h4>Hassle-Free Exchanges</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  7-day sizing exchange program if the garment does not fit exactly as expected.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <Headphones className="w-4 h-4" />
                  <h4>24/7 Dedicated Support</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Personal concierge assistance for tracking, garment care consultations, and inquiries.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-border shadow-2xl aspect-[4/3] bg-muted relative">
              <img
                src="/home-2.jpg"
                alt="ClothSpace Designer Guarantee"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white">
                  Verified Atelier Standard
                </span>
                <p className="text-base font-bold">
                  "Sustainable clothing sharing that treats independent designers with the respect they deserve."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Designer Spotlight & Community Reviews */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
            Designer Spotlight
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-foreground mt-1.5">
            Loved by Fashion Creators & Collectors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Elena Rostova',
              role: 'Milanese Tailoring Atelier',
              image: '/client-review-2.jpg',
              review: 'Listing my bespoke blazers on ClothSpace has connected my studio with genuine connoisseurs who appreciate natural wool and tailored canvassing.',
              rating: 5,
            },
            {
              name: 'Marcus Vance',
              role: 'Streetwear Collector, Berlin',
              image: '/client-review-1.jpg',
              review: 'The dynamic sizing inspection and atomic stock protection mean I never lose out on a limited drop. Seamless ordering and top-tier fabric authenticity.',
              rating: 5,
            },
            {
              name: 'Sofia Chen',
              role: 'Artisanal Knitwear Designer',
              image: '/client-review-3.jpg',
              review: 'Managing inventory across multiple handcrafted sweaters was previously difficult. ClothSpace provides clear order management and instant PDF invoicing.',
              rating: 5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
                <div>
                  <h4 className="font-heading font-bold text-xs text-foreground">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section >
    </div >
  );
}
