"use client";

import { useState } from "react";
import { ProductPicture } from "@/components/ui/ProductPicture";

export function ProductGallery({ images }: { images: { url: string; alt: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex shrink-0 gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-input border ${
                i === activeIndex ? "border-brand-black" : "border-border-subtle"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <ProductPicture src={img.url} alt={img.alt} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-button border border-border-subtle"
        aria-label="Click to zoom"
      >
        <ProductPicture src={active.url} alt={active.alt} className="h-full w-full" />
      </button>

      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" onClick={() => setZoomed(false)}>
          <button
            aria-label="Close zoom"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setZoomed(false)}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          </button>
          <div className="relative h-full max-h-[80vh] w-full max-w-2xl">
            <ProductPicture src={active.url} alt={active.alt} className="h-full w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
