import { defineField, defineType } from "sanity";

export const lead = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  fields: [
    defineField({
      name: "property",
      title: "Property",
      type: "reference",
      to: [{ type: "property" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "agent",
      title: "Agent",
      type: "reference",
      to: [{ type: "agent" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buyerName",
      title: "Buyer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buyerEmail",
      title: "Buyer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "buyerPhone",
      title: "Buyer Phone",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      buyerName: "buyerName",
      propertyTitle: "property.title",
      status: "status",
    },
    prepare({ buyerName, propertyTitle, status }) {
      return {
        title: buyerName,
        subtitle: `${propertyTitle} - ${status}`,
      };
    },
  },
});
