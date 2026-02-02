import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AgentOnboardingForm } from "@/components/forms/AgentOnboardingForm";
import { client } from "@/lib/sanity/client";
import { AGENT_ONBOARDING_CHECK_QUERY } from "@/lib/sanity/queries";

export default async function AgentOnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const agent = await client.fetch(AGENT_ONBOARDING_CHECK_QUERY, { userId });

  if (!agent) {
    redirect("/pricing");
  }

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
