import { notFound } from "next/navigation";
import { requireAgent } from "@/lib/auth/requireAgent";
import { ListingForm } from "@/components/forms/ListingForm";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ONBOARDING_CHECK_QUERY,
  AMENITIES_QUERY,
  LISTING_BY_ID_QUERY,
} from "@/lib/sanity/queries";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Single call handles: auth, plan check, agent fetch/create, onboarding check
  const agent = await requireAgent<{ _id: string; onboardingComplete: boolean }>(AGENT_ONBOARDING_CHECK_QUERY);

  const [{ data: listing }, { data: amenities }] = await Promise.all([
    sanityFetch({
      query: LISTING_BY_ID_QUERY,
      params: { id },
    }),
    sanityFetch({
      query: AMENITIES_QUERY,
    }),
  ]);

  if (!listing) {
    notFound();
  }

  // Verify ownership
  if (listing.agent?._ref !== agent._id) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Listing</h1>
        <p className="text-muted-foreground">Update your property details</p>
      </div>

      <ListingForm listing={listing} amenities={amenities} mode="edit" />
    </div>
  );
}
