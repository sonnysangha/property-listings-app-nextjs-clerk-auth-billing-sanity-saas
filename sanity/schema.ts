import type { SchemaTypeDefinition } from "sanity";
import { agent } from "./schemas/agent";
import { lead } from "./schemas/lead";
import { property } from "./schemas/property";
import { user } from "./schemas/user";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, agent, lead, user],
};
