'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Ruler, X, Check, HelpCircle, ArrowRight } from 'lucide-react';

interface SizeChartModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  category?: string;
  selectedSize?: string;
  clothTitle?: string;
}

interface SizeRow {
  size: string;
  chestIn: string;
  chestCm: string;
  lengthIn: string;
  lengthCm: string;
  shoulderIn: string;
  shoulderCm: string;
  sleeveIn: string;
  sleeveCm: string;
}

const TOPS_SIZES: SizeRow[] = [
  { size: 'XS', chestIn: '36 - 38', chestCm: '91 - 96', lengthIn: '26.5', lengthCm: '67', shoulderIn: '16.5', shoulderCm: '42', sleeveIn: '24.0', sleeveCm: '61' },
  { size: 'S',  chestIn: '38 - 40', chestCm: '96 - 101', lengthIn: '27.5', lengthCm: '70', shoulderIn: '17.5', shoulderCm: '44', sleeveIn: '24.8', sleeveCm: '63' },
  { size: 'M',  chestIn: '40 - 42', chestCm: '101 - 106', lengthIn: '28.5', lengthCm: '72', shoulderIn: '18.5', shoulderCm: '47', sleeveIn: '25.5', sleeveCm: '65' },
  { size: 'L',  chestIn: '42 - 44', chestCm: '106 - 112', lengthIn: '29.5', lengthCm: '75', shoulderIn: '19.5', shoulderCm: '49', sleeveIn: '26.3', sleeveCm: '67' },
  { size: 'XL', chestIn: '44 - 46', chestCm: '112 - 117', lengthIn: '30.5', lengthCm: '77', shoulderIn: '20.5', shoulderCm: '52', sleeveIn: '27.0', sleeveCm: '68' },
  { size: 'XXL', chestIn: '46 - 48', chestCm: '117 - 122', lengthIn: '31.5', lengthCm: '80', shoulderIn: '21.5', shoulderCm: '55', sleeveIn: '27.5', sleeveCm: '70' },
  { size: '3XL', chestIn: '48 - 50', chestCm: '122 - 127', lengthIn: '32.5', lengthCm: '82', shoulderIn: '22.5', shoulderCm: '57', sleeveIn: '28.0', sleeveCm: '71' },
];

const PANTS_SIZES = [
  { size: '28 (XS)', waistIn: '28 - 29', waistCm: '71 - 74', hipIn: '36', hipCm: '91', inseamIn: '30', inseamCm: '76', lengthIn: '39', lengthCm: '99' },
  { size: '30 (S)',  waistIn: '30 - 31', waistCm: '76 - 79', hipIn: '38', hipCm: '96', inseamIn: '31', inseamCm: '79', lengthIn: '40', lengthCm: '101' },
  { size: '32 (M)',  waistIn: '32 - 33', waistCm: '81 - 84', hipIn: '40', hipCm: '101', inseamIn: '32', inseamCm: '81', lengthIn: '41', lengthCm: '104' },
  { size: '34 (L)',  waistIn: '34 - 35', waistCm: '86 - 89', hipIn: '42', hipCm: '106', inseamIn: '32', inseamCm: '81', lengthIn: '42', lengthCm: '106' },
  { size: '36 (XL)', waistIn: '36 - 37', waistCm: '91 - 94', hipIn: '44', hipCm: '112', inseamIn: '33', inseamCm: '84', lengthIn: '43', lengthCm: '109' },
  { size: '38 (XXL)', waistIn: '38 - 40', waistCm: '96 - 101', hipIn: '46', hipCm: '117', inseamIn: '33', inseamCm: '84', lengthIn: '44', lengthCm: '112' },
];

