import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAgentDocument } from "@/actions/agents";
import { AgentOnboardingForm } from "@/components/forms/AgentOnboardingForm";
import { sanityFetch } from "@/lib/sanity/live";
import { AGENT_ONBOARDING_CHECK_QUERY } from "@/lib/sanity/queries";

export default async function AgentOnboardingPage() {
  // Middleware guarantees: user is authenticated + has agent plan
  const { userId } = await auth();

  // Fetch agent (may not exist yet for new subscribers)
  const { data: agent } = await sanityFetch({
    query: AGENT_ONBOARDING_CHECK_QUERY,
    params: { userId },
  });

  // Lazy creation: if no agent document exists, create one
  if (!agent) {
    await createAgentDocument();
    // Refresh the page to load the newly created agent
    redirect("/dashboard/onboarding");
  }

  // If already onboarded, redirect to dashboard
  if (agent.onboardingComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Agent Profile</h1>
        <p className="text-muted-foreground">
          Set up your professional profile to start listing properties.
        </p>
      </div>

      <AgentOnboardingForm />
    </div>
  );
}
