import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
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
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const agent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id, name, onboardingComplete }`,
    { userId }
  );

  if (!agent) {
    redirect("/pricing");
  }

  if (!agent.onboardingComplete) {
    redirect("/dashboard/onboarding");
  }

  // Fetch all analytics data
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
    client.fetch(`count(*[_type == "property" && agent._ref == $agentId])`, {
      agentId: agent._id,
    }),
    client.fetch(
      `count(*[_type == "property" && agent._ref == $agentId && status == "active"])`,
      { agentId: agent._id }
    ),
    client.fetch(
      `count(*[_type == "property" && agent._ref == $agentId && status == "pending"])`,
      { agentId: agent._id }
    ),
    client.fetch(
      `count(*[_type == "property" && agent._ref == $agentId && status == "sold"])`,
      { agentId: agent._id }
    ),
    // Lead counts
    client.fetch(`count(*[_type == "lead" && agent._ref == $agentId])`, {
      agentId: agent._id,
    }),
    client.fetch(
      `count(*[_type == "lead" && agent._ref == $agentId && status == "new"])`,
      { agentId: agent._id }
    ),
    client.fetch(
      `count(*[_type == "lead" && agent._ref == $agentId && status == "contacted"])`,
      { agentId: agent._id }
    ),
    client.fetch(
      `count(*[_type == "lead" && agent._ref == $agentId && status == "closed"])`,
      { agentId: agent._id }
    ),
    // Leads grouped by property
    client.fetch<Array<{ title: string; leadCount: number }>>(
      `*[_type == "property" && agent._ref == $agentId]{
        "title": title,
        "leadCount": count(*[_type == "lead" && property._ref == ^._id])
      } | order(leadCount desc)[0...10]`,
      { agentId: agent._id }
    ),
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
    leadsByProperty: leadsByProperty.map((p) => ({
      name: p.title?.length > 20 ? `${p.title.slice(0, 20)}...` : p.title,
      leads: p.leadCount,
    })),
  };

  return <AnalyticsDashboard data={analyticsData} />;
}
