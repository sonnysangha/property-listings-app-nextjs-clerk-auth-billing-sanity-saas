"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_BY_USER_ID_QUERY,
  AGENT_ID_BY_USER_QUERY,
  LEAD_AGENT_REF_QUERY,
  LEAD_EXISTS_QUERY,
  USER_CONTACT_QUERY,
} from "@/lib/sanity/queries";

/**
 * Ensures Clerk metadata is synced with Sanity state.
 * Returns user contact info if found, null if user needs onboarding.
 */
async function ensureOnboardingComplete(userId: string) {
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  // Check if user exists in Sanity (regular user)
  const { data: user } = await sanityFetch({
    query: USER_CONTACT_QUERY,
    params: { clerkId: userId },
  });

  if (user) {
    // User exists - sync Clerk metadata if needed
    if (!clerkUser.publicMetadata?.onboardingComplete) {
      await clerk.users.updateUser(userId, {
        publicMetadata: {
          ...clerkUser.publicMetadata,
          onboardingComplete: true,
        },
      });
    }
    return user;
  }

  // Check if agent exists in Sanity (agent user)
  const { data: agent } = await sanityFetch({
    query: AGENT_BY_USER_ID_QUERY,
    params: { userId },
  });

  if (agent) {
    // Agent exists - sync Clerk metadata if needed and return agent as user contact
    if (!clerkUser.publicMetadata?.onboardingComplete) {
      await clerk.users.updateUser(userId, {
        publicMetadata: {
          ...clerkUser.publicMetadata,
          onboardingComplete: true,
        },
      });
    }
    return { name: agent.name, email: agent.email, phone: null };
  }

  // No user or agent found - needs onboarding
  return null;
}

export async function createLead(
  propertyId: string,
  agentId: string,
): Promise<{
  success: boolean;
  requiresOnboarding?: boolean;
  message?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Check/sync onboarding status and get user contact info
  const user = await ensureOnboardingComplete(userId);

  if (!user) {
    return { success: false, requiresOnboarding: true };
  }

  // Check if lead already exists for this user/property combination
  const { data: existingLead } = await sanityFetch({
    query: LEAD_EXISTS_QUERY,
    params: { propertyId, email: user.email },
  });

  if (existingLead) {
    return { success: true, message: "You have already contacted this agent." };
  }

  // Create lead document
  await client.create({
    _type: "lead",
    property: { _type: "reference", _ref: propertyId },
    agent: { _type: "reference", _ref: agentId },
    buyerName: user.name,
    buyerEmail: user.email,
    buyerPhone: user.phone || "",
    status: "new",
    createdAt: new Date().toISOString(),
  });

  return { success: true };
}

export async function updateLeadStatus(
  leadId: string,
  status: "new" | "contacted" | "closed",
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Get agent to verify ownership
  const { data: agent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Verify lead belongs to this agent
  const { data: lead } = await sanityFetch({
    query: LEAD_AGENT_REF_QUERY,
    params: { leadId },
  });

  if (!lead || lead.agent._ref !== agent._id) {
    throw new Error("Unauthorized");
  }

  await client.patch(leadId).set({ status }).commit();
}
