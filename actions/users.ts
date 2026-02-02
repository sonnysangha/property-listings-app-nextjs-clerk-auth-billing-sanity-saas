"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
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

  revalidatePath("/profile");
}

export async function toggleSavedListing(propertyId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: user } = await sanityFetch({
    query: USER_SAVED_IDS_QUERY,
    params: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
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

  revalidatePath("/saved");
  revalidatePath("/properties");
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
