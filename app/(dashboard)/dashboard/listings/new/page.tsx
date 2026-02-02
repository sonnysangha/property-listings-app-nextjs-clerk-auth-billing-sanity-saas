import { requireAgent } from "@/lib/auth/requireAgent";
import { ListingForm } from "@/components/forms/ListingForm";
import { sanityFetch } from "@/lib/sanity/live";
import { AGENT_ONBOARDING_CHECK_QUERY, AMENITIES_QUERY } from "@/lib/sanity/queries";

export default async function NewListingPage() {
  // Single call handles: auth, plan check, agent fetch/create, onboarding check
  await requireAgent(AGENT_ONBOARDING_CHECK_QUERY);

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
