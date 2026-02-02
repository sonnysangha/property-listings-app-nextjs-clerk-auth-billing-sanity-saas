import { requireAgent } from "@/lib/auth/requireAgent";
import { AgentProfileForm } from "@/components/forms/AgentProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AGENT_PROFILE_QUERY } from "@/lib/sanity/queries";
import type { AgentProfileData } from "@/types";

export default async function AgentProfilePage() {
  // Single call handles: auth, plan check, agent fetch/create, onboarding check
  const agent = await requireAgent<AgentProfileData & { onboardingComplete: boolean }>(AGENT_PROFILE_QUERY);

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
