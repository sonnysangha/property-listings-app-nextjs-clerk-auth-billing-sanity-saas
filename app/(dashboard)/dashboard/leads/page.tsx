import { auth } from "@clerk/nextjs/server";
import { ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import { LeadStatusSelect } from "@/components/dashboard/LeadStatusSelect";
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
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ID_BY_USER_QUERY,
  AGENT_LEADS_QUERY,
} from "@/lib/sanity/queries";
import type { Lead } from "@/types";

export default async function LeadsPage() {
  // Middleware guarantees: authenticated + has agent plan + onboarding complete
  const { userId } = await auth();

  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  const { data: leads } = await sanityFetch({
    query: AGENT_LEADS_QUERY,
    params: { agentId: agent._id },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <SectionHeader
        title="Leads Inbox"
        subtitle="Manage inquiries from potential buyers"
      />

      {leads && leads.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead: Lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <div className="font-medium">{lead.buyerName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <a
                        href={`mailto:${lead.buyerEmail}`}
                        className="text-sm text-primary hover:underline block"
                      >
                        {lead.buyerEmail}
                      </a>
                      {lead.buyerPhone && (
                        <a
                          href={`tel:${lead.buyerPhone}`}
                          className="text-sm text-muted-foreground hover:text-primary block"
                        >
                          {lead.buyerPhone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/properties/${lead.property?._id}`}
                      className="flex items-center gap-1 text-sm hover:underline"
                    >
                      {lead.property?.title}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <LeadStatusSelect
                      leadId={lead._id}
                      currentStatus={lead.status}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No leads yet"
          description="When buyers contact you about your listings, their inquiries will appear here."
        />
      )}
    </div>
  );
}
