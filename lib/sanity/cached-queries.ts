import { cache } from "react";
import { client } from "./client";

/**
 * Cached agent fetch - prevents duplicate requests within the same render pass.
 * React.cache() deduplicates calls with the same arguments during a single server render.
 */
export const getAgentByUserId = cache(async (userId: string) => {
  return client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id, onboardingComplete }`,
    { userId }
  );
});

/**
 * Cached agent for analytics (includes name)
 */
export const getAgentForAnalytics = cache(async (userId: string) => {
  return client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id, name, onboardingComplete }`,
    { userId }
  );
});
