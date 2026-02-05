"use client";

import { Bath, Bed, Heart, MapPin, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  onSave?: (propertyId: string) => void;
  isSaved?: boolean;
  showRemoveButton?: boolean;
}

export function PropertyCard({
  property,
  onSave,
  isSaved,
  showRemoveButton: _showRemoveButton,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(property._id);
    }
  };

  const statusLabel =
    property.status && property.status !== "active"
      ? property.status.charAt(0).toUpperCase() + property.status.slice(1)
      : null;

  return (
    <Link href={`/properties/${property._id}`} className="group block">
      <article className="bg-card text-card-foreground overflow-hidden rounded-2xl border border-border/50 shadow-warm transition-[transform,box-shadow] duration-300 hover:shadow-warm-lg hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.image?.asset ? (
            <Image
              src={urlFor(property.image).width(600).height(450).url()}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          {statusLabel && (
            <Badge
              variant={property.status === "sold" ? "destructive" : "muted"}
              className="absolute top-3 left-3 shadow-sm"
            >
              {statusLabel}
            </Badge>
          )}

          {/* Property Type Badge */}
          {property.propertyType && (
            <Badge
              variant="secondary"
              className="absolute bottom-3 left-3 capitalize shadow-sm bg-background/90 backdrop-blur-sm"
            >
              {property.propertyType}
            </Badge>
          )}

          {/* Save Button */}
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background shadow-sm"
              onClick={handleSaveClick}
              aria-label={
                isSaved ? "Remove from saved properties" : "Save property"
              }
            >
              <Heart
                className={`h-5 w-5 transition-colors duration-200 ${
                  isSaved
                    ? "fill-primary text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
                aria-hidden="true"
              />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold font-heading text-xl tabular-nums">
              {formatPrice(property.price)}
            </h3>
          </div>

          {/* Title */}
          <p className="text-sm text-muted-foreground line-clamp-1 mb-4 min-w-0">
            {property.title}
          </p>

          {/* Property Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{property.bedrooms}</span>
                <span className="sr-only sm:not-sr-only">&nbsp;beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{property.bathrooms}</span>
                <span className="sr-only sm:not-sr-only">&nbsp;baths</span>
              </div>
            )}
            {property.squareFeet && (
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="tabular-nums">
                  {property.squareFeet.toLocaleString()}
                </span>
                <span className="sr-only sm:not-sr-only">&nbsp;sqft</span>
              </div>
            )}
          </div>

          {/* Location */}
          {property.address && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="line-clamp-1 min-w-0">
                {property.address.city}, {property.address.state}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
