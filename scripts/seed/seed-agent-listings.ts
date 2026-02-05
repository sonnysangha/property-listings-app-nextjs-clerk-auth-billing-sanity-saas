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
const AGENT_EMAIL = "sonny.sangha@gmail.com"; // replace with your agent email for testing

// Property listings to seed for this agent
const agentListings = [
  {
    _id: "sonny_property_1",
    title: "Stunning Modern Villa with Ocean Views",
    slug: "stunning-modern-villa-ocean-views",
    description:
      "Experience luxury living in this breathtaking modern villa with panoramic ocean views. This architectural masterpiece features floor-to-ceiling windows, an infinity pool overlooking the Pacific, gourmet chef's kitchen with top-of-the-line appliances, and a private home theater. The primary suite boasts a spa-inspired bathroom and private balcony. Perfect for those seeking the ultimate coastal lifestyle.",
    price: 4250000,
    propertyType: "house",
    status: "active",
    bedrooms: 6,
    bathrooms: 5,
    squareFeet: 5800,
    yearBuilt: 2022,
    address: {
      street: "2847 Pacific Coast Highway",
      city: "Malibu",
      state: "CA",
      zipCode: "90265",
    },
    location: { lat: 34.0259, lng: -118.7798 },
    amenities: [
      "pool",
      "garage",
      "fireplace",
      "central-ac",
      "smart-home",
      "security-system",
      "ocean-view",
      "home-theater",
    ],
    featured: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
    ],
  },
  {
    _id: "sonny_property_2",
    title: "Elegant Beverly Hills Estate",
    slug: "elegant-beverly-hills-estate",
    description:
      "Timeless elegance meets modern luxury in this magnificent Beverly Hills estate. Situated on over an acre of meticulously landscaped grounds, this home offers unparalleled privacy and sophistication. Features include a grand foyer with sweeping staircase, formal living and dining rooms, wine cellar, and resort-style pool with cabana. The perfect entertainer's dream.",
    price: 8750000,
    propertyType: "house",
    status: "active",
    bedrooms: 7,
    bathrooms: 8,
    squareFeet: 9200,
    yearBuilt: 2018,
    address: {
      street: "1250 Coldwater Canyon Drive",
      city: "Beverly Hills",
      state: "CA",
      zipCode: "90210",
    },
    location: { lat: 34.0901, lng: -118.4065 },
    amenities: [
      "pool",
      "garage",
      "fireplace",
      "central-ac",
      "smart-home",
      "security-system",
      "wine-cellar",
      "guest-house",
      "home-theater",
      "hot-tub",
    ],
    featured: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200",
    ],
  },
  {
    _id: "sonny_property_3",
    title: "Luxurious Downtown Penthouse",
    slug: "luxurious-downtown-penthouse-la",
    description:
      "Soar above the city in this spectacular downtown Los Angeles penthouse. Occupying the entire top floor of a prestigious high-rise, this residence offers 360-degree views of the city, mountains, and ocean. Features include a private elevator entry, chef's kitchen, temperature-controlled wine room, and expansive terrace perfect for al fresco dining.",
    price: 3950000,
    propertyType: "condo",
    status: "active",
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 4100,
    yearBuilt: 2021,
    address: {
      street: "1000 Wilshire Blvd PH",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90017",
    },
    location: { lat: 34.0522, lng: -118.2571 },
    amenities: [
      "pool",
      "gym",
      "parking",
      "central-ac",
      "smart-home",
      "security-system",
      "city-view",
      "doorman",
      "wine-cellar",
    ],
    featured: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    ],
  },
  {
    _id: "sonny_property_4",
    title: "Contemporary Santa Monica Beach House",
    slug: "contemporary-santa-monica-beach-house",
    description:
      "Live the California dream in this stunning contemporary beach house just steps from the sand. This light-filled home features walls of glass that blur the line between indoor and outdoor living. Enjoy morning coffee on your private deck overlooking the ocean, entertain in the open-concept living space, and retreat to the serene primary suite with ocean views.",
    price: 5200000,
    propertyType: "house",
    status: "active",
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 3200,
    yearBuilt: 2020,
    address: {
      street: "456 Ocean Ave",
      city: "Santa Monica",
      state: "CA",
      zipCode: "90402",
    },
    location: { lat: 34.0195, lng: -118.4912 },
    amenities: [
      "garage",
      "fireplace",
      "central-ac",
      "smart-home",
      "security-system",
      "ocean-view",
      "balcony",
      "hardwood-floors",
    ],
    featured: true,
    imageUrls: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
    ],
  },
  {
    _id: "sonny_property_5",
    title: "Mid-Century Modern in Hollywood Hills",
    slug: "mid-century-modern-hollywood-hills",
    description:
      "Iconic mid-century modern masterpiece perched in the Hollywood Hills with sweeping city views. This architectural gem has been meticulously restored and updated while preserving its original character. Features include post-and-beam construction, walls of glass, terrazzo floors, and a stunning infinity pool. Celebrity-owned and ready for its next chapter.",
    price: 2850000,
    propertyType: "house",
    status: "active",
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2400,
    yearBuilt: 1962,
    address: {
      street: "8234 Mulholland Drive",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90046",
    },
    location: { lat: 34.1234, lng: -118.3674 },
    amenities: [
      "pool",
      "garage",
      "fireplace",
      "central-ac",
      "hardwood-floors",
      "city-view",
    ],
    featured: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200",
    ],
  },
  {
    _id: "sonny_property_6",
    title: "Spanish Colonial in Los Feliz",
    slug: "spanish-colonial-los-feliz",
    description:
      "Step into old Hollywood glamour in this exquisite Spanish Colonial estate in prestigious Los Feliz. Original details include hand-painted tiles, wrought iron accents, beamed ceilings, and multiple fireplaces. The enchanting grounds feature a courtyard, rose gardens, and a sparkling pool surrounded by mature trees. A rare opportunity to own a piece of history.",
    price: 3450000,
    propertyType: "house",
    status: "pending",
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4100,
    yearBuilt: 1928,
    address: {
      street: "2100 Glendower Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90027",
    },
    location: { lat: 34.1128, lng: -118.2809 },
    amenities: [
      "pool",
      "garage",
      "fireplace",
      "garden",
      "hardwood-floors",
      "guest-house",
    ],
    featured: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200",
    ],
  },
  {
    _id: "sonny_property_7",
    title: "Sleek West Hollywood Condo",
    slug: "sleek-west-hollywood-condo",
    description:
      "Ultra-modern living in the heart of West Hollywood. This designer condo features clean lines, premium finishes, and an open floor plan flooded with natural light. The gourmet kitchen boasts custom Italian cabinetry and top-tier appliances. Building amenities include a rooftop pool, fitness center, and 24-hour concierge. Walk to the best restaurants and boutiques.",
    price: 1350000,
    propertyType: "condo",
    status: "active",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1450,
    yearBuilt: 2023,
    address: {
      street: "8899 Beverly Blvd #1201",
      city: "West Hollywood",
      state: "CA",
      zipCode: "90048",
    },
    location: { lat: 34.0764, lng: -118.3701 },
    amenities: [
      "pool",
      "gym",
      "parking",
      "central-ac",
      "smart-home",
      "doorman",
      "rooftop-deck",
    ],
    featured: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
    ],
  },
  {
    _id: "sonny_property_8",
    title: "Craftsman Bungalow in Pasadena",
    slug: "craftsman-bungalow-pasadena",
    description:
      "Charming Craftsman bungalow in Pasadena's sought-after Bungalow Heaven neighborhood. This lovingly maintained home features original built-ins, hardwood floors, and a classic front porch. Updated kitchen and bathrooms blend modern convenience with period charm. The private backyard includes a detached studio perfect for a home office or creative space.",
    price: 975000,
    propertyType: "house",
    status: "active",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1650,
    yearBuilt: 1918,
    address: {
      street: "789 N Michigan Ave",
      city: "Pasadena",
      state: "CA",
      zipCode: "91104",
    },
    location: { lat: 34.1478, lng: -118.1445 },
    amenities: ["fireplace", "hardwood-floors", "garden", "home-office"],
    featured: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
    ],
  },
  {
    _id: "sonny_property_9",
    title: "Modern Townhome in Playa Vista",
    slug: "modern-townhome-playa-vista",
    description:
      "Contemporary townhome in the tech hub of Playa Vista. This three-level home features a flexible floor plan with open living spaces, private rooftop deck, and attached two-car garage. Walking distance to Silicon Beach tech companies, restaurants, and the Playa Vista Concert Park. Community amenities include pools, parks, and fitness centers.",
    price: 1650000,
    propertyType: "townhouse",
    status: "active",
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2100,
    yearBuilt: 2019,
    address: {
      street: "12456 Sunrise Place",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90094",
    },
    location: { lat: 33.9745, lng: -118.4167 },
    amenities: [
      "garage",
      "central-ac",
      "smart-home",
      "rooftop-deck",
      "washer-dryer",
    ],
    featured: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
    ],
  },
  {
    _id: "sonny_property_10",
    title: "Architectural Gem in Silver Lake",
    slug: "architectural-gem-silver-lake",
    description:
      "Striking contemporary architecture in the heart of Silver Lake. This unique home features dramatic angles, floor-to-ceiling windows, and an open floor plan that flows seamlessly to outdoor living spaces. The chef's kitchen includes custom cabinetry and premium appliances. Enjoy morning views of the reservoir and evening city lights from your private deck.",
    price: 1875000,
    propertyType: "house",
    status: "active",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1950,
    yearBuilt: 2017,
    address: {
      street: "2567 Apex Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90039",
    },
    location: { lat: 34.0844, lng: -118.2572 },
    amenities: [
      "garage",
      "fireplace",
      "central-ac",
      "hardwood-floors",
      "balcony",
      "city-view",
    ],
    featured: false,
    imageUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200",
    ],
  },
];

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

async function findAgentByEmail(
  email: string,
): Promise<{ _id: string; name: string } | null> {
  const agent = await client.fetch(
    `*[_type == "agent" && email == $email][0]{ _id, name }`,
    { email },
  );
  return agent;
}

async function seedAgentListings(agentId: string) {
  console.log("\n🏠 Seeding properties for agent...\n");

  for (const property of agentListings) {
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
        _ref: agentId,
      },
      featured: property.featured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(imageAssets.length > 0 && { images: imageAssets }),
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created property: ${property.title}`);
  }

  console.log(`\n✅ Seeded ${agentListings.length} properties.\n`);
}

async function main() {
  console.log("\n🌱 Starting agent listings seed process...\n");
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
      console.error(
        "Make sure the agent has completed onboarding before running this script.",
      );
      process.exit(1);
    }

    console.log(`✅ Found agent: ${agent.name} (${agent._id})\n`);

    // Seed the listings
    await seedAgentListings(agent._id);

    console.log("\n🎉 Seed complete!\n");
    console.log("Summary:");
    console.log(`  - Agent: ${agent.name}`);
    console.log(`  - Properties created: ${agentListings.length}`);
    console.log("\nYou can view the data in Sanity Studio at /studio\n");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
