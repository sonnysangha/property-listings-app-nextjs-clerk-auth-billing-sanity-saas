"use client";

import { useCallback, useEffect, useState } from "react";
import MapGL, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import type { GeoPoint } from "@/types";

interface LocationPickerProps {
  value?: GeoPoint;
  onChange: (location: GeoPoint) => void;
  disabled?: boolean;
}

export function LocationPicker({
  value,
  onChange,
  disabled,
}: LocationPickerProps) {
  const [viewState, setViewState] = useState({
    longitude: value?.lng ?? -98.5795,
    latitude: value?.lat ?? 39.8283,
    zoom: value ? 14 : 4,
  });

  // Sync viewState when value prop changes (e.g., from address autocomplete)
  useEffect(() => {
    if (value) {
      setViewState((prev) => ({
        ...prev,
        longitude: value.lng,
        latitude: value.lat,
        zoom: 15, // Zoom in when address is selected
      }));
    }
  }, [value?.lat, value?.lng, value]);

  const handleMapClick = useCallback(
    (event: { lngLat: { lng: number; lat: number } }) => {
      if (disabled) return;

      const { lng, lat } = event.lngLat;
      onChange({ lat, lng });

      // Center map on the clicked location
      setViewState((prev) => ({
        ...prev,
        longitude: lng,
        latitude: lat,
        zoom: Math.max(prev.zoom, 14),
      }));
    },
    [onChange, disabled],
  );

  return (
    <div className="space-y-2">
      <div
        className={`relative h-[300px] w-full rounded-lg overflow-hidden border ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <MapGL
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          cursor={disabled ? "default" : "crosshair"}
        >
          <NavigationControl position="top-right" />

          {value && (
            <Marker longitude={value.lng} latitude={value.lat} anchor="bottom">
              <div className="text-primary">
                <MapPin className="h-8 w-8 fill-primary stroke-white drop-shadow-lg" />
              </div>
            </Marker>
          )}
        </MapGL>
      </div>

      {value ? (
        <p className="text-sm text-muted-foreground">
          📍 Selected: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select an address above or click on the map to set the property
          location
        </p>
      )}
    </div>
  );
}