export function SizeChartModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  category = 'Tops',
  selectedSize,
  clothTitle,
}: SizeChartModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [prevCategory, setPrevCategory] = useState(category);
  const [activeTab, setActiveTab] = useState<'tops' | 'bottoms'>(() => {
    const cat = (category || '').toLowerCase();
    return cat.includes('pant') || cat.includes('denim') || cat.includes('trouser') || cat.includes('bottom')
      ? 'bottoms'
      : 'tops';
  });
  const [contextTitle, setContextTitle] = useState<string | undefined>(clothTitle);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  if (category !== prevCategory) {
    setPrevCategory(category);
    const cat = (category || '').toLowerCase();
    setActiveTab(
      cat.includes('pant') || cat.includes('denim') || cat.includes('trouser') || cat.includes('bottom')
        ? 'bottoms'
        : 'tops'
    );
  }

  const handleClose = useCallback(() => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [isControlled, controlledOnClose]);

  // Global event listener for navbar or external triggers
  useEffect(() => {
    const handleOpen = (e: CustomEvent<{ category?: string; selectedSize?: string; title?: string }>) => {
      if (e.detail?.category) {
        const cat = e.detail.category.toLowerCase();
        setActiveTab(cat.includes('pant') || cat.includes('bottom') ? 'bottoms' : 'tops');
      }
      if (e.detail?.title) {
        setContextTitle(e.detail.title);
      }
      setInternalIsOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('open-size-chart-modal', handleOpen as EventListener);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-size-chart-modal', handleOpen as EventListener);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl p-5 sm:p-7 relative max-h-[92vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-foreground">
                Garment Size & Measurement Guide
              </h2>
              <p className="text-xs text-muted-foreground">
                {contextTitle || clothTitle
                  ? `Standard atelier dimensions for "${contextTitle || clothTitle}"`
                  : 'Atelier standardized dimensions for optimal fit and silhouette'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
            title="Close size chart (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls: Category Tabs & Unit Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('tops')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tops'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tops & Outerwear
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bottoms')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bottoms'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pants & Bottoms
            </button>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <span>Unit:</span>
            <div className="inline-flex p-0.5 rounded-lg bg-muted border border-border">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  unit === 'in'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  unit === 'cm'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {activeTab === 'tops' ? (
                <tr>
                  <th className="py-3 px-3.5">Size</th>
                  <th className="py-3 px-3.5">Chest / Bust</th>
                  <th className="py-3 px-3.5">Body Length</th>
                  <th className="py-3 px-3.5">Shoulder</th>
                  <th className="py-3 px-3.5">Sleeve</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-3 px-3.5">Size</th>
                  <th className="py-3 px-3.5">Waist</th>
                  <th className="py-3 px-3.5">Hip</th>
                  <th className="py-3 px-3.5">Inseam</th>
                  <th className="py-3 px-3.5">Total Length</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-border/60">
              {activeTab === 'tops'
                ? TOPS_SIZES.map((row) => {
                    const isSelected = selectedSize && selectedSize.toUpperCase() === row.size;
                    return (
                      <tr
                        key={row.size}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400'
                            : 'hover:bg-muted/30 text-foreground'
                        }`}
                      >
                        <td className="py-2.5 px-3.5 font-bold flex items-center gap-1.5">
                          <span>{row.size}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                        </td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.sleeveIn}"` : `${row.sleeveCm} cm`}</td>
                      </tr>
                    );
                  })
                : PANTS_SIZES.map((row) => {
                    const isSelected = selectedSize && selectedSize.toUpperCase().includes(row.size.slice(0, 2));
                    return (
                      <tr
                        key={row.size}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400'
                            : 'hover:bg-muted/30 text-foreground'
                        }`}
                      >
                        <td className="py-2.5 px-3.5 font-bold flex items-center gap-1.5">
                          <span>{row.size}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                        </td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.hipIn}"` : `${row.hipCm} cm`}</td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.inseamIn}"` : `${row.inseamCm} cm`}</td>
                        <td className="py-2.5 px-3.5">{unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* How to Measure Section */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <HelpCircle className="w-4 h-4 text-rose-500" />
            <span>How to Measure Your Garment Fit</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-muted-foreground leading-relaxed">
            <div className="space-y-1">
              <span className="font-bold text-foreground block">1. Chest / Bust</span>
              <p>Measure across the fullest part of your chest, keeping the tape straight under your arms.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-foreground block">2. Garment Length</span>
              <p>Measure from the highest point of the shoulder collar seam down to the bottom hemline.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-foreground block">3. Shoulder Width</span>
              <p>Measure straight across the back from the tip of one shoulder seam to the other.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-foreground block">4. Fit Recommendation</span>
              <p>For an oversized streetwear drape, choose one size up. For tailored formal wear, stick to true-to-size.</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-muted-foreground">
            Handcrafted with ±0.5&quot; atelier crafting tolerance.
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Close Chart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

