"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_ID_BY_USER_QUERY,
  LEAD_AGENT_REF_QUERY,
  LEAD_EXISTS_QUERY,
  USER_CONTACT_QUERY,
} from "@/lib/sanity/queries";

export async function createLead(propertyId: string, agentId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Get user info from Sanity
  const { data: user } = await sanityFetch({
    query: USER_CONTACT_QUERY,
    params: { clerkId: userId },
  });

  if (!user) {
    throw new Error(
      "User profile not found. Please complete onboarding first.",
    );
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

  revalidatePath("/dashboard/leads");
}
