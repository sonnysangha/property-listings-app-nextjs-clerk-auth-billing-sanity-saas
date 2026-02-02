import type { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { AGENT_EXISTS_BY_USER_QUERY } from "@/lib/sanity/queries";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log(`[Clerk Webhook] Received event: ${eventType}`);

  // Handle subscription created - create agent document when user subscribes to agent plan
  if (eventType === "subscription.created") {
    const subscription = evt.data as unknown as {
      user_id: string;
      plan_id: string;
      status: string;
    };

    console.log(`[Clerk Webhook] Subscription created:`, subscription);

    // Check if this is the agent plan subscription
    // The plan_id from Clerk should match your configured plan
    if (subscription.status === "active") {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(subscription.user_id);

      // Check if agent already exists
      const { data: existingAgent } = await sanityFetch({
        query: AGENT_EXISTS_BY_USER_QUERY,
        params: { userId: subscription.user_id },
      });

      if (!existingAgent) {
        // Create agent document
        await client.create({
          _type: "agent",
          userId: subscription.user_id,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Agent",
          email: user.emailAddresses[0]?.emailAddress || "",
          onboardingComplete: false,
          createdAt: new Date().toISOString(),
        });
        console.log(
          `[Clerk Webhook] Created agent document for user ${subscription.user_id}`
        );
      }
    }
  }

  // Handle legacy user.updated events (fallback)
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    // Check if user has agent plan in metadata (legacy support)
    const metadata = public_metadata as { plan?: string };
    if (metadata?.plan === "agent") {
      // Check if agent already exists
      const { data: existingAgent } = await sanityFetch({
        query: AGENT_EXISTS_BY_USER_QUERY,
        params: { userId: id },
      });

      if (!existingAgent) {
        // Create agent document
        await client.create({
          _type: "agent",
          userId: id,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "Agent",
          email: email_addresses[0]?.email_address || "",
          onboardingComplete: false,
          createdAt: new Date().toISOString(),
        });
        console.log(
          `[Clerk Webhook] Created agent document for user ${id} (via user.updated)`
        );
      }
    }
  }

  // Handle user created - user document is created during onboarding
  if (eventType === "user.created") {
    // No action needed - onboarding flow handles user creation
  }

  return new Response("Webhook received", { status: 200 });
}
