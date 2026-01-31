import { defineQuery } from "next-sanity";

// Image fragment for reuse
const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  alt
`;

// Featured listings for homepage
export const FEATURED_PROPERTIES_QUERY = defineQuery(/* groq */ `
  *[_type == "property" && featured == true && status == "active"][0...6] {
    _id,
    title,
    "slug": slug.current,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    address,
    "image": images[0] { ${imageFragment} },
    location
  }
`);

// Property search with filters
export const PROPERTIES_SEARCH_QUERY = defineQuery(/* groq */ `
  *[_type == "property" && status == "active"
    && price >= $minPrice && price <= $maxPrice
    && bedrooms >= $beds && bathrooms >= $baths
    && ($type == "" || propertyType == $type)
    && ($city == "" || address.city == $city)
  ] | order(createdAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    price,
    bedrooms,
    bathrooms,
    squareFeet,
    address,
    "image": images[0] { ${imageFragment} },
    location
  }
`);

// Properties count for pagination
export const PROPERTIES_COUNT_QUERY = defineQuery(/* groq */ `
  count(*[_type == "property" && status == "active"
    && price >= $minPrice && price <= $maxPrice
    && bedrooms >= $beds && bathrooms >= $baths
    && ($type == "" || propertyType == $type)
    && ($city == "" || address.city == $city)
  ])
`);

// Single property with agent details
export const PROPERTY_DETAIL_QUERY = defineQuery(/* groq */ `
  *[_type == "property" && slug.current == $slug][0] {
    _id,
    title,
    description,
    price,
    propertyType,
    status,
    bedrooms,
    bathrooms,
    squareFeet,
    yearBuilt,
    address,
    location,
    images[] { ${imageFragment} },
    amenities,
    agent-> {
      _id,
      userId,
      name,
      email,
      phone,
      photo { ${imageFragment} },
      bio,
      agency
    }
  }
`);

// Agent's listings (for dashboard)
export const AGENT_LISTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "property" && agent._ref == $agentId] | order(createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    status,
    bedrooms,
    bathrooms,
    "image": images[0] { ${imageFragment} },
    createdAt
  }
`);

// Agent's leads
export const AGENT_LEADS_QUERY = defineQuery(/* groq */ `
  *[_type == "lead" && agent._ref == $agentId] | order(createdAt desc) {
    _id,
    buyerName,
    buyerEmail,
    buyerPhone,
    status,
    createdAt,
    property-> {
      _id,
      title,
      "slug": slug.current
    }
  }
`);

// User profile
export const USER_PROFILE_QUERY = defineQuery(/* groq */ `
  *[_type == "user" && clerkId == $clerkId][0] {
    _id,
    name,
    email,
    phone,
    photo { ${imageFragment} },
    createdAt
  }
`);

// Check if user exists (for onboarding detection)
export const USER_EXISTS_QUERY = defineQuery(/* groq */ `
  *[_type == "user" && clerkId == $clerkId][0]{ _id }
`);

// Agent profile
export const AGENT_PROFILE_QUERY = defineQuery(/* groq */ `
  *[_type == "agent" && userId == $userId][0] {
    _id,
    name,
    email,
    phone,
    photo { ${imageFragment} },
    bio,
    licenseNumber,
    agency,
    onboardingComplete
  }
`);

// Get agent by user ID
export const AGENT_BY_USER_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "agent" && userId == $userId][0] {
    _id,
    userId,
    name,
    email,
    onboardingComplete
  }
`);

// Single listing by ID (for edit page)
export const LISTING_BY_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "property" && _id == $id][0] {
    _id,
    title,
    description,
    price,
    propertyType,
    status,
    bedrooms,
    bathrooms,
    squareFeet,
    yearBuilt,
    address,
    location,
    images[] { ${imageFragment} },
    amenities,
    agent
  }
`);

// User's saved listings
export const USER_SAVED_LISTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "user" && clerkId == $clerkId][0] {
    savedListings[]-> {
      _id,
      title,
      "slug": slug.current,
      price,
      bedrooms,
      bathrooms,
      squareFeet,
      address,
      "image": images[0] { ${imageFragment} },
      status
    }
  }.savedListings
`);
