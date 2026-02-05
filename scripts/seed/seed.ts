import * as fs from "node:fs";
import * as path from "node:path";
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

// Load environment variables from .env.local (Next.js convention)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
// Also try .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Check for --clean flag
const shouldClean = process.argv.includes("--clean");

// Load JSON data
const dataDir = path.join(__dirname, "data");
const amenities = JSON.parse(
  fs.readFileSync(path.join(dataDir, "amenities.json"), "utf-8"),
);
const agents = JSON.parse(
  fs.readFileSync(path.join(dataDir, "agents.json"), "utf-8"),
);
const properties = JSON.parse(
  fs.readFileSync(path.join(dataDir, "properties.json"), "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(path.join(dataDir, "users.json"), "utf-8"),
);
const leads = JSON.parse(
  fs.readFileSync(path.join(dataDir, "leads.json"), "utf-8"),
);

async function uploadImage(url: string): Promise<string | null> {
  try {
    console.log(`    Downloading image: ${url.substring(0, 60)}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`    Failed to download image: ${response.status}`);
      return null;
    }
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload(
      "image",
      Buffer.from(buffer) as unknown as Blob,
      {
        filename: `seed-image-${Date.now()}.jpg`,
      },
    );
    return asset._id;
  } catch (error) {
    console.log(`    Error uploading image: ${error}`);
    return null;
  }
}

async function cleanSeedData() {
  console.log("\n🧹 Cleaning existing seed data...\n");

  // Delete all documents with seed_ prefix
  const seedDocs = await client.fetch(`*[_id match "seed_*"]{ _id, _type }`);

  if (seedDocs.length === 0) {
    console.log("No seed data found to clean.\n");
    return;
  }

  console.log(`Found ${seedDocs.length} seed documents to delete.\n`);

  for (const doc of seedDocs) {
    try {
      await client.delete(doc._id);
      console.log(`  Deleted ${doc._type}: ${doc._id}`);
    } catch (error) {
      console.log(`  Failed to delete ${doc._id}: ${error}`);
    }
  }

  console.log("\n✅ Seed data cleaned.\n");
}

async function seedAmenities() {
  console.log("\n🏷️ Seeding amenities...\n");

  for (const amenity of amenities) {
    console.log(`  Creating amenity: ${amenity.label}`);

    const doc = {
      _id: amenity._id,
      _type: "amenity",
      value: amenity.value,
      label: amenity.label,
      icon: amenity.icon,
      order: amenity.order,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created amenity: ${amenity.label}`);
  }

  console.log(`\n✅ Seeded ${amenities.length} amenities.\n`);
}

async function seedAgents() {
  console.log("\n👥 Seeding agents...\n");

  for (const agent of agents) {
    console.log(`  Creating agent: ${agent.name}`);

    // Upload agent photo
    let photoAssetId: string | null = null;
    if (agent.photoUrl) {
      photoAssetId = await uploadImage(agent.photoUrl);
    }

    const doc = {
      _id: agent._id,
      _type: "agent",
      userId: agent.userId,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      bio: agent.bio,
      licenseNumber: agent.licenseNumber,
      agency: agent.agency,
      onboardingComplete: agent.onboardingComplete,
      createdAt: new Date().toISOString(),
      ...(photoAssetId && {
        photo: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: photoAssetId,
          },
        },
      }),
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created agent: ${agent.name}`);
  }

  console.log(`\n✅ Seeded ${agents.length} agents.\n`);
}

async function seedProperties() {
  console.log("\n🏠 Seeding properties...\n");

  for (const property of properties) {
    console.log(`  Creating property: ${property.title}`);

    // Upload property images
    const imageAssets: Array<{
      _type: string;
      _key: string;
      asset: { _type: string; _ref: string };
      alt: string;
    }> = [];

    if (property.imageUrls && property.imageUrls.length > 0) {
      for (let i = 0; i < property.imageUrls.length; i++) {
        const assetId = await uploadImage(property.imageUrls[i]);
        if (assetId) {
          imageAssets.push({
            _type: "image",
            _key: `image-${i}`,
            asset: {
              _type: "reference",
              _ref: assetId,
            },
            alt: `${property.title} - Image ${i + 1}`,
          });
        }
      }
    }

    const doc = {
      _id: property._id,
      _type: "property",
      title: property.title,
      slug: {
        _type: "slug",
        current: property.slug,
      },
      description: property.description,
      price: property.price,
      propertyType: property.propertyType,
      status: property.status,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squareFeet: property.squareFeet,
      yearBuilt: property.yearBuilt,
      address: property.address,
      location: {
        _type: "geopoint",
        lat: property.location.lat,
        lng: property.location.lng,
      },
      amenities: property.amenities,
      agent: {
        _type: "reference",
        _ref: property.agentId,
      },
      featured: property.featured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(imageAssets.length > 0 && { images: imageAssets }),
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created property: ${property.title}`);
  }

  console.log(`\n✅ Seeded ${properties.length} properties.\n`);
}

async function seedUsers() {
  console.log("\n👤 Seeding users...\n");

  for (const user of users) {
    console.log(`  Creating user: ${user.name}`);

    const doc = {
      _id: user._id,
      _type: "user",
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      savedListings: user.savedListings.map((id: string) => ({
        _type: "reference",
        _ref: id,
        _key: `saved-${id}`,
      })),
      createdAt: new Date().toISOString(),
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created user: ${user.name}`);
  }

  console.log(`\n✅ Seeded ${users.length} users.\n`);
}

async function seedLeads() {
  console.log("\n📧 Seeding leads...\n");

  for (const lead of leads) {
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
        _ref: lead.agentId,
      },
      buyerName: lead.buyerName,
      buyerEmail: lead.buyerEmail,
      buyerPhone: lead.buyerPhone,
      message: lead.message,
      status: lead.status,
      createdAt: createdAt.toISOString(),
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created lead from: ${lead.buyerName}`);
  }

  console.log(`\n✅ Seeded ${leads.length} leads.\n`);
}

async function main() {
  console.log("\n🌱 Starting seed process...\n");
  console.log(`Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(
    `Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}`,
  );

  if (!process.env.SANITY_API_TOKEN) {
    console.error("\n❌ Error: SANITY_API_TOKEN is required.\n");
    console.error("Please add SANITY_API_TOKEN to your .env.local file.");
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error("\n❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID is required.\n");
    console.error(
      "Please add NEXT_PUBLIC_SANITY_PROJECT_ID to your .env.local file.",
    );
    process.exit(1);
  }

  try {
    if (shouldClean) {
      await cleanSeedData();
    }

    // Seed in dependency order
    await seedAmenities();
    await seedAgents();
    await seedProperties();
    await seedUsers();
    await seedLeads();

    console.log("\n🎉 Seed complete!\n");
    console.log("Summary:");
    console.log(`  - ${amenities.length} amenities`);
    console.log(`  - ${agents.length} agents`);
    console.log(`  - ${properties.length} properties`);
    console.log(`  - ${users.length} users`);
    console.log(`  - ${leads.length} leads`);
    console.log("\nYou can view the data in Sanity Studio at /studio\n");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
