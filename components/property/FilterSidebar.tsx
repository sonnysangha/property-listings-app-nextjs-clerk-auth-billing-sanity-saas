"use client";

import { Filter, RotateCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROPERTY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
];

const BEDROOM_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const BATHROOM_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    beds: searchParams.get("beds") || "0",
    baths: searchParams.get("baths") || "0",
    type: searchParams.get("type") || "all",
    city: searchParams.get("city") || "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.beds && filters.beds !== "0") params.set("beds", filters.beds);
    if (filters.baths && filters.baths !== "0")
      params.set("baths", filters.baths);
    if (filters.type && filters.type !== "all") params.set("type", filters.type);
    if (filters.city) params.set("city", filters.city);

    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      beds: "0",
      baths: "0",
      type: "all",
      city: "",
    });
    router.push("/properties");
  };

  const hasActiveFilters =
    filters.minPrice ||
    filters.maxPrice ||
    (filters.beds && filters.beds !== "0") ||
    (filters.baths && filters.baths !== "0") ||
    (filters.type && filters.type !== "all") ||
    filters.city;

  return (
    <div className="bg-background rounded-2xl border border-border/50 shadow-warm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="font-semibold font-heading text-lg">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="city"
            placeholder="City or ZIP code…"
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            autoComplete="address-level2"
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Property Type
          </Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="sr-only">
                Minimum price
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Min…"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="tabular-nums"
              />
            </div>
            <div className="flex items-center text-muted-foreground">–</div>
            <div className="flex-1">
              <Label htmlFor="maxPrice" className="sr-only">
                Maximum price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Max…"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="beds" className="text-sm font-medium">
              Bedrooms
            </Label>
            <Select
              value={filters.beds}
              onValueChange={(value) => handleFilterChange("beds", value)}
            >
              <SelectTrigger id="beds" className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baths" className="text-sm font-medium">
              Bathrooms
            </Label>
            <Select
              value={filters.baths}
              onValueChange={(value) => handleFilterChange("baths", value)}
            >
              <SelectTrigger id="baths" className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {BATHROOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          <Button onClick={applyFilters} className="w-full">
            <Search className="h-4 w-4 mr-2" aria-hidden="true" />
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
