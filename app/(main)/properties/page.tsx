import {
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  Map as MapIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DynamicMapView } from "@/components/map/DynamicMapView";
import { FilterSidebar } from "@/components/property/FilterSidebar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AMENITIES_QUERY,
  PROPERTIES_COUNT_QUERY,
  PROPERTIES_SEARCH_QUERY,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Browse Properties",
  description:
    "Find your perfect home from our curated selection of properties. Filter by price, bedrooms, location, and more.",
};

const ITEMS_PER_PAGE = 12;

interface SearchParams {
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  type?: string;
  city?: string;
  page?: string;
  // Advanced filters
  minSqft?: string;
  maxSqft?: string;
  minYear?: string;
  maxYear?: string;
  minLotSize?: string;
  maxLotSize?: string;
  daysOnMarket?: string;
  openHouse?: string;
  priceReduced?: string;
  amenities?: string;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  // Parse amenities from comma-separated string
  const amenitiesList = params.amenities?.split(",").filter(Boolean) || [];

  // Handle "5+" values for beds/baths - extract number and track if it's a "plus" value
  const bedsValue = params.beds || "0";
  const bathsValue = params.baths || "0";
  const bedsIsPlus = bedsValue.includes("+");
  const bathsIsPlus = bathsValue.includes("+");
  const bedsNum = Number.parseInt(bedsValue.replace("+", ""), 10) || 0;
  const bathsNum = Number.parseInt(bathsValue.replace("+", ""), 10) || 0;

  const queryParams = {
    minPrice: Number(params.minPrice) || 0,
    maxPrice: Number(params.maxPrice) || 100000000,
    beds: bedsNum,
    bedsIsPlus,
    baths: bathsNum,
    bathsIsPlus,
    type: params.type === "all" ? "" : params.type || "",
    city: params.city?.toLowerCase() || "",
    // Advanced filters
    minSqft: Number(params.minSqft) || 0,
    maxSqft: Number(params.maxSqft) || 0,
    minYear: Number(params.minYear) || 0,
    maxYear: Number(params.maxYear) || 0,
    minLotSize: Number(params.minLotSize) || 0,
    maxLotSize: Number(params.maxLotSize) || 0,
    daysOnMarket: Number(params.daysOnMarket) || 0,
    openHouse: params.openHouse === "true",
    priceReduced: params.priceReduced === "true",
    amenities: amenitiesList,
    amenitiesCount: amenitiesList.length,
    start,
    end,
  };

  const [{ data: properties }, { data: totalCount }, { data: amenities }] =
    await Promise.all([
      sanityFetch({
        query: PROPERTIES_SEARCH_QUERY,
        params: queryParams,
      }),
      sanityFetch({
        query: PROPERTIES_COUNT_QUERY,
        params: queryParams,
      }),
      sanityFetch({
        query: AMENITIES_QUERY,
      }),
    ]);

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);
  const hasFilters =
    params.minPrice ||
    params.maxPrice ||
    params.beds ||
    params.baths ||
    (params.type && params.type !== "all") ||
    params.city ||
    params.minSqft ||
    params.maxSqft ||
    params.minYear ||
    params.maxYear ||
    params.minLotSize ||
    params.maxLotSize ||
    params.daysOnMarket ||
    params.openHouse === "true" ||
    params.priceReduced === "true" ||
    params.amenities;

  return (
    <div className="min-h-screen bg-accent/20">
      {/* Header */}
      <div className="bg-background border-b border-border/50">
        <div className="container py-8">
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground mb-4"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-foreground font-medium">Properties</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            Browse Properties
          </h1>
          <p className="text-muted-foreground mt-2">
            Find your perfect nest from our curated selection
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <Suspense
                fallback={<Skeleton className="h-[500px] w-full rounded-2xl" />}
              >
                <FilterSidebar amenities={amenities || []} />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-lg font-medium">
                  <span className="tabular-nums">{totalCount || 0}</span>{" "}
                  {totalCount === 1 ? "property" : "properties"} found
                </p>
                {hasFilters && (
                  <p className="text-sm text-muted-foreground">
                    Showing filtered results
                  </p>
                )}
              </div>
            </div>

            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-6 bg-background border border-border/50 p-1 rounded-xl">
                <TabsTrigger
                  value="list"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  Grid View
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <MapIcon className="h-4 w-4" aria-hidden="true" />
                  Map View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-0">
                {properties && properties.length > 0 ? (
                  <>
                    <PropertyGrid properties={properties} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav
                        className="flex items-center justify-center gap-2 mt-10"
                        aria-label="Pagination"
                      >
                        {page > 1 ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/properties?${new URLSearchParams({
                                ...params,
                                page: String(page - 1),
                              }).toString()}`}
                            >
                              <ChevronLeft
                                className="h-4 w-4 mr-1"
                                aria-hidden="true"
                              />
                              Previous
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <ChevronLeft
                              className="h-4 w-4 mr-1"
                              aria-hidden="true"
                            />
                            Previous
                          </Button>
                        )}

                        <span className="flex items-center px-4 text-sm text-muted-foreground tabular-nums">
                          Page{" "}
                          <span className="font-medium text-foreground mx-1">
                            {page}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium text-foreground ml-1">
                            {totalPages}
                          </span>
                        </span>

                        {page < totalPages ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/properties?${new URLSearchParams({
                                ...params,
                                page: String(page + 1),
                              }).toString()}`}
                            >
                              Next
                              <ChevronRight
                                className="h-4 w-4 ml-1"
                                aria-hidden="true"
                              />
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            Next
                            <ChevronRight
                              className="h-4 w-4 ml-1"
                              aria-hidden="true"
                            />
                          </Button>
                        )}
                      </nav>
                    )}
                  </>
                ) : (
                  /* Empty State */
                  <div className="text-center py-16 bg-background rounded-2xl border border-border/50">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Home
                        className="h-8 w-8 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-semibold font-heading mb-2">
                      No Properties Found
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {hasFilters
                        ? "Try adjusting your filters to see more results."
                        : "There are no properties available at the moment."}
                    </p>
                    {hasFilters && (
                      <Button variant="outline" asChild>
                        <Link href="/properties">Clear All Filters</Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map" className="mt-0">
                <div className="h-[600px] rounded-2xl overflow-hidden border border-border/50 shadow-warm">
                  <DynamicMapView properties={properties || []} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
