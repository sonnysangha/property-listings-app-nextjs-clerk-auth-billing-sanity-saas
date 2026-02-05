import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ID_BY_USER_QUERY,
  ANALYTICS_LEADS_BY_PROPERTY_QUERY,
  ANALYTICS_LEADS_CLOSED_QUERY,
  ANALYTICS_LEADS_CONTACTED_QUERY,
  ANALYTICS_LEADS_NEW_QUERY,
  ANALYTICS_LEADS_TOTAL_QUERY,
  ANALYTICS_LISTINGS_ACTIVE_QUERY,
  ANALYTICS_LISTINGS_PENDING_QUERY,
  ANALYTICS_LISTINGS_SOLD_QUERY,
  ANALYTICS_LISTINGS_TOTAL_QUERY,
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
  // Middleware guarantees: authenticated + has agent plan + onboarding complete
  const { userId } = await auth();

  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  // Fetch all analytics data using sanityFetch for real-time updates
  const [
    { data: totalListings },
    { data: activeListings },
    { data: pendingListings },
    { data: soldListings },
    { data: totalLeads },
    { data: newLeads },
    { data: contactedLeads },
    { data: closedLeads },
    { data: leadsByProperty },
  ] = await Promise.all([
    // Listing counts
    sanityFetch({
      query: ANALYTICS_LISTINGS_TOTAL_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: ANALYTICS_LISTINGS_ACTIVE_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: ANALYTICS_LISTINGS_PENDING_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: ANALYTICS_LISTINGS_SOLD_QUERY,
      params: { agentId: agent._id },
    }),
    // Lead counts
    sanityFetch({
      query: ANALYTICS_LEADS_TOTAL_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: ANALYTICS_LEADS_NEW_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: ANALYTICS_LEADS_CONTACTED_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: ANALYTICS_LEADS_CLOSED_QUERY,
      params: { agentId: agent._id },
    }),
    // Leads grouped by property
    sanityFetch({
      query: ANALYTICS_LEADS_BY_PROPERTY_QUERY,
      params: { agentId: agent._id },
    }),
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
      }),
    ),
  };

  return <AnalyticsDashboard data={analyticsData} />;
}
