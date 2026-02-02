"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dynamically imported MapView component.
 * This prevents the heavy Mapbox GL JS library from being included in the initial bundle.
 * SSR is disabled because Mapbox requires browser APIs.
 */
export const DynamicMapView = dynamic(
  () => import("./MapView").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <Skeleton className="w-full h-full" />
      </div>
    ),
  },
);
