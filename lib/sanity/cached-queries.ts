import { cache } from "react";
import { client } from "./client";
import {
  AGENT_ONBOARDING_CHECK_QUERY,
  ANALYTICS_AGENT_QUERY,
} from "./queries";

/**
 * Cached queries for React deduplication.
 * React.cache() deduplicates calls with the same arguments during a single server render.
 */

/**
 * Cached agent fetch - prevents duplicate requests within the same render pass.
 */
export const getAgentByUserId = cache(async (userId: string) => {
  return client.fetch(AGENT_ONBOARDING_CHECK_QUERY, { userId });
});

/**
 * Cached agent for analytics (includes name)
 */
export const getAgentForAnalytics = cache(async (userId: string) => {
  return client.fetch(ANALYTICS_AGENT_QUERY, { userId });
});
