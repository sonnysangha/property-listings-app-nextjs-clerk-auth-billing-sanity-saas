import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  Home,
  MessageSquare,
  Plus,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_DASHBOARD_QUERY,
  DASHBOARD_LEADS_COUNT_QUERY,
  DASHBOARD_LISTINGS_COUNT_QUERY,
  DASHBOARD_NEW_LEADS_COUNT_QUERY,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your listings and leads from your agent dashboard.",
};

export default async function DashboardPage() {
  // Middleware guarantees: authenticated + has agent plan + onboarding complete
  const { userId } = await auth();

  const { data: agent } = await sanityFetch({
    query: AGENT_DASHBOARD_QUERY,
    params: { userId },
  });

  // Get stats
  const [
    { data: listingsCount },
    { data: leadsCount },
    { data: newLeadsCount },
  ] = await Promise.all([
    sanityFetch({
      query: DASHBOARD_LISTINGS_COUNT_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: DASHBOARD_LEADS_COUNT_QUERY,
      params: { agentId: agent._id },
    }),
    sanityFetch({
      query: DASHBOARD_NEW_LEADS_COUNT_QUERY,
      params: { agentId: agent._id },
    }),
  ]);

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">
            {greeting}, {agent.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your activity
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/listings/new">
            <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Listings */}
        <div className="bg-background rounded-2xl border border-border/50 p-6 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Home className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Listings
            </span>
          </div>
          <div className="text-4xl font-bold font-heading tabular-nums">
            {listingsCount}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Active properties
          </p>
        </div>

        {/* Total Leads */}
        <div className="bg-background rounded-2xl border border-border/50 p-6 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <MessageSquare
                className="h-6 w-6 text-secondary"
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Leads
            </span>
          </div>
          <div className="text-4xl font-bold font-heading tabular-nums">
            {leadsCount}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Total inquiries</p>
        </div>

        {/* New Leads */}
        <div className="bg-background rounded-2xl border border-border/50 p-6 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              New
            </span>
          </div>
          <div className="text-4xl font-bold font-heading tabular-nums">
            {newLeadsCount}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Awaiting response
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
              asChild
            >
              <Link href="/dashboard/listings/new">
                <span className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <span>
                    <span className="block font-semibold">
                      Create New Listing
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Add a new property to your portfolio
                    </span>
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
              asChild
            >
              <Link href="/dashboard/listings">
                <span className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Home
                      className="h-5 w-5 text-secondary"
                      aria-hidden="true"
                    />
                  </div>
                  <span>
                    <span className="block font-semibold">
                      View All Listings
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Manage your property listings
                    </span>
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-4"
              asChild
            >
              <Link href="/dashboard/leads">
                <span className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span>
                    <span className="block font-semibold">View Lead Inbox</span>
                    <span className="block text-xs text-muted-foreground">
                      Respond to buyer inquiries
                    </span>
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Action Required */}
        {newLeadsCount > 0 ? (
          <Card className="shadow-warm border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-heading text-primary flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6">
                You have{" "}
                <span className="font-bold text-primary tabular-nums">
                  {newLeadsCount} new lead{newLeadsCount !== 1 ? "s" : ""}
                </span>{" "}
                waiting for your response.
              </p>
              <Button asChild size="lg">
                <Link href="/dashboard/leads">
                  View Leads
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-warm bg-accent/30">
            <CardHeader>
              <CardTitle className="font-heading text-muted-foreground">
                All Caught Up!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                You have no pending leads. Keep your listings updated to attract
                more buyers.
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/listings">
                  Review Listings
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
