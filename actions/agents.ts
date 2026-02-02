"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import {
  AGENT_BY_USER_ID_QUERY,
  AGENT_ID_BY_USER_QUERY,
} from "@/lib/sanity/queries";
import type { AgentOnboardingData, AgentProfileData } from "@/types";

export async function completeAgentOnboarding(data: AgentOnboardingData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const agent = await client.fetch(AGENT_ID_BY_USER_QUERY, { userId });

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

  const agent = await client.fetch(AGENT_ID_BY_USER_QUERY, { userId });

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
  const agent = await client.fetch(AGENT_BY_USER_ID_QUERY, { userId });

  return agent;
}
