import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import {
  ANALYTICS_AGENT_QUERY,
  ANALYTICS_LISTINGS_TOTAL_QUERY,
  ANALYTICS_LISTINGS_ACTIVE_QUERY,
  ANALYTICS_LISTINGS_PENDING_QUERY,
  ANALYTICS_LISTINGS_SOLD_QUERY,
  ANALYTICS_LEADS_TOTAL_QUERY,
  ANALYTICS_LEADS_NEW_QUERY,
  ANALYTICS_LEADS_CONTACTED_QUERY,
  ANALYTICS_LEADS_CLOSED_QUERY,
  ANALYTICS_LEADS_BY_PROPERTY_QUERY,
} from "@/lib/sanity/queries";
import { AnalyticsDashboard } from "./analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "View your performance metrics and insights.",
};

export type AnalyticsData = {
  listings: {
    total: number;
    active: number;
    pending: number;
    sold: number;
  };
  leads: {
    total: number;
    new: number;
    contacted: number;
    closed: number;
  };
  leadsByProperty: Array<{
    name: string;
    leads: number;
  }>;
};

export default async function AnalyticsPage() {
  // Auth redirect handled by middleware (proxy.ts) and layout
  const { userId } = await auth();

  const agent = await client.fetch(ANALYTICS_AGENT_QUERY, { userId });

  if (!agent) {
    redirect("/pricing");
  }

  if (!agent.onboardingComplete) {
    redirect("/dashboard/onboarding");
  }

  // Fetch all analytics data using defineQuery for type safety
  const [
    totalListings,
    activeListings,
    pendingListings,
    soldListings,
    totalLeads,
    newLeads,
    contactedLeads,
    closedLeads,
    leadsByProperty,
  ] = await Promise.all([
    // Listing counts
    client.fetch(ANALYTICS_LISTINGS_TOTAL_QUERY, { agentId: agent._id }),
    client.fetch(ANALYTICS_LISTINGS_ACTIVE_QUERY, { agentId: agent._id }),
    client.fetch(ANALYTICS_LISTINGS_PENDING_QUERY, { agentId: agent._id }),
    client.fetch(ANALYTICS_LISTINGS_SOLD_QUERY, { agentId: agent._id }),
    // Lead counts
    client.fetch(ANALYTICS_LEADS_TOTAL_QUERY, { agentId: agent._id }),
    client.fetch(ANALYTICS_LEADS_NEW_QUERY, { agentId: agent._id }),
    client.fetch(ANALYTICS_LEADS_CONTACTED_QUERY, { agentId: agent._id }),
    client.fetch(ANALYTICS_LEADS_CLOSED_QUERY, { agentId: agent._id }),
    // Leads grouped by property
    client.fetch(ANALYTICS_LEADS_BY_PROPERTY_QUERY, { agentId: agent._id }),
  ]);

  const analyticsData: AnalyticsData = {
    listings: {
      total: totalListings,
      active: activeListings,
      pending: pendingListings,
      sold: soldListings,
    },
    leads: {
      total: totalLeads,
      new: newLeads,
      contacted: contactedLeads,
      closed: closedLeads,
    },
    leadsByProperty: leadsByProperty.map(
      (p: { title: string | null; leadCount: number }) => ({
        name:
          p.title && p.title.length > 20
            ? `${p.title.slice(0, 20)}...`
            : (p.title ?? "Unknown"),
        leads: p.leadCount,
      })
    ),
  };

  return <AnalyticsDashboard data={analyticsData} />;
}
