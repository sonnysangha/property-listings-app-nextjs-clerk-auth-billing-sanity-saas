"use client";

import debounce from "lodash.debounce";
import { CheckCircle2, Loader2, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AddressResult {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  formattedAddress: string;
}

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties?: {
    address?: string;
  };
  address?: string;
  text?: string;
}

interface AddressAutocompleteProps {
  value?: string;
  onChange: (address: AddressResult | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Start typing an address...",
  disabled,
  className,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(
    null,
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions from Mapbox
  const fetchSuggestions = useCallback(async (query: string) => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      // Focus on addresses with country filter for US
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${token}&types=address&limit=5&country=US`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      setSuggestions(data.features || []);
      setIsOpen(data.features?.length > 0);
    } catch (error) {
      console.error("Autocomplete error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => fetchSuggestions(query), 300),
    [fetchSuggestions],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Parse Mapbox feature into structured address
  const parseFeature = (feature: MapboxFeature): AddressResult => {
    let street = "";
    let city = "";
    let state = "";
    let zipCode = "";

    // Extract street number and name
    const streetNumber = feature.address || "";
    const streetName = feature.text || "";
    street = streetNumber ? `${streetNumber} ${streetName}` : streetName;

    // Parse context for city, state, zipCode
    if (feature.context) {
      for (const ctx of feature.context) {
        if (ctx.id.startsWith("place")) {
          city = ctx.text;
        } else if (ctx.id.startsWith("region")) {
          // Use short_code for state abbreviation (e.g., "US-CA" -> "CA")
          state = ctx.short_code?.replace("US-", "") || ctx.text;
        } else if (ctx.id.startsWith("postcode")) {
          zipCode = ctx.text;
        }
      }
    }

    const [lng, lat] = feature.center;

    return {
      street,
      city,
      state,
      zipCode,
      lat,
      lng,
      formattedAddress: feature.place_name,
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedAddress(null);
    setHighlightedIndex(-1);

    if (newValue.length >= 3) {
      debouncedSearch(newValue);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (feature: MapboxFeature) => {
    const parsed = parseFeature(feature);
    setInputValue(parsed.formattedAddress);
    setSelectedAddress(parsed);
    setSuggestions([]);
    setIsOpen(false);
    onChange(parsed);
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedAddress(null);
    setSuggestions([]);
    setIsOpen(false);
    onChange(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {selectedAddress && !isLoading && (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-muted rounded"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((feature, index) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => handleSelect(feature)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                "w-full px-4 py-3 text-left text-sm flex items-start gap-3 hover:bg-muted transition-colors",
                highlightedIndex === index && "bg-muted",
              )}
            >
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="line-clamp-2">{feature.place_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected address details */}
      {selectedAddress && (
        <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm space-y-1">
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Address Selected
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground text-xs mt-2">
            <div>
              <span className="font-medium text-foreground">Street:</span>{" "}
              {selectedAddress.street}
            </div>
            <div>
              <span className="font-medium text-foreground">City:</span>{" "}
              {selectedAddress.city}
            </div>
            <div>
              <span className="font-medium text-foreground">State:</span>{" "}
              {selectedAddress.state}
            </div>
            <div>
              <span className="font-medium text-foreground">ZIP:</span>{" "}
              {selectedAddress.zipCode}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            📍 Coordinates: {selectedAddress.lat.toFixed(6)},{" "}
            {selectedAddress.lng.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
}
