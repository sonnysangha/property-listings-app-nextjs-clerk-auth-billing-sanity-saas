"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildAddressString,
  type GeocodingResult,
  geocodeAddress,
} from "@/lib/geocoding";

interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface UseGeocodingOptions {
  /** Debounce delay in milliseconds (default: 500) */
  debounceMs?: number;
  /** Callback when geocoding succeeds */
  onSuccess?: (result: GeocodingResult) => void;
  /** Callback when geocoding fails or returns no results */
  onError?: (message: string) => void;
}

interface UseGeocodingReturn {
  /** Current geocoding result */
  result: GeocodingResult | null;
  /** Whether geocoding is in progress */
  isLoading: boolean;
  /** Error message if geocoding failed */
  error: string | null;
  /** Trigger geocoding with address components */
  geocode: (address: AddressComponents) => void;
  /** Clear current result and error */
  clear: () => void;
}

/**
 * Hook for geocoding addresses with debouncing
 * Automatically handles API calls and state management
 */
export function useGeocoding(
  options: UseGeocodingOptions = {},
): UseGeocodingReturn {
  const { debounceMs = 500, onSuccess, onError } = options;

  const [result, setResult] = useState<GeocodingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const geocode = useCallback(
    (address: AddressComponents) => {
      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Abort any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const addressString = buildAddressString(address);

      // Don't geocode if address is too short
      if (addressString.length < 5) {
        clear();
        return;
      }

      setIsLoading(true);
      setError(null);

      debounceTimerRef.current = setTimeout(async () => {
        abortControllerRef.current = new AbortController();

        try {
          const geocodeResult = await geocodeAddress(addressString);

          if (geocodeResult) {
            setResult(geocodeResult);
            setError(null);
            onSuccess?.(geocodeResult);
          } else {
            setResult(null);
            const errorMsg = "Could not find coordinates for this address";
            setError(errorMsg);
            onError?.(errorMsg);
          }
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            return; // Request was cancelled, ignore
          }
          const errorMsg = "Failed to geocode address";
          setError(errorMsg);
          onError?.(errorMsg);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs, onSuccess, onError, clear],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    result,
    isLoading,
    error,
    geocode,
    clear,
  };
}
