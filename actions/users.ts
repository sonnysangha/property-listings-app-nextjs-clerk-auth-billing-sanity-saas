"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  AGENT_BY_USER_ID_QUERY,
  USER_EXISTS_QUERY,
  USER_SAVED_IDS_QUERY,
} from "@/lib/sanity/queries";
import type { UserOnboardingData, UserProfileData } from "@/types";

export async function completeUserOnboarding(data: UserOnboardingData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || data.email;

  // Check if user already exists
  const { data: existingUser } = await sanityFetch({
    query: USER_EXISTS_QUERY,
    params: { clerkId: userId },
  });

  if (existingUser) {
    // Update existing user
    await client
      .patch(existingUser._id)
      .set({
        name: data.name,
        phone: data.phone,
      })
      .commit();
  } else {
    // Create new user document
    await client.create({
      _type: "user",
      clerkId: userId,
      name: data.name,
      email: email,
      phone: data.phone,
      savedListings: [],
      createdAt: new Date().toISOString(),
    });
  }

  // Mark onboarding complete in Clerk metadata
  const clerk = await clerkClient();
  await clerk.users.updateUser(userId, {
    publicMetadata: { onboardingComplete: true },
  });

  redirect("/");
}

export async function updateUserProfile(data: UserProfileData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: user } = await sanityFetch({
    query: USER_EXISTS_QUERY,
    params: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await client
    .patch(user._id)
    .set({
      name: data.name,
      phone: data.phone,
    })
    .commit();
}

/**
 * Ensures Clerk metadata is synced with Sanity state for saving listings.
 * Returns user with saved IDs if found, null if user needs onboarding.
 */
async function ensureOnboardingCompleteForSave(userId: string) {
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  // Check if user exists in Sanity
  const { data: user } = await sanityFetch({
    query: USER_SAVED_IDS_QUERY,
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

  // Check if agent exists - agents can also save properties
  const { data: agent } = await sanityFetch({
    query: AGENT_BY_USER_ID_QUERY,
    params: { userId },
  });

  if (agent) {
    // Agent exists but no user record - create a user record for them
    // so they can use savedListings feature
    const newUser = await client.create({
      _type: "user",
      clerkId: userId,
      name: agent.name,
      email: agent.email,
      phone: "",
      savedListings: [],
      createdAt: new Date().toISOString(),
    });

    // Sync Clerk metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: { ...clerkUser.publicMetadata, onboardingComplete: true },
    });

    return { _id: newUser._id, savedIds: [] };
  }

  return null;
}

export async function toggleSavedListing(
  propertyId: string,
): Promise<{ success: boolean; requiresOnboarding?: boolean }> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Check/sync onboarding status and get user
  const user = await ensureOnboardingCompleteForSave(userId);

  if (!user) {
    return { success: false, requiresOnboarding: true };
  }

  const isSaved = user.savedIds?.includes(propertyId);

  if (isSaved) {
    // Remove from saved
    await client
      .patch(user._id)
      .unset([`savedListings[_ref == "${propertyId}"]`])
      .commit();
  } else {
    // Add to saved
    await client
      .patch(user._id)
      .setIfMissing({ savedListings: [] })
      .append("savedListings", [{ _type: "reference", _ref: propertyId }])
      .commit();
  }

  return { success: true };
}

export async function getUserSavedIds(): Promise<string[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const { data: user } = await sanityFetch({
    query: USER_SAVED_IDS_QUERY,
    params: { clerkId: userId },
  });

  return user?.savedIds || [];
}

export async function isPropertySaved(propertyId: string): Promise<boolean> {
  const savedIds = await getUserSavedIds();
  return savedIds.includes(propertyId);
}
