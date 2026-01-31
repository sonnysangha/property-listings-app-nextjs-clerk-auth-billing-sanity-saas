"use client";

import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const abortControllerRef = useRef<AbortController | null>(null);

  // Store callbacks in refs to avoid recreating debounced function
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Debounced geocoding function using lodash
  const debouncedGeocode = useMemo(
    () =>
      debounce(async (addressString: string) => {
        // Abort any in-flight request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
          const geocodeResult = await geocodeAddress(addressString);

          if (geocodeResult) {
            setResult(geocodeResult);
            setError(null);
            onSuccessRef.current?.(geocodeResult);
          } else {
            setResult(null);
            const errorMsg = "Could not find coordinates for this address";
            setError(errorMsg);
            onErrorRef.current?.(errorMsg);
          }
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            return; // Request was cancelled, ignore
          }
          const errorMsg = "Failed to geocode address";
          setError(errorMsg);
          onErrorRef.current?.(errorMsg);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs),
    [debounceMs],
  );

  const geocode = useCallback(
    (address: AddressComponents) => {
      const addressString = buildAddressString(address);

      // Don't geocode if address is too short
      if (addressString.length < 5) {
        debouncedGeocode.cancel();
        clear();
        return;
      }

      setIsLoading(true);
      setError(null);
      debouncedGeocode(addressString);
    },
    [debouncedGeocode, clear],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedGeocode.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedGeocode]);

  return {
    result,
    isLoading,
    error,
    geocode,
    clear,
  };
}
