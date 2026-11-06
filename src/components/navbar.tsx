'use client';

import React, { useState, useRef, useEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/context/wishlist-context';
import { toast } from 'sonner';
import {
  Heart,
  PlusCircle,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Search,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface SubcategoryItem {
  name: string;
  href: string;
}

interface CategoryNav {
  name: string;
  href: string;
  subcategories: SubcategoryItem[];
}

const CATEGORY_NAV: CategoryNav[] = [
  {
    name: 'Shirts',
    href: '/clothes?search=Shirt',
    subcategories: [
      { name: 'Classic Fit', href: '/clothes?search=Classic+Fit' },
      { name: 'Formal Shirt', href: '/clothes?search=Formal+Shirt' },
      { name: 'Half Sleeve', href: '/clothes?search=Half+Sleeve' },
      { name: 'Over Shirt', href: '/clothes?search=Over+Shirt' },
    ],
  },
  {
    name: 'Katua',
    href: '/clothes?search=Katua',
    subcategories: [
      { name: 'Short Katua', href: '/clothes?search=Short+Katua' },
      { name: 'Long Katua', href: '/clothes?search=Long+Katua' },
      { name: 'Casual Katua', href: '/clothes?search=Casual+Katua' },
      { name: 'Festive Katua', href: '/clothes?search=Festive+Katua' },
    ],
  },
  {
    name: 'Panjabi',
    href: '/clothes?search=Panjabi',
    subcategories: [
      { name: 'Semi-Fitted Panjabi', href: '/clothes?search=Semi-Fitted+Panjabi' },
      { name: 'Kabli Panjabi', href: '/clothes?search=Kabli+Panjabi' },
      { name: 'Premium Cotton Panjabi', href: '/clothes?search=Premium+Cotton' },
      { name: 'Silk Panjabi', href: '/clothes?search=Silk+Panjabi' },
    ],
  },
  {
    name: 'T-Shirt',
    href: '/clothes?search=T-Shirt',
    subcategories: [
      { name: 'Crew Neck', href: '/clothes?search=Crew+Neck' },
      { name: 'Oversized Drop Shoulder', href: '/clothes?search=Oversized' },
      { name: 'Graphic Tee', href: '/clothes?search=Graphic+Tee' },
      { name: 'Pima Cotton Tee', href: '/clothes?search=Pima+Cotton' },
    ],
  },
  {
    name: 'Polo Shirt',
    href: '/clothes?search=Polo',
    subcategories: [
      { name: 'Solid Polo', href: '/clothes?search=Solid+Polo' },
      { name: 'Tipped Collar Polo', href: '/clothes?search=Tipped+Collar' },
      { name: 'Textured Knit Polo', href: '/clothes?search=Textured+Knit' },
      { name: 'Long Sleeve Polo', href: '/clothes?search=Long+Sleeve' },
    ],
  },
  {
    name: 'Pant',
    href: '/clothes?search=Pant',
    subcategories: [
      { name: 'Chino Pant', href: '/clothes?search=Chino' },
      { name: 'Formal Trouser', href: '/clothes?search=Formal+Trouser' },
      { name: 'Denim Jeans', href: '/clothes?search=Denim' },
      { name: 'Cargo Pant', href: '/clothes?search=Cargo' },
    ],
  },
  {
    name: 'Winter',
    href: '/clothes?search=Winter',
    subcategories: [
      { name: 'Hoodies & Sweatshirts', href: '/clothes?search=Hoodie' },
      { name: 'Jackets & Windbreakers', href: '/clothes?search=Jacket' },
      { name: 'Sweaters & Knitwear', href: '/clothes?search=Knitwear' },
      { name: 'Blazers & Overcoats', href: '/clothes?search=Blazer' },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { wishlistIds } = useWishlist();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // Close menus on route navigation
  useEffect(() => {
    startTransition(() => {
      setMobileMenuOpen(false);
      setDropdownOpen(false);
      setActiveHoverCategory(null);
    });
  }, [pathname]);

  // Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
        setActiveHoverCategory(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
        setActiveHoverCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Category Hover Handlers (Smooth 150ms leave delay to prevent flicker)
  const handleCategoryMouseEnter = (catName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveHoverCategory(catName);
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverCategory(null);
    }, 150);
  };

  // User Dropdown Handlers
  const handleUserMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleUserMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('reset-home-view'));
    }
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 dark:bg-background/60 backdrop-blur-xl transition-all duration-300 shadow-xs"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ROW 1: Search (Left), Centered Logo, Action Icons & User (Right) */}
        <div className="h-16 sm:h-18 flex items-center justify-between relative">
          {/* Left: Search Button (Desktop) & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>

            {/* Circular Search Button */}
            <button
              type="button"
              onClick={handleSearchClick}
              aria-label="Search Apparel"
              title="Search clothing (Ctrl+K)"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center group cursor-pointer select-none"
            >
              {/* Bold Spaced Brand Typography */}
              <span className="font-heading font-black text-2xl sm:text-[28px] md:text-[32px] tracking-[0.24em] text-foreground uppercase group-hover:opacity-80 transition-opacity">
                AYRO
              </span>
            </Link>
          </div>

          {/* Right: Actions (Wishlist when logged in, Bag, User) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Wishlist Link (Only shown when logged in) */}
            {user && (
              <Link
                href="/clothes?wishlist=true"
                aria-label="Wishlist"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors relative shrink-0"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>
            )}

            {/* Orders / Cart Bag Icon */}
            <Link
              href={user ? '/my-orders' : '/login?redirect=/my-orders'}
              onClick={() => {
                if (!user) {
                  toast.error('Please log in to review your orders.', { id: 'auth-required' });
                }
              }}
              aria-label="My Orders"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative shrink-0"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>

            {/* User Profile Section */}
            {user ? (
              <div
                className="relative shrink-0"
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-rose-500/30 transition-all cursor-pointer shrink-0"
                  aria-label="User Account Menu"
                >
                  <Image
                    src={user.photoURL || '/client-review-1.jpg'}
                    alt={user.name || 'User avatar'}
                    width={40}
                    height={40}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* User Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 pt-2 w-72 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="rounded-2xl border border-border bg-card p-2.5 shadow-2xl">
                      <div className="px-3.5 py-2.5 border-b border-border/60 mb-1 bg-muted/40 rounded-xl">
                        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="w-4.5 h-4.5 text-rose-500" />
                        Dashboard
                      </Link>

                      <Link
                        href="/add-cloth"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <PlusCircle className="w-4.5 h-4.5 text-rose-500" />
                        Add Clothing
                      </Link>

                      <Link
                        href="/my-listings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <Package className="w-4.5 h-4.5 text-amber-500" />
                        My Listings
                      </Link>

                      <Link
                        href="/my-orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <ShoppingBag className="w-4.5 h-4.5 text-blue-500" />
                        My Orders
                      </Link>

                      <Link
                        href="/clothes?wishlist=true"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <Heart className="w-4.5 h-4.5 text-rose-500" />
                        Saved Wishlist
                        {wishlistIds.length > 0 && (
                          <span className="ml-auto text-[11px] bg-rose-500/10 text-rose-600 font-bold px-2 py-0.5 rounded-full">
                            {wishlistIds.length}
                          </span>
                        )}
                      </Link>

                      <div className="border-t border-border/60 my-1.5" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4.5 h-4.5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="relative shrink-0"
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="Account Menu"
                  title="Sign in or Register"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
                >
                  <UserIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>

                {/* Guest Account Dropdown (Sign in / Register) */}
                {dropdownOpen && (
                  <div className="absolute right-0 pt-2 w-44 sm:w-48 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="rounded-lg border border-border/80 bg-card/95 backdrop-blur-xl py-2 shadow-2xl overflow-hidden">
                      <Link
                        href="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-[#b57a48] dark:hover:text-[#d49767] transition-colors cursor-pointer"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-[#b57a48] dark:hover:text-[#d49767] transition-colors cursor-pointer"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Desktop Categories Navigation with Hover Dropdowns */}
        <nav className="hidden lg:flex items-center justify-center gap-7 sm:gap-9 xl:gap-11 pb-3 pt-0.5 border-t border-border/25">
          {CATEGORY_NAV.map((cat) => (
            <div
              key={cat.name}
              className="relative py-1"
              onMouseEnter={() => handleCategoryMouseEnter(cat.name)}
              onMouseLeave={handleCategoryMouseLeave}
            >
              {/* Category Link (14px Jost font) */}
              <Link
                href={cat.href}
                className={`text-[13.5px] sm:text-[14px] font-medium tracking-normal transition-colors duration-150 cursor-pointer block select-none px-1 py-0.5 ${
                  activeHoverCategory === cat.name
                    ? 'text-[#b57a48] dark:text-[#d49767] font-semibold'
                    : 'text-foreground/90 hover:text-[#b57a48] dark:hover:text-[#d49767]'
                }`}
              >
                {cat.name}
              </Link>

              {/* Dropdown Menu on Mouse Hover */}
              {activeHoverCategory === cat.name && (
                <div
                  className="absolute left-0 top-full pt-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleCategoryMouseEnter(cat.name)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <div className="w-52 sm:w-56 bg-card/95 dark:bg-card/95 backdrop-blur-xl border border-border/70 rounded-xs shadow-xl overflow-hidden py-0">
                    {cat.subcategories.map((sub, idx) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setActiveHoverCategory(null)}
                        className={`block px-6 py-3.5 text-[13.5px] font-medium text-foreground hover:bg-muted/50 hover:text-[#b57a48] dark:hover:text-[#d49767] transition-colors cursor-pointer ${
                          idx !== cat.subcategories.length - 1 ? 'border-b border-border/50' : ''
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-16 bg-black/50 backdrop-blur-xs z-40 animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="lg:hidden relative z-50 border-b border-border bg-card px-5 pt-5 pb-8 space-y-5 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* User Card if logged in */}
            {user ? (
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/40 border border-border">
                <Image
                  src={user.photoURL || '/client-review-1.jpg'}
                  alt={user.name || 'User avatar'}
                  width={44}
                  height={44}
                  unoptimized
                  className="w-11 h-11 rounded-full object-cover border border-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2.5 pb-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center text-sm font-bold border border-border rounded-xl tracking-wide hover:bg-accent transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 rounded-xl tracking-wide hover:from-rose-500 hover:to-amber-500 transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Categories Accordion */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block px-1 mb-1">
                Apparel Categories
              </span>
              {CATEGORY_NAV.map((cat) => (
                <div key={cat.name} className="border-b border-border/40 last:border-b-0">
                  <div className="flex items-center justify-between py-3 px-1">
                    <Link
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-foreground hover:text-[#b57a48]"
                    >
                      {cat.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpandedCat(mobileExpandedCat === cat.name ? null : cat.name)
                      }
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                      aria-label={`Toggle ${cat.name} Subcategories`}
                    >
                      <ChevronDown
                        className={`w-4.5 h-4.5 transition-transform ${
                          mobileExpandedCat === cat.name ? 'rotate-180 text-[#b57a48]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {mobileExpandedCat === cat.name && (
                    <div className="pl-4 pb-3 space-y-2 animate-in fade-in duration-150">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-[#b57a48] transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[#b57a48]" />
                          <span>{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
