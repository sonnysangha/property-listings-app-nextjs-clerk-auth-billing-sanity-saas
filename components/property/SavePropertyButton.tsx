"use client";

import { Heart, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleSavedListing } from "@/actions/users";
import { Button } from "@/components/ui/button";

interface SavePropertyButtonProps {
  propertyId: string;
  isSaved?: boolean;
}

export function SavePropertyButton({
  propertyId,
  isSaved: initialIsSaved = false,
}: SavePropertyButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await toggleSavedListing(propertyId);
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Removed from saved" : "Added to saved");
      } catch (_error) {
        toast.error("Failed to update saved listings");
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
        />
      )}
    </Button>
  );
}
