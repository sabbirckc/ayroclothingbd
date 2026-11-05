'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  title,
  itemName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg text-foreground">
              {title || 'Delete Clothing Listing'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently remove <span className="font-semibold text-foreground">&ldquo;{itemName}&rdquo;</span> from ClothSpace? This action cannot be reversed.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent rounded-xl border border-border transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md hover:shadow-rose-500/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Listing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

