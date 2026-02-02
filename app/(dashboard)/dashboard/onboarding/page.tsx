import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/auth/requireAgent";
import { AgentOnboardingForm } from "@/components/forms/AgentOnboardingForm";
import { AGENT_ONBOARDING_CHECK_QUERY } from "@/lib/sanity/queries";

export default async function AgentOnboardingPage() {
  // Allow incomplete onboarding (this IS the onboarding page)
  const agent = await requireAgent<{ _id: string; onboardingComplete: boolean }>(
    AGENT_ONBOARDING_CHECK_QUERY,
    { allowIncomplete: true }
  );

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
