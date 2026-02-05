import * as path from "node:path";
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

// Load environment variables from .env.local (Next.js convention)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Target agent email
const AGENT_EMAIL = "sonny.sangha@gmail.com";

// Leads to seed - will be matched with actual property IDs
const leadsData = [
  // Leads for Stunning Modern Villa with Ocean Views (sonny_property_1)
  {
    _id: "sonny_lead_1",
    propertyId: "sonny_property_1",
    buyerName: "James Harrison",
    buyerEmail: "james.harrison@gmail.com",
    buyerPhone: "(310) 555-1234",
    message:
      "I'm very interested in this Malibu property. I've been searching for an ocean view home for months and this looks perfect. Would love to schedule a private showing this weekend if possible.",
    status: "new",
    daysAgo: 1,
  },
  {
    _id: "sonny_lead_2",
    propertyId: "sonny_property_1",
    buyerName: "Victoria Chen",
    buyerEmail: "v.chen@techventures.com",
    buyerPhone: "(415) 555-9876",
    message:
      "My family is relocating from San Francisco and we're looking for a luxury property in Malibu. This villa caught our attention. Can we arrange a viewing next week?",
    status: "contacted",
    daysAgo: 5,
  },

  // Leads for Elegant Beverly Hills Estate (sonny_property_2)
  {
    _id: "sonny_lead_3",
    propertyId: "sonny_property_2",
    buyerName: "Marcus Williams",
    buyerEmail: "marcus.w@entertainmentmgmt.com",
    buyerPhone: "(323) 555-4567",
    message:
      "I represent a high-profile client interested in Beverly Hills estates. This property matches their requirements. Please contact me to discuss further.",
    status: "new",
    daysAgo: 0,
  },
  {
    _id: "sonny_lead_4",
    propertyId: "sonny_property_2",
    buyerName: "Sophia Martinez",
    buyerEmail: "sophia.martinez@luxuryrealty.com",
    buyerPhone: "(310) 555-7890",
    message:
      "Beautiful estate! I have a buyer pre-approved for up to $10M looking in Beverly Hills. Is this still available? Can we schedule a showing ASAP?",
    status: "contacted",
    daysAgo: 3,
  },
  {
    _id: "sonny_lead_5",
    propertyId: "sonny_property_2",
    buyerName: "Robert Kim",
    buyerEmail: "r.kim@investgroup.com",
    buyerPhone: "(213) 555-2345",
    message:
      "Interested in this property as an investment. What's the rental potential in this area? Would like to discuss numbers.",
    status: "closed",
    daysAgo: 14,
  },

  // Leads for Luxurious Downtown Penthouse (sonny_property_3)
  {
    _id: "sonny_lead_6",
    propertyId: "sonny_property_3",
    buyerName: "Amanda Foster",
    buyerEmail: "amanda.foster@lawfirm.com",
    buyerPhone: "(213) 555-3456",
    message:
      "I work downtown and have been looking for a penthouse for over a year. This looks amazing! When can I see it?",
    status: "new",
    daysAgo: 2,
  },
  {
    _id: "sonny_lead_7",
    propertyId: "sonny_property_3",
    buyerName: "Daniel Park",
    buyerEmail: "dpark@startupco.io",
    buyerPhone: "(424) 555-6789",
    message:
      "Just sold my company and looking to upgrade to a luxury condo downtown. This penthouse is exactly what I had in mind. Very interested!",
    status: "contacted",
    daysAgo: 7,
  },

  // Leads for Contemporary Santa Monica Beach House (sonny_property_4)
  {
    _id: "sonny_lead_8",
    propertyId: "sonny_property_4",
    buyerName: "Emily Richardson",
    buyerEmail: "emily.r@designstudio.com",
    buyerPhone: "(310) 555-8901",
    message:
      "I'm an interior designer and absolutely love the contemporary design of this beach house. Looking to buy for personal use. Please reach out!",
    status: "new",
    daysAgo: 1,
  },
  {
    _id: "sonny_lead_9",
    propertyId: "sonny_property_4",
    buyerName: "Michael Thompson",
    buyerEmail: "m.thompson@oceanside.com",
    buyerPhone: "(858) 555-2468",
    message:
      "Moving from San Diego for work. Santa Monica is my target area and this property looks perfect. Can we set up a virtual tour first?",
    status: "new",
    daysAgo: 0,
  },

  // Leads for Mid-Century Modern in Hollywood Hills (sonny_property_5)
  {
    _id: "sonny_lead_10",
    propertyId: "sonny_property_5",
    buyerName: "Lisa Anderson",
    buyerEmail: "lisa.a@filmproduction.com",
    buyerPhone: "(323) 555-1357",
    message:
      "I'm a huge fan of mid-century modern architecture. This property is stunning! Would love to see it in person.",
    status: "contacted",
    daysAgo: 4,
  },
  {
    _id: "sonny_lead_11",
    propertyId: "sonny_property_5",
    buyerName: "Christopher Lee",
    buyerEmail: "chris.lee@architech.com",
    buyerPhone: "(213) 555-9753",
    message:
      "As an architect, I appreciate the craftsmanship of this era. Very interested in making an offer. What's the current status?",
    status: "new",
    daysAgo: 2,
  },

  // Leads for Spanish Colonial in Los Feliz (sonny_property_6 - pending status)
  {
    _id: "sonny_lead_12",
    propertyId: "sonny_property_6",
    buyerName: "Patricia Gonzalez",
    buyerEmail: "patricia.g@heritage.org",
    buyerPhone: "(323) 555-8642",
    message:
      "This Spanish Colonial is breathtaking! I've always dreamed of owning a historic home in Los Feliz. Is the pending status firm or still accepting backup offers?",
    status: "contacted",
    daysAgo: 8,
  },

  // Leads for Sleek West Hollywood Condo (sonny_property_7)
  {
    _id: "sonny_lead_13",
    propertyId: "sonny_property_7",
    buyerName: "Ryan Mitchell",
    buyerEmail: "ryan.m@creativemedia.com",
    buyerPhone: "(323) 555-7531",
    message:
      "Love the WeHo location and modern design. This is exactly my style. First-time buyer here - would appreciate guidance through the process.",
    status: "new",
    daysAgo: 1,
  },
  {
    _id: "sonny_lead_14",
    propertyId: "sonny_property_7",
    buyerName: "Jennifer Wu",
    buyerEmail: "j.wu@techstartup.com",
    buyerPhone: "(415) 555-4826",
    message:
      "Relocating from SF for a new job. Looking for a modern condo in a walkable neighborhood. This checks all my boxes!",
    status: "contacted",
    daysAgo: 6,
  },

  // Leads for Craftsman Bungalow in Pasadena (sonny_property_8)
  {
    _id: "sonny_lead_15",
    propertyId: "sonny_property_8",
    buyerName: "Thomas Anderson",
    buyerEmail: "tom.anderson@caltech.edu",
    buyerPhone: "(626) 555-3698",
    message:
      "I'm a professor at Caltech and love the Bungalow Heaven neighborhood. This house is charming! When can we schedule a showing?",
    status: "new",
    daysAgo: 3,
  },
  {
    _id: "sonny_lead_16",
    propertyId: "sonny_property_8",
    buyerName: "Sarah Collins",
    buyerEmail: "s.collins@familylaw.com",
    buyerPhone: "(626) 555-7412",
    message:
      "Looking for a family home in Pasadena with character. This Craftsman is perfect! The studio would be great for my home office.",
    status: "new",
    daysAgo: 0,
  },

  // Leads for Modern Townhome in Playa Vista (sonny_property_9)
  {
    _id: "sonny_lead_17",
    propertyId: "sonny_property_9",
    buyerName: "Kevin Nguyen",
    buyerEmail: "k.nguyen@google.com",
    buyerPhone: "(310) 555-9517",
    message:
      "I work at Google's Playa Vista office and have been looking for a place nearby. This townhome is ideal - walking distance to work!",
    status: "contacted",
    daysAgo: 5,
  },
  {
    _id: "sonny_lead_18",
    propertyId: "sonny_property_9",
    buyerName: "Michelle Davis",
    buyerEmail: "michelle.d@amazon.com",
    buyerPhone: "(206) 555-8246",
    message:
      "Transferring to the LA office from Seattle. Playa Vista seems like the perfect neighborhood for tech workers. Very interested!",
    status: "new",
    daysAgo: 2,
  },

  // Leads for Architectural Gem in Silver Lake (sonny_property_10)
  {
    _id: "sonny_lead_19",
    propertyId: "sonny_property_10",
    buyerName: "Alex Rivera",
    buyerEmail: "alex.r@musiclabel.com",
    buyerPhone: "(323) 555-6284",
    message:
      "Silver Lake has been my dream neighborhood for years. This architectural gem is exactly what I've been waiting for. Please contact me immediately!",
    status: "new",
    daysAgo: 0,
  },
  {
    _id: "sonny_lead_20",
    propertyId: "sonny_property_10",
    buyerName: "Natalie Brooks",
    buyerEmail: "n.brooks@artgallery.com",
    buyerPhone: "(213) 555-1793",
    message:
      "As a gallery owner, I appreciate unique architecture. This home would be perfect for hosting intimate art events. Very interested in viewing!",
    status: "contacted",
    daysAgo: 9,
  },
];

