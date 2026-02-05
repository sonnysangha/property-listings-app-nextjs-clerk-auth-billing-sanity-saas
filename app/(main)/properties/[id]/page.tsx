import { auth } from "@clerk/nextjs/server";
import {
  Bath,
  Bed,
  Calendar,
  Check,
  ChevronRight,
  MapPin,
  Square,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DynamicMapView } from "@/components/map/DynamicMapView";
import { AgentCard } from "@/components/property/AgentCard";
import { ContactAgentButton } from "@/components/property/ContactAgentButton";
import { ImageGallery } from "@/components/property/ImageGallery";
import { SavePropertyButton } from "@/components/property/SavePropertyButton";
import { SharePropertyButton } from "@/components/property/SharePropertyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatBadge } from "@/components/ui/stat-badge";
import { sanityFetch } from "@/lib/sanity/live";
import { PROPERTY_DETAIL_QUERY } from "@/lib/sanity/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: property } = await sanityFetch({
    query: PROPERTY_DETAIL_QUERY,
    params: { id },
  });

  if (!property) {
    return { title: "Property Not Found" };
  }

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return {
    title: `${property.title} - ${price}`,
    description:
      property.description?.slice(0, 160) ||
      `Beautiful ${property.propertyType || "property"} with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms.`,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: property } = await sanityFetch({
    query: PROPERTY_DETAIL_QUERY,
    params: { id },
  });

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statusLabel =
    property.status !== "active"
      ? property.status.charAt(0).toUpperCase() + property.status.slice(1)
      : null;

  return (
    <div className="min-h-screen bg-accent/20">
      {/* Breadcrumb */}
      <div className="bg-background border-b border-border/50">
        <div className="container py-4">
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link
              href="/properties"
              className="hover:text-foreground transition-colors"
            >
              Properties
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery
              images={property.images || []}
              title={property.title}
            />

            {/* Property Header */}
            <div className="bg-background rounded-2xl border border-border/50 p-6 shadow-warm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading tabular-nums">
                      {formatPrice(property.price)}
                    </h1>
                    {statusLabel && (
                      <Badge
                        variant={
                          property.status === "sold" ? "destructive" : "muted"
                        }
                      >
                        {statusLabel}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-lg text-muted-foreground">
                    {property.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {userId && <SavePropertyButton propertyId={property._id} />}
                  <SharePropertyButton
                    title={property.title}
                    price={formatPrice(property.price)}
                  />
                </div>
              </div>

              {property.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {property.address.street}, {property.address.city},{" "}
                    {property.address.state}&nbsp;{property.address.zipCode}
                  </span>
                </div>
              )}

              {/* Property Type Badge */}
              {property.propertyType && (
                <div className="mt-4">
                  <Badge variant="secondary" className="capitalize">
                    {property.propertyType}
                  </Badge>
                </div>
              )}
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBadge
                icon={Bed}
                value={property.bedrooms}
                label="Bedrooms"
                color="primary"
              />
              <StatBadge
                icon={Bath}
                value={property.bathrooms}
                label="Bathrooms"
                color="secondary"
              />
              <StatBadge
                icon={Square}
                value={property.squareFeet || 0}
                label="Sq Ft"
                color="primary"
              />
              {property.yearBuilt && (
                <StatBadge
                  icon={Calendar}
                  value={property.yearBuilt}
                  label="Year Built"
                  color="secondary"
                />
              )}
            </div>

            {/* Description */}
            {property.description && (
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="font-heading">
                    About This Property
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="font-heading">
                    Amenities & Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity: string) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Check
                            className="h-4 w-4 text-success"
                            aria-hidden="true"
                          />
                        </div>
                        <span className="capitalize text-sm font-medium">
                          {amenity.replace(/-/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {property.location && (
              <Card className="shadow-warm overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-heading">Location</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px]">
                    <DynamicMapView
                      properties={[
                        {
                          ...property,
                          slug: property.slug?.current || id,
                        },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Agent Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {property.agent && (
                <AgentCard agent={property.agent}>
                  <ContactAgentButton
                    propertyId={property._id}
                    agentId={property.agent._id}
                    isAuthenticated={!!userId}
                  />
                </AgentCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
