import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/forms/ListingForm";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ID_BY_USER_QUERY,
  AMENITIES_QUERY,
  LISTING_BY_ID_QUERY,
} from "@/lib/sanity/queries";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Middleware guarantees: authenticated + has agent plan + onboarding complete
  const { userId } = await auth();

  const [{ data: agent }, { data: listing }, { data: amenities }] =
    await Promise.all([
      sanityFetch({
        query: AGENT_ID_BY_USER_QUERY,
        params: { userId },
      }),
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
