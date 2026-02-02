"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ID_BY_USER_QUERY,
  LEAD_AGENT_REF_QUERY,
  LEAD_EXISTS_QUERY,
  USER_CONTACT_QUERY,
} from "@/lib/sanity/queries";

export async function createLead(
  propertyId: string,
  agentId: string
): Promise<{
  success: boolean;
  requiresOnboarding?: boolean;
  message?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Check if user has completed onboarding
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  if (!clerkUser.publicMetadata?.onboardingComplete) {
    return { success: false, requiresOnboarding: true };
  }

  // Get user info from Sanity
  const { data: user } = await sanityFetch({
    query: USER_CONTACT_QUERY,
    params: { clerkId: userId },
  });

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
  status: "new" | "contacted" | "closed"
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
