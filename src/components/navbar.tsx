'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useWishlist } from '@/context/wishlist-context';
import { AyroLogo } from '@/components/ayro-logo';
import {
  Sun,
  Moon,
  Heart,
  PlusCircle,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Search,
  LayoutDashboard
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { wishlistIds } = useWishlist();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const headerRef = React.useRef<HTMLElement | null>(null);

  // Close menus on route navigation
  React.useEffect(() => {
    React.startTransition(() => {
      setMobileMenuOpen(false);
      setDropdownOpen(false);
    });
  }, [pathname]);

  // Click outside & Escape key listeners
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
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

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  React.useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Clothes', href: '/clothes' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About Us', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* AYRO Brand Logo */}
        <AyroLogo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (link.href === '/' && pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.dispatchEvent(new CustomEvent('reset-home-view'));
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-150 relative cursor-pointer ${isActive(link.href)
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-rose-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Search Shortcut */}
          <button
            type="button"
            onClick={handleSearchClick}
            aria-label="Search Apparel"
            title="Search clothing on home page"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Theme Toggle (Desktop/Tablet) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="hidden sm:flex w-9 h-9 rounded-lg border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Wishlist Link */}
          <Link
            href="/clothes?wishlist=true"
            aria-label="Wishlist"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors relative"
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Orders / Cart Bag Icon (Desktop/Tablet) */}
          <Link
            href="/my-orders"
            aria-label="My Orders"
            className="hidden sm:flex w-9 h-9 rounded-lg border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>

          {/* User Auth Section (Desktop only - mobile opens via drawer) */}
          {user ? (
            <div
              className="relative hidden sm:block"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 rounded-full border border-border bg-card hover:bg-accent/80 transition-all duration-200 cursor-pointer shadow-xs"
                aria-label="User Menu"
              >
                <Image
                  src={user.photoURL || '/client-review-1.jpg'}
                  alt={user.name || 'User avatar'}
                  width={28}
                  height={28}
                  unoptimized
                  className="w-7 h-7 rounded-full object-cover border border-border ring-1 ring-border/50 shrink-0"
                />
                <div className="flex flex-col text-left max-w-[140px] leading-tight">
                  <span className="text-xs font-semibold text-foreground truncate">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                </div>
              </button>

                {/* User Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 pt-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="rounded-xl border border-border bg-card p-2 shadow-xl">
                      <div className="px-3.5 py-2.5 border-b border-border/60 mb-1 bg-muted/30 rounded-lg">
                        <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-rose-500" />
                        Dashboard
                      </Link>

                      <Link
                        href="/add-cloth"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-500" />
                        Add New Clothing
                      </Link>

                      <Link
                        href="/my-listings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <Package className="w-4 h-4 text-emerald-500" />
                        My Clothing Listings
                      </Link>

                      <Link
                        href="/my-orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-blue-500" />
                        My Purchased Orders
                      </Link>

                      <div className="border-t border-border/60 my-1 pt-1" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-accent rounded-lg transition-colors tracking-wide"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-lg shadow-sm hover:shadow transition-all tracking-wide"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-accent cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer & Click-Outside Backdrop */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop outside mobile menu */}
            <div
              className="lg:hidden fixed inset-0 top-16 bg-black/50 backdrop-blur-xs z-40 animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

              <div className="lg:hidden relative z-50 border-b border-border bg-card px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
                {user && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border">
                      <Image
                        src={user.photoURL || '/client-review-1.jpg'}
                        alt={user.name || 'User avatar'}
                        width={40}
                        height={40}
                        unoptimized
                        className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium truncate">{user.email}</p>
                      </div>
                    </div>
            )}

                    <nav className="flex flex-col space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={(e) => {
                            setMobileMenuOpen(false);
                            if (link.href === '/' && pathname === '/') {
                              e.preventDefault();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              window.dispatchEvent(new CustomEvent('reset-home-view'));
                            }
                          }}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${isActive(link.href)
                            ? 'text-rose-600 font-bold bg-rose-500/10 dark:bg-rose-950/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                            }`}
                        >
                          {link.name}
                        </Link>
                      ))}
            </nav>

            {/* Appearance Theme Toggle in Mobile Drawer */}
            <div className="pt-2 border-t border-border/70 flex items-center justify-between px-3.5">
              <span className="text-xs font-semibold text-muted-foreground">Theme</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {user ? (
              <div className="pt-3 border-t border-border/70 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3.5 block mb-1">
                  Atelier Dashboard
                </span>
                <Link
                  href="/add-cloth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-rose-500" />
                  <span>Add New Clothing</span>
                </Link>
                <Link
                  href="/my-listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  <Package className="w-4 h-4 text-amber-500" />
                  <span>My Listings</span>
                </Link>
                <Link
                  href="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                  <span>Designer Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
                ) : (
                <div className="pt-3 border-t border-border flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold border border-border rounded-xl tracking-wide hover:bg-accent transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-rose-600 rounded-xl tracking-wide hover:bg-rose-500 transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
            )}
              </div>
            </>
      )}
          </header>
        );
}
