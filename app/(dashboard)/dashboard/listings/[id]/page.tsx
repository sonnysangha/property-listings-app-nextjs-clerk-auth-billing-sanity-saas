import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/forms/ListingForm";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { AMENITIES_QUERY, LISTING_BY_ID_QUERY } from "@/lib/sanity/queries";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const agent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id, onboardingComplete }`,
    { userId },
  );

  if (!agent?.onboardingComplete) {
    redirect("/dashboard/onboarding");
  }

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
