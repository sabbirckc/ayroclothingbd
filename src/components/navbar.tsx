'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useWishlist } from '@/context/wishlist-context';
import { AyroLogo } from '@/components/ayro-logo';
import {
  Scissors,
  Sun,
  Moon,
  Heart,
  User as UserIcon,
  PlusCircle,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Search,
  Sparkles,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { wishlistIds } = useWishlist();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* AYRO Brand Logo */}
        <AyroLogo size="md" />

        {/* Desktop Navigation - Clean Jost Typography with letter-spacing */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-150 relative ${isActive(link.href)
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Shortcut */}
          <Link
            href="/clothes"
            aria-label="Search Apparel"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Theme Toggle (Challenge 3) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors relative"
          >
            <Heart className="w-4 h-4" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Orders / Cart Bag Icon with dynamic counter as seen in the screenshot */}
          <Link
            href="/my-orders"
            aria-label="My Orders"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-border bg-card hover:bg-accent transition-colors"
              >
                <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline-block font-sans">
                  {user.name.split(' ')[0]}
                </span>
                <img
                  src={user.photoURL || '/client-review-1.jpg'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl animate-in fade-in zoom-in-95 z-50">
                  <div className="px-3 py-2 border-b border-border/60 mb-1">
                    <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/my-listings"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-rose-500" />
                    Dashboard
                  </Link>

                  <Link
                    href="/add-cloth"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-500" />
                    Add New Clothing
                  </Link>

                  <Link
                    href="/my-listings"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <Package className="w-4 h-4 text-blue-500" />
                    My Clothing Listings
                  </Link>

                  <Link
                    href="/my-orders"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    My Orders
                  </Link>

                  <div className="border-t border-border/60 my-1" />

                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors sm:hidden"
                title="Login / Account"
              >
                <UserIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-accent rounded-lg transition-colors tracking-wide"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-lg shadow-sm hover:shadow transition-all tracking-wide"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-accent"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {
        mobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-card px-4 pt-2 pb-6 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium tracking-wide ${isActive(link.href)
                    ? 'text-rose-600 font-semibold bg-accent'
                    : 'text-muted-foreground'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

            </nav>

            {!user && (
              <div className="pt-3 border-t border-border flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold border border-border rounded-lg tracking-wide"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-rose-600 rounded-lg tracking-wide"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )
      }
    </header >
  );
}
