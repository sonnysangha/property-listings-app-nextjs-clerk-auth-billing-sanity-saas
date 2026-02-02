import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { getOrCreateAgent } from "@/actions/agents";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, has } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check plan via Clerk Billing - no database lookup needed for subscription status
  const isAgent = has({ plan: "agent" });
  if (!isAgent) {
    redirect("/pricing");
  }

  // Get or create agent document (lazy creation on first dashboard access)
  const agent = await getOrCreateAgent();
  if (!agent) {
    redirect("/pricing");
  }

  // Get current path to avoid redirect loop on onboarding page
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
  const isOnboardingPage = pathname.includes("/dashboard/onboarding");

  // Redirect to onboarding if not complete (unless already on onboarding page)
  if (!agent.onboardingComplete && !isOnboardingPage) {
    redirect("/dashboard/onboarding");
  }

  // Show minimal layout for onboarding (no sidebar)
  if (!agent.onboardingComplete) {
    return (
      <div className="min-h-screen bg-accent/20">
        <main id="main" className="flex-1 p-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-accent/20">
      <DashboardSidebar />
      <main id="main" className="flex-1 p-8">{children}</main>
    </div>
  );
}
