"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ID_BY_USER_QUERY,
  PROPERTY_AGENT_REF_QUERY,
} from "@/lib/sanity/queries";

interface ImageReference {
  _type: "image";
  _key: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface GeoPoint {
  lat: number;
  lng: number;
}

interface ListingFormDataWithImages {
  title: string;
  description: string;
  price: number;
  propertyType: "house" | "apartment" | "condo" | "townhouse" | "land";
  status?: "active" | "pending" | "sold";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt?: number;
  address: Address;
  location?: GeoPoint;
  amenities?: string[];
  images?: ImageReference[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function createListing(data: ListingFormDataWithImages) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  await client.create({
    _type: "property",
    title: data.title,
    slug: { _type: "slug", current: slugify(data.title) },
    description: data.description,
    price: data.price,
    propertyType: data.propertyType,
    status: "active",
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    squareFeet: data.squareFeet,
    yearBuilt: data.yearBuilt,
    address: data.address,
    location: data.location
      ? { _type: "geopoint", lat: data.location.lat, lng: data.location.lng }
      : undefined,
    amenities: data.amenities || [],
    images: data.images || [],
    agent: { _type: "reference", _ref: agent._id },
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  redirect("/dashboard/listings");
}

export async function updateListing(
  listingId: string,
  data: ListingFormDataWithImages,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Verify ownership
  const { data: listing } = await sanityFetch({
    query: PROPERTY_AGENT_REF_QUERY,
    params: { id: listingId },
  });

  if (!listing || listing.agent._ref !== agent._id) {
    throw new Error("Unauthorized");
  }

  await client
    .patch(listingId)
    .set({
      title: data.title,
      slug: { _type: "slug", current: slugify(data.title) },
      description: data.description,
      price: data.price,
      propertyType: data.propertyType,
      status: data.status || "active",
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      squareFeet: data.squareFeet,
      yearBuilt: data.yearBuilt,
      address: data.address,
      location: data.location
        ? { _type: "geopoint", lat: data.location.lat, lng: data.location.lng }
        : undefined,
      amenities: data.amenities || [],
      images: data.images || [],
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

export async function updateListingStatus(
  listingId: string,
  status: "active" | "pending" | "sold",
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Verify ownership
  const { data: listing } = await sanityFetch({
    query: PROPERTY_AGENT_REF_QUERY,
    params: { id: listingId },
  });

  if (!listing || listing.agent._ref !== agent._id) {
    throw new Error("Unauthorized");
  }

  await client
    .patch(listingId)
    .set({
      status,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

export async function deleteListing(listingId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Verify ownership
  const { data: listing } = await sanityFetch({
    query: PROPERTY_AGENT_REF_QUERY,
    params: { id: listingId },
  });

  if (!listing || listing.agent._ref !== agent._id) {
    throw new Error("Unauthorized");
  }

  await client.delete(listingId);
}
