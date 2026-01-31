import { auth } from "@clerk/nextjs/server";
import { Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Button } from "@/components/ui/button";
import { sanityFetch } from "@/lib/sanity/live";
import { USER_SAVED_LISTINGS_QUERY } from "@/lib/sanity/queries";

export default async function SavedListingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: savedProperties } = await sanityFetch({
    query: USER_SAVED_LISTINGS_QUERY,
    params: { clerkId: userId },
  });

  return (
    <div className="container py-16">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Saved Listings</h1>
      </div>

      {savedProperties && savedProperties.length > 0 ? (
        <PropertyGrid properties={savedProperties} showRemoveButton />
      ) : (
        <div className="text-center py-16 bg-muted rounded-lg">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No saved listings yet</h2>
          <p className="text-muted-foreground mb-6">
            Start browsing properties and save your favorites here.
          </p>
          <Button asChild>
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
