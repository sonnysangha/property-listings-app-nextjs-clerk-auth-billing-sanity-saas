import type { SchemaTypeDefinition } from "sanity";
import { agent } from "./schemas/agent";
import { amenity } from "./schemas/amenity";
import { lead } from "./schemas/lead";
import { property } from "./schemas/property";
import { user } from "./schemas/user";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, agent, lead, user, amenity],
};
