"use client";

import type { Property } from "@/types";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  onSave?: (propertyId: string) => void;
  savedIds?: string[];
  showRemoveButton?: boolean;
}

export function PropertyGrid({
  properties,
  onSave,
  savedIds = [],
  showRemoveButton,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          onSave={onSave}
          isSaved={savedIds.includes(property._id)}
          showRemoveButton={showRemoveButton}
        />
      ))}
    </div>
  );
}
