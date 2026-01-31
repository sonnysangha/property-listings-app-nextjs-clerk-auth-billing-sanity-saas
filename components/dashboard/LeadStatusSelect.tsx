"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateLeadStatus } from "@/actions/leads";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadStatusSelectProps {
  leadId: string;
  currentStatus: string;
}

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  closed: "bg-green-100 text-green-800",
};

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: LeadStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: "new" | "contacted" | "closed") => {
    startTransition(async () => {
      try {
        await updateLeadStatus(leadId, newStatus);
        toast.success("Status updated");
      } catch (_error) {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          <Badge
            variant="outline"
            className={statusColors[currentStatus as keyof typeof statusColors]}
          >
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">
          <Badge variant="outline" className={statusColors.new}>
            New
          </Badge>
        </SelectItem>
        <SelectItem value="contacted">
          <Badge variant="outline" className={statusColors.contacted}>
            Contacted
          </Badge>
        </SelectItem>
        <SelectItem value="closed">
          <Badge variant="outline" className={statusColors.closed}>
            Closed
          </Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
