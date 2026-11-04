'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Grid,
  Film,
  Bookmark,
  Heart,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowUpRight,
  Shirt
} from 'lucide-react';

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  clothTitle: string;
  price: number;
  isVideo?: boolean;
  isMulti?: boolean;
}

const instagramPosts: InstagramPost[] = [
  {
    id: 'p1',
    image: '/image-1.jpg',
    likes: 142,
    comments: 18,
    caption: 'Rich burgundy pinstripe tailored silhouette. The hallmark of AYRO Timeless Essentials.',
    clothTitle: 'AYRO Tailored Burgundy Pinstripe Shirt',
    price: 85,
    isVideo: true,
  },
  {
    id: 'p2',
    image: '/image-2.jpg',
    likes: 98,
    comments: 12,
    caption: 'Campus walk in the signature deep plum cotton button-down. Effortlessly sharp.',
    clothTitle: 'AYRO Deep Plum Oxford Button-Down',
    price: 75,
    isVideo: true,
  },
  {
    id: 'p3',
    image: '/image-3.jpg',
    likes: 215,
    comments: 24,
    caption: 'Light sky breathable cotton with rolled cuffs. Made for warm afternoons and boardroom confidence.',
    clothTitle: 'AYRO Classic Sky Blue Chambray',
    price: 80,
    isMulti: true,
  },
  {
    id: 'p4',
    image: '/image-4.jpg',
    likes: 187,
    comments: 16,
    caption: 'Earthy taupe textured weave. Relaxed posture, structured collar.',
    clothTitle: 'AYRO Earth Taupe Textured Overshirt',
    price: 90,
    isMulti: true,
  },
  {
    id: 'p5',
    image: '/image-5.jpg',
    likes: 164,
    comments: 19,
    caption: 'Lounge in tailored linen. Clean stitching, hidden button-down tabs.',
    clothTitle: 'AYRO Minimalist Olive Linen Shirt',
    price: 85,
    isVideo: true,
  },
  {
    id: 'p6',
    image: '/image-6.jpg',
    likes: 132,
    comments: 11,
    caption: 'The back pleat and shoulder yoke construction. Precision you can feel.',
    clothTitle: 'AYRO Powder Blue Tailored Yoke Shirt',
    price: 78,
    isVideo: true,
  },
  {
    id: 'p7',
    image: '/image-7.jpg',
    likes: 156,
    comments: 22,
    caption: 'Abstract beige leaf motif. A subtle statement piece for modern gentlemen.',
    clothTitle: 'AYRO Botanical Motif Cream Shirt',
    price: 95,
    isVideo: true,
  },
  {
    id: 'p8',
    image: '/image-8.jpg',
    likes: 289,
    comments: 31,
    caption: 'Macro view of the cuff chain-stitching. No synthetic compromises.',
    clothTitle: 'AYRO Artisan French Cuff Pinstripe',
    price: 92,
    isVideo: true,
  },
  {
    id: 'p9',
    image: '/image-9.jpg',
    likes: 312,
    comments: 42,
    caption: 'The official AYRO 100% Cotton neck label. Timeless Essential guaranteed.',
    clothTitle: 'AYRO Signature Textured Cotton Button-Down',
    price: 88,
    isVideo: true,
  },
  {
    id: 'p10',
    image: '/image-10.jpg',
    likes: 420,
    comments: 55,
    caption: "Let's Go With AYRO — Timeless Essential campaign.",
    clothTitle: 'AYRO Campaign Heritage Pinstripe',
    price: 95,
    isVideo: true,
  },
  {
    id: 'p11',
    image: '/image-11.jpg',
    likes: 245,
    comments: 29,
    caption: 'Behind the fabric selection with the creative director. Pure slub weave.',
    clothTitle: 'AYRO Indigo Chambray Dotted Shirt',
    price: 82,
    isVideo: true,
  },
  {
    id: 'p12',
    image: '/home-1.jpg',
    likes: 198,
    comments: 21,
    caption: 'Collar detail showing the contrast inner trim and mother-of-pearl buttons.',
    clothTitle: 'AYRO Contrast Trim Executive Shirt',
    price: 89,
    isVideo: true,
  },
];

export function InstagramFeed() {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm space-y-8">
      {/* Instagram Header Interface */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 pb-6 border-b border-border/60">
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
            <div className="w-full h-full rounded-full bg-[#F5EFEB] dark:bg-stone-900 border-2 border-background flex flex-col items-center justify-center text-stone-900 dark:text-stone-100 shadow-inner">
              <span className="font-serif tracking-[0.25em] font-semibold text-lg pl-[0.25em]">
                AYRO
              </span>
            </div>
          </div>
        </div>

        {/* Profile Bio & Stats */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <h2 className="font-heading font-black text-xl sm:text-2xl text-foreground">
              ayroclothingbd
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-muted text-foreground border border-border'
                    : 'bg-[#0095F6] hover:bg-[#1877F2] text-white shadow-sm'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-lg bg-muted text-foreground border border-border text-xs font-semibold hover:bg-accent transition-colors"
              >
                Message
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center sm:justify-start gap-6 text-xs text-foreground">
            <div>
              <strong className="font-bold">24</strong> posts
            </div>
            <div>
              <strong className="font-bold">15</strong> followers
            </div>
            <div>
              <strong className="font-bold">35</strong> following
            </div>
          </div>

          {/* Bio text */}
          <div className="text-xs space-y-0.5 text-foreground leading-relaxed">
            <p className="font-bold">AYRO</p>
            <p className="text-muted-foreground">Clothing (Brand)</p>
            <p className="font-medium text-foreground">Premium Clothing Brand • Timeless Essential</p>
            <p className="text-[11px] text-muted-foreground pt-1">
              Followed by <span className="font-semibold text-foreground">thisisrupom</span> and{' '}
              <span className="font-semibold text-foreground">tanjinarahmansorna</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid Tabs: Posts, Reels, Saved */}
      <div className="flex justify-center border-b border-border/60">
        <div className="flex gap-8 sm:gap-12 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition-colors ${
              activeTab === 'posts'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Posts</span>
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition-colors ${
              activeTab === 'reels'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Reels</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition-colors ${
              activeTab === 'saved'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Tagged</span>
          </button>
        </div>
      </div>

      {/* Instagram Post Grid (4x3 / 3x4 layout matching the screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {instagramPosts.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/80 shadow-sm"
          >
            {/* Image */}
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Video / Carousel Badge icon in top-right as seen in Instagram */}
            <div className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white">
              {post.isVideo ? (
                <Film className="w-3.5 h-3.5" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Hover Overlay with Likes, Comments & "View Piece" link */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 text-white z-20">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-bold">
                    <Heart className="w-4 h-4 fill-white" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    {post.comments}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  AYRO Timeless Essential
                </span>
                <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                  {post.clothTitle}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-heading font-black text-sm text-white">
                    ${post.price}
                  </span>
                  <Link
                    href="/clothes"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to explore complete catalog */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground border-t border-border/50">
        <p>
          Discover all handcrafted shirts, button-downs, and pinstripe pieces from AYRO.
        </p>
        <Link
          href="/clothes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-500 transition-colors"
        >
          <span>Explore All AYRO Apparel</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
