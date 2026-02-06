"use client";

import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/types";

interface ImageGalleryProps {
  images: SanityImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    },
    [goToPrevious, goToNext],
  );

  const openLightbox = useCallback(() => setLightboxOpen(true), []);

  const handleMainImageKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox();
      }
      handleKeyDown(e);
    },
    [openLightbox, handleKeyDown],
  );

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted rounded-2xl flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <>
      <section
        className="space-y-4"
        aria-label="Image gallery"
        onKeyDown={handleKeyDown}
      >
        {/* Main image + arrows: wrapper is position container; lightbox trigger and prev/next are siblings to avoid nested buttons */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden group shadow-warm">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer rounded-2xl overflow-hidden"
            onClick={openLightbox}
            onKeyDown={handleMainImageKeyDown}
            aria-label="Open image gallery"
          >
            <Image
              src={urlFor(images[selectedIndex]).width(1200).height(675).url()}
              alt={images[selectedIndex].alt || title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-[background-color] duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-background/90 backdrop-blur-sm rounded-full p-3">
                  <Expand className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>
            {/* Counter Badge */}
            <span className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-warm tabular-nums">
              {selectedIndex + 1} / {images.length}
            </span>
          </button>

          {/* Navigation Arrows: siblings of lightbox trigger (no nested buttons) */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-warm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-warm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            role="listbox"
            aria-label="Image thumbnails"
          >
            {images.map((image, index) => (
              <button
                key={image.asset?._id || index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                role="option"
                aria-selected={index === selectedIndex}
                aria-label={`View image ${index + 1} of ${images.length}`}
                className={`relative flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border-2 transition-[border-color,transform,box-shadow] duration-200 ${
                  index === selectedIndex
                    ? "border-primary shadow-warm scale-105"
                    : "border-transparent hover:border-primary/50 hover:shadow-warm"
                }`}
              >
                <Image
                  src={urlFor(image).width(112).height(80).url()}
                  alt={image.alt || `${title} - Image ${index + 1}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl p-0 bg-black/95 border-none overscroll-contain">
          <DialogTitle className="sr-only">
            Image gallery: {title} — image {selectedIndex + 1} of {images.length}
          </DialogTitle>
          <section
            className="relative aspect-[16/9]"
            aria-label="Lightbox image viewer"
            onKeyDown={handleKeyDown}
          >
            <Image
              src={urlFor(images[selectedIndex]).width(1920).height(1080).url()}
              alt={images[selectedIndex].alt || title}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" aria-hidden="true" />
                </Button>
              </>
            )}

            {/* Counter */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium tabular-nums">
              {selectedIndex + 1} / {images.length}
            </span>
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
