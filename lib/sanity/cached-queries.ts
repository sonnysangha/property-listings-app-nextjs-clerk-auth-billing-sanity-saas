import { cache } from "react";
import { sanityFetch } from "./live";
import { AGENT_ONBOARDING_CHECK_QUERY, ANALYTICS_AGENT_QUERY } from "./queries";

/**
 * Cached queries for React deduplication.
 * React.cache() deduplicates calls with the same arguments during a single server render.
 */

/**
 * Cached agent fetch - prevents duplicate requests within the same render pass.
 */
export const getAgentByUserId = cache(async (userId: string) => {
  const { data } = await sanityFetch({
    query: AGENT_ONBOARDING_CHECK_QUERY,
    params: { userId },
  });
  return data;
});

/**
 * Cached agent for analytics (includes name)
 */
export const getAgentForAnalytics = cache(async (userId: string) => {
  const { data } = await sanityFetch({
    query: ANALYTICS_AGENT_QUERY,
    params: { userId },
  });
  return data;
});