async function findAgentByEmail(
  email: string,
): Promise<{ _id: string; name: string } | null> {
  const agent = await client.fetch(
    `*[_type == "agent" && email == $email][0]{ _id, name }`,
    { email },
  );
  return agent;
}

async function seedAgentLeads(agentId: string) {
  console.log("\n📧 Seeding leads for agent...\n");

  for (const lead of leadsData) {
    console.log(`  Creating lead from: ${lead.buyerName}`);

    // Calculate createdAt based on daysAgo
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - lead.daysAgo);

    const doc = {
      _id: lead._id,
      _type: "lead",
      property: {
        _type: "reference",
        _ref: lead.propertyId,
      },
      agent: {
        _type: "reference",
        _ref: agentId,
      },
      buyerName: lead.buyerName,
      buyerEmail: lead.buyerEmail,
      buyerPhone: lead.buyerPhone,
      message: lead.message,
      status: lead.status,
      createdAt: createdAt.toISOString(),
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created lead from: ${lead.buyerName} (${lead.status})`);
  }

  console.log(`\n✅ Seeded ${leadsData.length} leads.\n`);
}

async function main() {
  console.log("\n🌱 Starting agent leads seed process...\n");
  console.log(`Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(
    `Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}`,
  );
  console.log(`Target agent email: ${AGENT_EMAIL}`);

  if (!process.env.SANITY_API_TOKEN) {
    console.error("\n❌ Error: SANITY_API_TOKEN is required.\n");
    console.error("Please add SANITY_API_TOKEN to your .env.local file.");
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error("\n❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID is required.\n");
    process.exit(1);
  }

  try {
    // Find the agent by email
    console.log(`\n🔍 Looking for agent with email: ${AGENT_EMAIL}...`);
    const agent = await findAgentByEmail(AGENT_EMAIL);

    if (!agent) {
      console.error(`\n❌ Error: No agent found with email: ${AGENT_EMAIL}`);
      process.exit(1);
    }

    console.log(`✅ Found agent: ${agent.name} (${agent._id})\n`);

    // Seed the leads
    await seedAgentLeads(agent._id);

    // Summary by status
    const newLeads = leadsData.filter((l) => l.status === "new").length;
    const contactedLeads = leadsData.filter(
      (l) => l.status === "contacted",
    ).length;
    const closedLeads = leadsData.filter((l) => l.status === "closed").length;

    console.log("\n🎉 Seed complete!\n");
    console.log("Summary:");
    console.log(`  - Agent: ${agent.name}`);
    console.log(`  - Total leads created: ${leadsData.length}`);
    console.log(`    - New: ${newLeads}`);
    console.log(`    - Contacted: ${contactedLeads}`);
    console.log(`    - Closed: ${closedLeads}`);
    console.log(
      "\nYou can view the leads in the Agent Dashboard at /dashboard/leads\n",
    );
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
