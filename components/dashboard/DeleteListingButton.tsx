"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteListing } from "@/actions/properties";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeleteListingButtonProps {
  listingId: string;
}

export function DeleteListingButton({ listingId }: DeleteListingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteListing(listingId);
        toast.success("Listing deleted");
      } catch {
        toast.error("Failed to delete listing");
      }
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive focus:text-destructive"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 mr-2" />
      )}
      Delete
    </DropdownMenuItem>
  );
}
