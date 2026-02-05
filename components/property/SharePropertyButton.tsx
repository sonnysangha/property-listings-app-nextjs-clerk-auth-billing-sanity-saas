"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SharePropertyButtonProps {
  title: string;
  price: string;
}

export function SharePropertyButton({
  title,
  price,
}: SharePropertyButtonProps) {
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this property: ${title} - ${price}`;

    // Try Web Share API first (available on mobile and some desktop browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - ${price}`,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or share failed - only show error if not cancelled
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback to clipboard for desktop browsers
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (_error) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Share property"
      onClick={handleShare}
    >
      <Share2 className="h-5 w-5" aria-hidden="true" />
    </Button>
  );
}
