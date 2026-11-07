'use client';

import React from 'react';

export function ClothCardSkeleton() {
  return (
        <div className="flex flex-col h-full rounded-md border border-border/60 bg-card overflow-hidden animate-pulse">
          <div className="w-full aspect-[3/4] bg-muted relative" />
          <div className="p-3 sm:p-4 flex flex-col flex-1 items-center justify-between gap-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
        );
}

        export function ClothGridSkeleton({count = 6}: {count ?: number}) {
  return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <ClothCardSkeleton key={i} />
          ))}
        </div>
        );
}

        export function DetailSkeleton() {
  return (
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-[4/5] bg-muted rounded-3xl" />
            <div className="space-y-4">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded" />
              <div className="h-24 w-full bg-muted rounded-2xl" />
              <div className="h-10 w-full bg-muted rounded-xl" />
              <div className="h-12 w-full bg-muted rounded-xl" />
            </div>
          </div>
        </div>
        );
}

        export function TableRowSkeleton() {
  return (
        <tr className="animate-pulse border-b border-border">
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 bg-muted rounded-lg" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
          </td>
          <td className="p-4"><div className="h-4 w-20 bg-muted rounded" /></td>
          <td className="p-4"><div className="h-4 w-12 bg-muted rounded" /></td>
          <td className="p-4"><div className="h-4 w-12 bg-muted rounded" /></td>
          <td className="p-4"><div className="h-4 w-16 bg-muted rounded" /></td>
          <td className="p-4"><div className="h-8 w-24 bg-muted rounded-lg" /></td>
        </tr>
        );
}

