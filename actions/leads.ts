"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { client } from "@/lib/sanity/client";

export async function createLead(propertyId: string, agentId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Get user info from Sanity
  const user = await client.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]{ name, email, phone }`,
    { clerkId: userId },
  );

  if (!user) {
    throw new Error(
      "User profile not found. Please complete onboarding first.",
    );
  }

  // Check if lead already exists for this user/property combination
  const existingLead = await client.fetch(
    `*[_type == "lead" && property._ref == $propertyId && buyerEmail == $email][0]{ _id }`,
    { propertyId, email: user.email },
  );

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
  const agent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id }`,
    { userId },
  );

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Verify lead belongs to this agent
  const lead = await client.fetch(
    `*[_type == "lead" && _id == $leadId][0]{ agent }`,
    { leadId },
  );

  if (!lead || lead.agent._ref !== agent._id) {
    throw new Error("Unauthorized");
  }

  await client.patch(leadId).set({ status }).commit();

  revalidatePath("/dashboard/leads");
}
