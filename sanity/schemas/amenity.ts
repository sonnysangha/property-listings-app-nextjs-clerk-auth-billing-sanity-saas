import { defineField, defineType } from "sanity";

export const amenity = defineType({
  name: "amenity",
  title: "Amenity",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "Unique identifier (e.g., 'pool', 'garage')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Display name (e.g., 'Swimming Pool', 'Garage')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional icon name (for future use)",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which amenities appear",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "value",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
