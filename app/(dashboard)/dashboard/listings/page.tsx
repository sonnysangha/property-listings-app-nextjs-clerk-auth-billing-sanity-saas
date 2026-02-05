import { auth } from "@clerk/nextjs/server";
import { MoreHorizontal, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteListingButton } from "@/components/dashboard/DeleteListingButton";
import { ListingStatusSelect } from "@/components/dashboard/ListingStatusSelect";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { urlFor } from "@/lib/sanity/image";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ID_BY_USER_QUERY,
  AGENT_LISTINGS_QUERY,
} from "@/lib/sanity/queries";
import type { Property } from "@/types";

export default async function ListingsPage() {
  // Middleware guarantees: authenticated + has agent plan + onboarding complete
  const { userId } = await auth();

  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  const { data: listings } = await sanityFetch({
    query: AGENT_LISTINGS_QUERY,
    params: { agentId: agent._id },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <SectionHeader
        title="My Listings"
        subtitle="Manage your property listings"
        action={
          <Button asChild>
            <Link href="/dashboard/listings/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Link>
          </Button>
        }
      />

      {listings && listings.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing: Property) => (
                <TableRow key={listing._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {listing.image?.asset ? (
                        <Image
                          src={urlFor(listing.image).width(80).height(60).url()}
                          alt={listing.title}
                          width={80}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-20 h-15 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/properties/${listing._id}`}
                          className="font-medium hover:underline"
                        >
                          {listing.title}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(listing.price)}
                  </TableCell>
                  <TableCell>
                    <ListingStatusSelect
                      listingId={listing._id}
                      currentStatus={listing.status}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {listing.bedrooms} beds • {listing.bathrooms} baths
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(listing.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/listings/${listing._id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/properties/${listing._id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteListingButton listingId={listing._id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          title="No listings yet"
          description="Create your first property listing to get started."
          action={
            <Button asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
