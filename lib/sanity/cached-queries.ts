import { cache } from "react";
import { client } from "./client";
import { defineQuery } from "next-sanity";

/**
 * Cached queries using defineQuery for typegen support.
 * React.cache() deduplicates calls with the same arguments during a single server render.
 */

// Query definitions for typegen
export const AGENT_BY_USER_ID_CACHED_QUERY = defineQuery(/* groq */ `
  *[_type == "agent" && userId == $userId][0]{ _id, onboardingComplete }
`);

export const AGENT_FOR_ANALYTICS_QUERY = defineQuery(/* groq */ `
  *[_type == "agent" && userId == $userId][0]{ _id, name, onboardingComplete }
`);

/**
 * Cached agent fetch - prevents duplicate requests within the same render pass.
 */
export const getAgentByUserId = cache(async (userId: string) => {
  return client.fetch(AGENT_BY_USER_ID_CACHED_QUERY, { userId });
});

/**
 * Cached agent for analytics (includes name)
 */
export const getAgentForAnalytics = cache(async (userId: string) => {
  return client.fetch(AGENT_FOR_ANALYTICS_QUERY, { userId });
});
