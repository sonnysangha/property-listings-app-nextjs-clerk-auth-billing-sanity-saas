import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListingForm } from "@/components/forms/ListingForm";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { AMENITIES_QUERY } from "@/lib/sanity/queries";

export default async function NewListingPage() {
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

  const { data: amenities } = await sanityFetch({
    query: AMENITIES_QUERY,
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Listing</h1>
        <p className="text-muted-foreground">
          Add a new property to your listings
        </p>
      </div>

      <ListingForm amenities={amenities} />
    </div>
  );
}
