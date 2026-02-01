import { cache } from "react";
import { client } from "./client";
import { AGENT_BY_USER_ID_QUERY, ANALYTICS_AGENT_QUERY } from "./queries";

/**
 * Cached agent fetch - prevents duplicate requests within the same render pass.
 * React.cache() deduplicates calls with the same arguments during a single server render.
 */
export const getAgentByUserId = cache(async (userId: string) => {
  return client.fetch(AGENT_BY_USER_ID_QUERY, { userId });
});

/**
 * Cached agent for analytics (includes name)
 */
export const getAgentForAnalytics = cache(async (userId: string) => {
  return client.fetch(ANALYTICS_AGENT_QUERY, { userId });
});
