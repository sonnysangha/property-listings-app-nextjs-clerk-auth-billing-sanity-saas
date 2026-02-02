import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAgentDocument } from "@/actions/agents";
import { sanityFetch } from "@/lib/sanity/live";

interface RequireAgentOptions {
  /** Allow access even if onboarding is not complete (for onboarding page) */
  allowIncomplete?: boolean;
}

/**
 * Unified auth gate for all dashboard pages that require an agent.
 *
 * Handles:
 * - Auth check (redirects to sign-in if not authenticated)
 * - Plan check (redirects to pricing if no agent plan)
 * - Agent document fetch
 * - Lazy agent document creation (if subscribed but no document)
 * - Onboarding check (redirects if not complete, unless allowIncomplete)
 *
 * @param query - The Sanity query to fetch agent data (must accept `userId` param)
 * @param options - Optional settings
 * @returns The agent data from the query
 *
 * @example
 * ```tsx
 * const agent = await requireAgent<AgentProfile>(AGENT_PROFILE_QUERY);
 * ```
 */
export async function requireAgent<T extends { onboardingComplete?: boolean }>(
  query: string,
  options?: RequireAgentOptions
): Promise<T> {
  const { userId, has } = await auth();

  // Auth check
  if (!userId) {
    redirect("/sign-in");
  }

  // Plan check
  const hasAgentPlan = has({ plan: "agent" });
  if (!hasAgentPlan) {
    redirect("/pricing");
  }

  // Fetch agent
  const { data: agent } = await sanityFetch({
    query,
    params: { userId },
  });

  // Lazy creation: if no agent document exists, create one
  if (!agent) {
    await createAgentDocument();
    redirect("/dashboard/onboarding");
  }

  // Onboarding check (skip if allowIncomplete)
  if (!options?.allowIncomplete && !agent.onboardingComplete) {
    redirect("/dashboard/onboarding");
  }

  return agent as T;
}
