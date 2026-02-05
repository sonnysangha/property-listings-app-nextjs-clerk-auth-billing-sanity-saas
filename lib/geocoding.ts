/**
 * Geocoding utility using Mapbox Geocoding API
 * Converts addresses to coordinates (lat/lng)
 */

import type {
  GeocodeFeature,
  GeocodeResponse,
} from "@mapbox/mapbox-sdk/services/geocoding";

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export interface GeocodingError {
  message: string;
  code: "NO_RESULTS" | "API_ERROR" | "INVALID_TOKEN" | "NETWORK_ERROR";
}

/**
 * Geocode an address to coordinates using Mapbox
 * @param address - Full address string to geocode
 * @returns Promise with coordinates or null if not found
 */
export async function geocodeAddress(
  address: string,
): Promise<GeocodingResult | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    console.error("Mapbox token not configured");
    return null;
  }

  if (!address || address.trim().length < 3) {
    return null;
  }

  const encodedAddress = encodeURIComponent(address.trim());
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&limit=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Invalid Mapbox token");
      }
      return null;
    }

    const data: GeocodeResponse = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature: GeocodeFeature = data.features[0];
    const [lng, lat] = feature.center;

    return {
      lat,
      lng,
      formattedAddress: feature.place_name,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Build a full address string from address components
 */
export function buildAddressString(components: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}): string {
  const parts = [
    components.street,
    components.city,
    components.state,
    components.zipCode,
  ].filter(Boolean);

  return parts.join(", ");
}
