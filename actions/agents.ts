"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import type { AgentOnboardingData, AgentProfileData } from "@/types";

/**
 * Get or create agent document for current user.
 * Called from dashboard layout - creates agent doc on first access if user has agent plan.
 * No webhooks needed - Clerk Billing is the source of truth for subscription status.
 */
export async function getOrCreateAgent() {
  const { userId, has } = await auth();

  if (!userId) {
    return null;
  }

  // Check if user has agent plan via Clerk Billing
  const isAgent = has({ plan: "agent" });
  if (!isAgent) {
    return null;
  }

  // Check if agent doc already exists
  const existingAgent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id, userId, name, email, onboardingComplete }`,
    { userId },
  );

  if (existingAgent) {
    return existingAgent;
  }

  // First time accessing dashboard with agent plan - create agent doc
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const newAgent = await client.create({
    _type: "agent",
    userId,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Agent",
    email: user.emailAddresses[0]?.emailAddress || "",
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  });

  return {
    _id: newAgent._id,
    userId,
    name: newAgent.name,
    email: newAgent.email,
    onboardingComplete: false,
  };
}

export async function completeAgentOnboarding(data: AgentOnboardingData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const agent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id }`,
    { userId },
  );

  if (!agent) {
    throw new Error("Agent not found");
  }

  await client
    .patch(agent._id)
    .set({
      bio: data.bio,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      agency: data.agency || "",
      onboardingComplete: true,
    })
    .commit();

  redirect("/dashboard");
}

export async function updateAgentProfile(data: AgentProfileData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const agent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id }`,
    { userId },
  );

  if (!agent) {
    throw new Error("Agent not found");
  }

  await client
    .patch(agent._id)
    .set({
      bio: data.bio,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      agency: data.agency || "",
    })
    .commit();

  revalidatePath("/dashboard/profile");
}

export async function getAgentByUserId(userId: string) {
  const agent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id, userId, name, email, onboardingComplete }`,
    { userId },
  );

  return agent;
}
