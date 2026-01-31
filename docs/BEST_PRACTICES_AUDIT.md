# Best Practices Audit Report

**Date:** January 31, 2026
**Ticket:** YOU-252

## Summary

This audit scanned the codebase for performance issues based on Vercel React/Next.js best practices. Critical issues have been fixed directly; remaining issues are documented with suggested fixes.

---

## ✅ FIXED - Critical Issues

### 1. Heavy Client Component: MapView (Mapbox GL)
**Location:** `components/map/MapView.tsx`

**Problem:** The MapView component imports the heavy Mapbox GL JS library (~500KB) which was bundled into the main client bundle, slowing initial page loads.

**Fix Applied:**
- Created `components/map/DynamicMapView.tsx` with `next/dynamic` and `{ ssr: false }`
- Updated `app/(main)/properties/page.tsx` and `app/(main)/properties/[slug]/page.tsx` to use `DynamicMapView`
- Map now loads lazily only when needed

### 2. Duplicate Query Definition
**Location:** `lib/sanity/queries.ts:4` and `lib/sanity/queries.ts:296`

**Problem:** `AMENITIES_QUERY` was defined twice with different field structures (one using `value/label`, another using `slug/name`), causing redeclaration errors.

**Fix Applied:** Removed the duplicate definition, keeping only the newer Sanity-based version at the bottom of the file.

### 3. Component Extraction: KPICard
**Location:** `app/(dashboard)/dashboard/analytics/analytics-dashboard.tsx`

**Problem:** `KPICard` component was defined inline in the analytics dashboard file.

**Fix Applied:**
- Extracted to `components/dashboard/KPICard.tsx`
- Updated imports in `analytics-dashboard.tsx`

---

## 🔧 HIGH Priority - Should Fix

### 4. Missing React.cache() for Repeated Fetches
**Locations:**
- `app/(dashboard)/dashboard/leads/page.tsx:25` ✅ FIXED
- `app/(dashboard)/dashboard/listings/page.tsx`
- `app/(dashboard)/dashboard/listings/new/page.tsx`
- `app/(dashboard)/dashboard/listings/[id]/page.tsx`
- `actions/properties.ts` (multiple agent fetches)

**Problem:** The agent fetch query `*[_type == "agent" && userId == $userId][0]` is repeated across many pages without deduplication. During a single request, if multiple server components/actions need the agent, each makes a separate network request.

**Partial Fix Applied:**
- Created `lib/sanity/cached-queries.ts` with `getAgentByUserId()` wrapped in `React.cache()`
- Updated `app/(dashboard)/dashboard/leads/page.tsx` to use it

**Suggested Fix for Remaining:**
```typescript
// In each page, replace:
import { client } from "@/lib/sanity/client";
const agent = await client.fetch(`*[_type == "agent"...`, { userId });

// With:
import { getAgentByUserId } from "@/lib/sanity/cached-queries";
const agent = await getAgentByUserId(userId);
```

### 5. Barrel Import in Hooks
**Location:** `lib/hooks/index.ts`

**Problem:** Barrel file re-exports hooks. If tree-shaking fails, importing one hook pulls in all hooks.

**Current:**
```typescript
export { useGeocoding } from "./useGeocoding";
export { useAnimationDuration, useReducedMotion } from "./useReducedMotion";
```

**Suggested Fix:** Import directly from source files:
```typescript
// Instead of:
import { useGeocoding } from "@/lib/hooks";

// Use:
import { useGeocoding } from "@/lib/hooks/useGeocoding";
```

---

## ⚠️ MEDIUM Priority - Nice to Have

### 6. Missing Suspense Boundaries
**Locations:**
- `app/(main)/properties/[slug]/page.tsx` - MapView could stream
- `app/(main)/properties/page.tsx` - FilterSidebar has Suspense ✅, but PropertyGrid doesn't

**Problem:** Heavy components block the entire page from rendering until all data is ready.

**Suggested Fix:**
```tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Wrap heavy async components:
<Suspense fallback={<Skeleton className="h-[400px]" />}>
  <MapSection property={property} />
</Suspense>
```

### 7. PropertyCard Could Be Split
**Location:** `components/property/PropertyCard.tsx`

**Problem:** Entire component is "use client" but only the save button needs client interactivity. Most of the card is static JSX.

**Suggested Fix:** Split into:
- `PropertyCard.tsx` (server component) - renders the card structure
- `SaveButton.tsx` (client component) - just the interactive heart button

```tsx
// PropertyCard.tsx (server)
import { SaveButton } from "./SaveButton";

export function PropertyCard({ property }) {
  return (
    <article>
      {/* Static content */}
      <SaveButton propertyId={property._id} />
    </article>
  );
}
```

### 8. Static JSX Could Be Hoisted
**Location:** `app/(main)/page.tsx`

**Problem:** The "How It Works" section is completely static but recreated on every render.

**Suggested Fix:** Hoist to module-level constant:
```tsx
const HOW_IT_WORKS_STEPS = [
  { icon: Search, title: "Search Properties", ... },
  { icon: Heart, title: "Save Favorites", ... },
  { icon: Users, title: "Connect with Agents", ... },
] as const;
```

---

## ✅ Good Patterns Found

1. **Promise.all for parallel fetches** - `app/(dashboard)/dashboard/analytics/page.tsx` correctly parallelizes 9 count queries
2. **Promise.all in properties search** - `app/(main)/properties/page.tsx` fetches properties and count in parallel
3. **Promise.all in edit page** - `app/(dashboard)/dashboard/listings/[id]/page.tsx` fetches listing and amenities in parallel

---

## Pre-existing TypeScript Errors (Not from this PR)

The following errors exist in the codebase but are unrelated to this refactor:
- Missing type declarations: `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@sanity/image-url`
- Implicit `any` types in map/filter callbacks (should add explicit types)
- Duplicate declarations in `scripts/seed/seed.ts`

---

## Files Changed

1. `components/dashboard/KPICard.tsx` - NEW (extracted component)
2. `components/map/DynamicMapView.tsx` - NEW (dynamic import wrapper)
3. `lib/sanity/cached-queries.ts` - NEW (React.cache utilities)
4. `app/(dashboard)/dashboard/analytics/analytics-dashboard.tsx` - Removed inline KPICard, added import
5. `app/(main)/properties/page.tsx` - Use DynamicMapView
6. `app/(main)/properties/[slug]/page.tsx` - Use DynamicMapView
7. `app/(dashboard)/dashboard/leads/page.tsx` - Use cached agent fetch
8. `lib/sanity/queries.ts` - Removed duplicate AMENITIES_QUERY
