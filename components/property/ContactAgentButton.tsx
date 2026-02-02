"use client";

import { Check, Loader2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createLead } from "@/actions/leads";
import { Button } from "@/components/ui/button";

interface ContactAgentButtonProps {
  propertyId: string;
  agentId: string;
  isAuthenticated: boolean;
}

export function ContactAgentButton({
  propertyId,
  agentId,
  isAuthenticated,
}: ContactAgentButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isContacted, setIsContacted] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createLead(propertyId, agentId);
        if (result.requiresOnboarding) {
          toast.info("Please complete your profile first");
          router.push("/onboarding");
          return;
        }
        if (result.success) {
          setIsContacted(true);
          toast.success(
            "Contact request sent! The agent will reach out to you soon.",
          );
        }
      } catch (_error) {
        toast.error("Failed to contact agent. Please try again.");
      }
    });
  };

  if (isContacted) {
    return (
      <Button className="w-full" disabled>
        <Check className="h-5 w-5 mr-2" />
        Request Sent
      </Button>
    );
  }

  return (
    <Button className="w-full" onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      ) : (
        <MessageSquare className="h-5 w-5 mr-2" />
      )}
      {isAuthenticated ? "Contact Agent" : "Sign in to Contact"}
    </Button>
  );
}
