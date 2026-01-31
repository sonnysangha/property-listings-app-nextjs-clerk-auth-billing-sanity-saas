import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AgentProfileForm } from "@/components/forms/AgentProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sanityFetch } from "@/lib/sanity/live";
import { AGENT_PROFILE_QUERY } from "@/lib/sanity/queries";

export default async function AgentProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: agent } = await sanityFetch({
    query: AGENT_PROFILE_QUERY,
    params: { userId },
  });

  if (!agent) {
    redirect("/pricing");
  }

  if (!agent.onboardingComplete) {
    redirect("/dashboard/onboarding");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agent Profile</h1>
        <p className="text-muted-foreground">
          Manage your professional profile information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentProfileForm agent={agent} />
        </CardContent>
      </Card>
    </div>
  );
}
