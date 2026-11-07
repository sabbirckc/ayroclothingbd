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
  Home,
  Phone,
  Plus,
  Minus,
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
    href: '/clothes?category=Shirts',
    subcategories: [
      { name: 'Classic Fit', href: '/clothes?category=Shirts&subCategory=Classic+Fit' },
      { name: 'Formal Shirt', href: '/clothes?category=Shirts&subCategory=Formal+Shirt' },
      { name: 'Half Sleeve', href: '/clothes?category=Shirts&subCategory=Half+Sleeve' },
      { name: 'Over Shirt', href: '/clothes?category=Shirts&subCategory=Over+Shirt' },
    ],
  },
  {
    name: 'Katua',
    href: '/clothes?category=Katua',
    subcategories: [],
  },
  {
    name: 'Panjabi',
    href: '/clothes?category=Panjabi',
    subcategories: [
      { name: 'Semi-Fitted Panjabi', href: '/clothes?category=Panjabi&search=Semi-Fitted' },
      { name: 'Kabli Panjabi', href: '/clothes?category=Panjabi&search=Kabli' },
      { name: 'Premium Cotton Panjabi', href: '/clothes?category=Panjabi&search=Premium+Cotton' },
      { name: 'Silk Panjabi', href: '/clothes?category=Panjabi&search=Silk' },
    ],
  },
  {
    name: 'T-Shirt',
    href: '/clothes?category=T-Shirt',
    subcategories: [],
  },
  {
    name: 'Polo Shirt',
    href: '/clothes?category=Polo+Shirt',
    subcategories: [],
  },
  {
    name: 'Pant',
    href: '/clothes?category=Pant',
    subcategories: [
      { name: 'Chino Pant', href: '/clothes?category=Pant&search=Chino' },
      { name: 'Formal Trouser', href: '/clothes?category=Pant&search=Formal+Trouser' },
      { name: 'Denim Jeans', href: '/clothes?category=Pant&search=Denim' },
      { name: 'Cargo Pant', href: '/clothes?category=Pant&search=Cargo' },
    ],
  },
  {
    name: 'Winter',
    href: '/clothes?category=Winter',
    subcategories: [
      { name: 'Hoodies & Sweatshirts', href: '/clothes?category=Winter&search=Hoodie' },
      { name: 'Jackets & Windbreakers', href: '/clothes?category=Winter&search=Jacket' },
      { name: 'Sweaters & Knitwear', href: '/clothes?category=Winter&search=Knitwear' },
      { name: 'Blazers & Overcoats', href: '/clothes?category=Winter&search=Blazer' },
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
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
      if (
        headerRef.current &&
        !headerRef.current.contains(target) &&
        (!drawerRef.current || !drawerRef.current.contains(target))
      ) {
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
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 dark:bg-background/60 backdrop-blur-xl transition-all duration-300 shadow-xs"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* ROW 1: Search (Left), Centered Logo, Action Icons / Mobile Menu (Right) */}
          <div className="h-16 sm:h-18 flex items-center justify-between relative">
            {/* Left: Circular Search Button */}
            <div className="flex items-center">
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
                <span className="font-heading font-black text-2xl sm:text-[28px] md:text-[32px] tracking-[0.24em] text-foreground uppercase group-hover:opacity-80 transition-opacity">
                  AYRO
                </span>
              </Link>
            </div>

            {/* Right: Desktop Actions & Mobile Hamburger Menu */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Desktop Only Actions (Wishlist, Bag, User) */}
              <div className="hidden lg:flex items-center gap-2 sm:gap-2.5">
                {/* Wishlist Link (Logged In) */}
                {user && (
                  <Link
                    href="/clothes?wishlist=true"
                    aria-label="Wishlist"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-[#1C3B27] hover:bg-[#1C3B27]/10 transition-colors relative shrink-0"
                  >
                    <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    {wishlistIds.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#1C3B27] text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-xs">
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
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  user.role === 'admin'
                                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {user.role === 'admin' ? 'Admin' : 'Customer'}
                              </span>
                            </div>
                            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium truncate mt-0.5">{user.email}</p>
                          </div>

                          {/* Admin Only Navigation Links */}
                          {user.role === 'admin' && (
                            <>
                              <Link
                                href="/dashboard"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                              >
                                <LayoutDashboard className="w-4.5 h-4.5 text-rose-500" />
                                Admin Dashboard
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
                                Manage Products
                              </Link>

                              <div className="border-t border-border/40 my-1" />
                            </>
                          )}

                          {/* Customer & Shared Links */}
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
                            className="block px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-[#1C3B27] transition-colors cursor-pointer"
                          >
                            Sign in
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-[#1C3B27] transition-colors cursor-pointer"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Right: Hamburger Menu Button (Matches Reference cb41fee6.jpg) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-foreground hover:text-[#1C3B27] transition-colors cursor-pointer shrink-0"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
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
                  className={`text-[13.5px] sm:text-[14px] font-medium tracking-normal transition-colors duration-150 cursor-pointer block select-none px-1 py-0.5 ${activeHoverCategory === cat.name
                    ? 'text-[#1C3B27] font-semibold'
                    : 'text-foreground/90 hover:text-[#1C3B27]'
                    }`}
                >
                  {cat.name}
                </Link>

                {/* Dropdown Menu on Mouse Hover */}
                {activeHoverCategory === cat.name && cat.subcategories.length > 0 && (
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
                          className={`block px-6 py-3.5 text-[13.5px] font-medium text-foreground hover:bg-muted/50 hover:text-[#1C3B27] transition-colors cursor-pointer ${idx !== cat.subcategories.length - 1 ? 'border-b border-border/50' : ''
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
      </header>

      {/* Mobile Slide-out Side Drawer (Matches Reference) */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 z-50 w-[84%] max-w-[340px] bg-background border-l border-border/40 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 ease-out"
          >
            {/* Top Bar: Brand Logo + Camel Circular Close Button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 shrink-0">
              <Link
                href="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (pathname === '/') {
                    window.dispatchEvent(new CustomEvent('reset-home-view'));
                  }
                }}
                className="flex items-center"
              >
                <span className="font-heading font-black text-2xl tracking-[0.25em] text-foreground">
                  AYRO
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation Menu"
                className="w-10 h-10 rounded-full bg-[#1C3B27] text-white flex items-center justify-center shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Middle: Category Items List (Uppercase with Square [+] Box) */}
            <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-border/50">
              {CATEGORY_NAV.map((cat) => {
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isExpanded = mobileExpandedCat === cat.name;

                return (
                  <div key={cat.name} className="py-0.5">
                    <div className="flex items-center justify-between py-3.5">
                      <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[13.5px] sm:text-[14px] font-semibold uppercase tracking-wider text-foreground/90 hover:text-[#1C3B27] transition-colors"
                      >
                        {cat.name}
                      </Link>

                      {hasSubs && (
                        <button
                          type="button"
                          onClick={() => setMobileExpandedCat(isExpanded ? null : cat.name)}
                          className="w-7 h-7 sm:w-7.5 sm:h-7.5 border border-border/80 flex items-center justify-center text-foreground hover:border-[#1C3B27] hover:text-[#1C3B27] transition-colors cursor-pointer shrink-0"
                          aria-label={`Toggle ${cat.name} Subcategories`}
                        >
                          {isExpanded ? (
                            <Minus className="w-3.5 h-3.5 stroke-[2]" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 stroke-[2]" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subcategories accordion */}
                    {hasSubs && isExpanded && (
                      <div className="pl-3 pb-3 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1 text-[13px] text-muted-foreground hover:text-[#1C3B27] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom User Section in Mobile Drawer */}
            {user && (
              <div className="border-t border-border/40 bg-muted/20 shrink-0 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Image
                      src={user.photoURL || '/client-review-1.jpg'}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            user.role === 'admin'
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 cursor-pointer shrink-0"
                  >
                    Sign out
                  </button>
                </div>

                {/* Mobile Drawer Quick Links */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                  {user.role === 'admin' ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-accent text-foreground"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-rose-500" />
                        Dashboard
                      </Link>
                      <Link
                        href="/add-cloth"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-accent text-foreground"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
                        Add Cloth
                      </Link>
                      <Link
                        href="/my-listings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="col-span-2 flex items-center justify-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-accent text-foreground"
                      >
                        <Package className="w-3.5 h-3.5 text-amber-500" />
                        Manage All Products
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/my-orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-accent text-foreground"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                        My Orders
                      </Link>
                      <Link
                        href="/clothes?wishlist=true"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-accent text-foreground"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Wishlist ({wishlistIds.length})
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/60 px-2 sm:px-6 py-2 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]"
      >
        <div className="w-full grid grid-cols-4 items-center text-center relative">
          {/* Tab 1: Home */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.dispatchEvent(new CustomEvent('reset-home-view'));
              }
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors cursor-pointer w-full ${pathname === '/'
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground hover:text-[#1C3B27]'
              }`}
          >
            <Home className="w-5 h-5 fill-current" />
            <span className="text-[11px] font-medium leading-none">Home</span>
          </Link>

          {/* Tab 2: Contact */}
          <a
            href="tel:+8801700000000"
            className="flex flex-col items-center justify-center gap-1 py-1 text-muted-foreground hover:text-[#1C3B27] transition-colors cursor-pointer w-full"
          >
            <Phone className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">Contact</span>
          </a>

          {/* Tab 3: Cart */}
          <Link
            href={user ? '/my-orders' : '/login?redirect=/my-orders'}
            onClick={() => {
              if (!user) {
                toast.error('Please log in to review your orders.', { id: 'auth-required' });
              }
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 text-muted-foreground hover:text-[#1C3B27] transition-colors cursor-pointer w-full"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">Cart ({wishlistIds.length > 0 ? wishlistIds.length : 0})</span>
          </Link>

          {/* Tab 4: Login / Account */}
          <Link
            href={user ? (user.role === 'admin' ? '/dashboard' : '/my-orders') : '/login'}
            className="flex flex-col items-center justify-center gap-1 py-1 text-muted-foreground hover:text-[#1C3B27] transition-colors cursor-pointer w-full"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-none">
              {user ? (user.role === 'admin' ? 'Admin' : 'Account') : 'Login'}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
