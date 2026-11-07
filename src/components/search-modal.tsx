'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

interface ClothSuggestion {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  fabric: string;
  image: string;
}

export function SearchModal() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ClothSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularTags = ['Cotton', 'Linen', 'Shirt', 'Formal', 'Streetwear', 'Knitwear'];

  // Listen to open event from navbar or keyboard shortcuts
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K shortcut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    window.addEventListener('open-search-modal', handleOpen);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-search-modal', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Debounced relatable product search
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      const timer = setTimeout(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      }, 0);
      return () => clearTimeout(timer);
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

  const handleClose = () => {
    setIsOpen(false);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const query = (term !== undefined ? term : searchQuery).trim();
    if (!query) return;

    handleClose();

    // If already on home page, update home page search results
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('home-search-executed', { detail: { query } }));
      const section = document.getElementById('clothes-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If on any other page, navigate to clothes catalog with query filter
      router.push(`/clothes?search=${encodeURIComponent(query)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in duration-200"
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-5 sm:p-6 relative animate-in zoom-in-95 slide-in-from-top-4 duration-200"
      >
        {/* Header with Title & Close Button */}

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 relative">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSuggestions(true);
              }} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-sans"
              autoComplete="off"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                title="Clear input"
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
                  <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
                    {suggestions.map((item) => {
                      const itemId = item.id || item._id;
                      return (
                        <Link
                          key={itemId}
                          href={`/clothes/${itemId}`}
                          onClick={handleClose}
                          className="flex items-center gap-3.5 p-3 sm:px-4 hover:bg-accent/60 transition-colors group"
                        >
                          <img
                            src={item.image || '/placeholder-cloth.jpg'}
                            alt={item.title}
                            className="w-11 h-11 rounded-lg object-cover border border-border shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground group-hover:text-[#1C3B27] truncate transition-colors">
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
                              ${Number(item.price).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
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
                      handleSearchSubmit(e);
                    }}
                    className="w-full py-2.5 px-4 bg-muted/40 hover:bg-muted text-xs font-semibold text-[#1C3B27] text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>View all matching results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Popular Tags */}
        <div className="mt-3.5 pt-3 border-t border-border/50 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-muted-foreground mr-1">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSearchQuery(tag);
                handleSearchSubmit(undefined, tag);
              }}
              className="px-2.5 py-1 rounded-full bg-muted/60 hover:bg-muted text-[11px] text-foreground font-medium transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

