"use client";

import { ChevronDown, Filter, RotateCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Amenity } from "@/types";

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
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5+", label: "5+" },
];

const BATHROOM_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5+", label: "5+" },
];

const DAYS_ON_MARKET_OPTIONS = [
  { value: "0", label: "Any" },
  { value: "1", label: "Last 24 hours" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
];

interface FilterSidebarProps {
  amenities: Amenity[];
}

export function FilterSidebar({ amenities }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [moreFiltersOpen, setMoreFiltersOpen] = useState(
    Boolean(
      searchParams.get("minSqft") ||
        searchParams.get("maxSqft") ||
        searchParams.get("minYear") ||
        searchParams.get("maxYear") ||
        searchParams.get("minLotSize") ||
        searchParams.get("maxLotSize") ||
        searchParams.get("daysOnMarket") ||
        searchParams.get("openHouse") ||
        searchParams.get("priceReduced") ||
        searchParams.get("amenities"),
    ),
  );

  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    beds: searchParams.get("beds") || "0",
    baths: searchParams.get("baths") || "0",
    type: searchParams.get("type") || "all",
    city: searchParams.get("city") || "",
    // Advanced filters
    minSqft: searchParams.get("minSqft") || "",
    maxSqft: searchParams.get("maxSqft") || "",
    minYear: searchParams.get("minYear") || "",
    maxYear: searchParams.get("maxYear") || "",
    minLotSize: searchParams.get("minLotSize") || "",
    maxLotSize: searchParams.get("maxLotSize") || "",
    daysOnMarket: searchParams.get("daysOnMarket") || "0",
    openHouse: searchParams.get("openHouse") === "true",
    priceReduced: searchParams.get("priceReduced") === "true",
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
  });

  const handleFilterChange = (
    key: string,
    value: string | boolean | string[],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    // Basic filters
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.beds && filters.beds !== "0") params.set("beds", filters.beds);
    if (filters.baths && filters.baths !== "0")
      params.set("baths", filters.baths);
    if (filters.type && filters.type !== "all")
      params.set("type", filters.type);
    if (filters.city) params.set("city", filters.city);

    // Advanced filters
    if (filters.minSqft) params.set("minSqft", filters.minSqft);
    if (filters.maxSqft) params.set("maxSqft", filters.maxSqft);
    if (filters.minYear) params.set("minYear", filters.minYear);
    if (filters.maxYear) params.set("maxYear", filters.maxYear);
    if (filters.minLotSize) params.set("minLotSize", filters.minLotSize);
    if (filters.maxLotSize) params.set("maxLotSize", filters.maxLotSize);
    if (filters.daysOnMarket && filters.daysOnMarket !== "0")
      params.set("daysOnMarket", filters.daysOnMarket);
    if (filters.openHouse) params.set("openHouse", "true");
    if (filters.priceReduced) params.set("priceReduced", "true");
    if (filters.amenities.length > 0)
      params.set("amenities", filters.amenities.join(","));

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
      minSqft: "",
      maxSqft: "",
      minYear: "",
      maxYear: "",
      minLotSize: "",
      maxLotSize: "",
      daysOnMarket: "0",
      openHouse: false,
      priceReduced: false,
      amenities: [],
    });
    router.push("/properties");
  };

  const hasActiveFilters =
    filters.minPrice ||
    filters.maxPrice ||
    (filters.beds && filters.beds !== "0") ||
    (filters.baths && filters.baths !== "0") ||
    (filters.type && filters.type !== "all") ||
    filters.city ||
    filters.minSqft ||
    filters.maxSqft ||
    filters.minYear ||
    filters.maxYear ||
    filters.minLotSize ||
    filters.maxLotSize ||
    (filters.daysOnMarket && filters.daysOnMarket !== "0") ||
    filters.openHouse ||
    filters.priceReduced ||
    filters.amenities.length > 0;

  const advancedFiltersCount = [
    filters.minSqft || filters.maxSqft,
    filters.minYear || filters.maxYear,
    filters.minLotSize || filters.maxLotSize,
    filters.daysOnMarket && filters.daysOnMarket !== "0",
    filters.openHouse,
    filters.priceReduced,
    filters.amenities.length > 0,
  ].filter(Boolean).length;

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

        {/* More Filters - Collapsible */}
        <Collapsible open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between w-full py-3 px-4 bg-accent/50 hover:bg-accent rounded-xl transition-colors"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                More Filters
                {advancedFiltersCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {advancedFiltersCount}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  moreFiltersOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-6">
            {/* Square Feet */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Square Feet</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="minSqft" className="sr-only">
                    Minimum square feet
                  </Label>
                  <Input
                    id="minSqft"
                    type="number"
                    placeholder="Min…"
                    value={filters.minSqft}
                    onChange={(e) =>
                      handleFilterChange("minSqft", e.target.value)
                    }
                    className="tabular-nums"
                  />
                </div>
                <div className="flex items-center text-muted-foreground">–</div>
                <div className="flex-1">
                  <Label htmlFor="maxSqft" className="sr-only">
                    Maximum square feet
                  </Label>
                  <Input
                    id="maxSqft"
                    type="number"
                    placeholder="Max…"
                    value={filters.maxSqft}
                    onChange={(e) =>
                      handleFilterChange("maxSqft", e.target.value)
                    }
                    className="tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Year Built */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Year Built</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="minYear" className="sr-only">
                    Minimum year
                  </Label>
                  <Input
                    id="minYear"
                    type="number"
                    placeholder="Min…"
                    value={filters.minYear}
                    onChange={(e) =>
                      handleFilterChange("minYear", e.target.value)
                    }
                    className="tabular-nums"
                  />
                </div>
                <div className="flex items-center text-muted-foreground">–</div>
                <div className="flex-1">
                  <Label htmlFor="maxYear" className="sr-only">
                    Maximum year
                  </Label>
                  <Input
                    id="maxYear"
                    type="number"
                    placeholder="Max…"
                    value={filters.maxYear}
                    onChange={(e) =>
                      handleFilterChange("maxYear", e.target.value)
                    }
                    className="tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Lot Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Lot Size (sq ft)</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="minLotSize" className="sr-only">
                    Minimum lot size
                  </Label>
                  <Input
                    id="minLotSize"
                    type="number"
                    placeholder="Min…"
                    value={filters.minLotSize}
                    onChange={(e) =>
                      handleFilterChange("minLotSize", e.target.value)
                    }
                    className="tabular-nums"
                  />
                </div>
                <div className="flex items-center text-muted-foreground">–</div>
                <div className="flex-1">
                  <Label htmlFor="maxLotSize" className="sr-only">
                    Maximum lot size
                  </Label>
                  <Input
                    id="maxLotSize"
                    type="number"
                    placeholder="Max…"
                    value={filters.maxLotSize}
                    onChange={(e) =>
                      handleFilterChange("maxLotSize", e.target.value)
                    }
                    className="tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Days on Market */}
            <div className="space-y-2">
              <Label htmlFor="daysOnMarket" className="text-sm font-medium">
                Days on Market
              </Label>
              <Select
                value={filters.daysOnMarket}
                onValueChange={(value) =>
                  handleFilterChange("daysOnMarket", value)
                }
              >
                <SelectTrigger id="daysOnMarket" className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_ON_MARKET_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Filters</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openHouse"
                    checked={filters.openHouse}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      handleFilterChange("openHouse", checked === true)
                    }
                  />
                  <Label
                    htmlFor="openHouse"
                    className="text-sm cursor-pointer font-normal"
                  >
                    Open house scheduled
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priceReduced"
                    checked={filters.priceReduced}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      handleFilterChange("priceReduced", checked === true)
                    }
                  />
                  <Label
                    htmlFor="priceReduced"
                    className="text-sm cursor-pointer font-normal"
                  >
                    Price reduced
                  </Label>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`amenity-${amenity.value}`}
                        checked={filters.amenities.includes(amenity.value)}
                        onCheckedChange={() =>
                          handleAmenityToggle(amenity.value)
                        }
                      />
                      <Label
                        htmlFor={`amenity-${amenity.value}`}
                        className="text-sm cursor-pointer font-normal"
                      >
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

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
