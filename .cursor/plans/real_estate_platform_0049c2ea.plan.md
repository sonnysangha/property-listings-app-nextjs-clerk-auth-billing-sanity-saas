---
name: Real Estate Platform
overview: Build a full-featured real estate listing platform with Next.js 16, Sanity v3 (embedded studio), Clerk authentication/billing, and Mapbox maps. The platform supports free users browsing properties, paid agent subscriptions for listing management, and admin control via Sanity Studio.
todos:
  - id: phase-1-setup
    content: "Phase 1: Install dependencies (Clerk, Sanity, Mapbox, Shadcn) and create project structure"
    status: completed
  - id: phase-2-sanity
    content: "Phase 2: Set up Sanity with embedded studio and create all schemas (property, agent, lead, user)"
    status: completed
  - id: phase-3-clerk
    content: "Phase 3: Add route protection to proxy.ts and configure Clerk Billing (basic auth already complete)"
    status: completed
  - id: phase-4-mapbox
    content: "Phase 4: Set up Mapbox with MapView component and property markers"
    status: completed
  - id: phase-5-pages
    content: "Phase 5: Build core pages (homepage, property search with filters, property detail, agent pages)"
    status: completed
  - id: phase-6-user
    content: "Phase 6: Implement user features (onboarding flow, profile editing, saved listings page, contact agent)"
    status: completed
  - id: phase-7-dashboard
    content: "Phase 7: Build agent dashboard (agent onboarding, full listings CRUD with status updates, leads inbox, agent profile)"
    status: completed
  - id: phase-8-billing
    content: "Phase 8: Implement agent subscription flow with Clerk Billing (native, no webhooks)"
    status: completed
isProject: false
---

# Real Estate Platform (Zillow Clone) Implementation Plan

## Current State

Fresh Next.js 16 project with:

- React 19, TypeScript, Tailwind CSS 4
- Biome for linting/formatting
- Path alias `@/*` configured

---

## Phase 1: Foundation Setup

### 1.1 Install Core Dependencies

```bash
# Sanity CMS
pnpm add sanity @sanity/client @sanity/image-url next-sanity

# Mapbox for maps
pnpm add react-map-gl mapbox-gl
pnpm add -D @types/mapbox-gl

# Note: No svix/webhooks needed - Clerk Billing manages subscription state natively

# UI utilities (for Shadcn)
pnpm add lucide-react class-variance-authority clsx tailwind-merge
```

Note: `@clerk/nextjs` is already installed.

### 1.2 Initialize Shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

Install required components: Button, Card, Input, Select, Dialog, Sheet, Tabs, Table, Avatar, Badge, Form, Dropdown Menu, Separator, Skeleton, Toast

### 1.3 Project Structure

```
├── app/
│   ├── (main)/                    # Main site layout group
│   │   ├── layout.tsx             # Navbar + Footer
│   │   ├── page.tsx               # Homepage
│   │   ├── properties/
│   │   │   ├── page.tsx           # Search/browse
│   │   │   └── [slug]/page.tsx    # Property detail (includes agent info)
│   │   ├── pricing/page.tsx       # Subscription plans
│   │   ├── onboarding/page.tsx    # User onboarding (first-time sign up)
│   │   ├── saved/page.tsx         # User's saved/liked listings
│   │   ├── profile/page.tsx       # User profile editing (shared for all users)
│   │   └── sign-in/[[...sign-in]]/page.tsx
│   ├── (dashboard)/               # Agent dashboard layout group
│   │   ├── layout.tsx             # Dashboard sidebar + agent onboarding check
│   │   └── dashboard/
│   │       ├── page.tsx           # Dashboard home (overview)
│   │       ├── onboarding/page.tsx # Agent onboarding (first-time after subscription)
│   │       ├── listings/
│   │       │   ├── page.tsx       # My listings (with status badges)
│   │       │   ├── new/page.tsx   # Create new listing
│   │       │   └── [id]/page.tsx  # Edit listing (includes status update)
│   │       ├── leads/page.tsx     # Leads inbox
│   │       └── profile/page.tsx   # Agent-specific profile (bio, license, agency)
│   ├── studio/[[...tool]]/page.tsx # Sanity Studio
│   ├── api/                         # API routes (if needed)
│   └── layout.tsx                  # Root layout with ClerkProvider
├── components/
│   ├── ui/                         # Shadcn components
│   ├── layout/                     # Navbar, Footer, Sidebar
│   ├── property/                   # PropertyCard, PropertyGrid, etc.
│   ├── map/                        # MapView, PropertyMarker
│   └── forms/                      # PropertyForm, LeadForm, etc.
├── lib/
│   ├── sanity/
│   │   ├── client.ts              # Sanity client config
│   │   ├── queries.ts             # GROQ queries
│   │   └── image.ts               # Image URL builder
│   └── utils.ts                   # Utility functions
├── actions/                        # Server Actions
│   ├── properties.ts              # CRUD for properties
│   ├── leads.ts                   # Lead creation
│   └── users.ts                   # User/agent management
├── sanity/
│   ├── sanity.config.ts           # Studio config
│   ├── schema.ts                  # Schema index
│   └── schemas/
│       ├── property.ts
│       ├── agent.ts
│       ├── lead.ts
│       └── user.ts
├── proxy.ts                        # Clerk middleware with route protection
└── types/
    └── index.ts                    # TypeScript types
```

---

## Phase 2: Sanity Setup (Embedded Studio)

### 2.1 Sanity Configuration

Create `sanity.config.ts` at project root for embedded studio at `/studio`:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './sanity/schema'

export default defineConfig({
  name: 'zillow-clone',
  title: 'Real Estate Platform',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [structureTool()],
  schema,
})
```

### 2.2 Sanity Schemas

**Property Schema** (`sanity/schemas/property.ts`):

- Core fields: title, slug, description, price, propertyType, status
- Details: bedrooms, bathrooms, squareFeet, yearBuilt
- Location: address (object), location (geopoint)
- Media: images (array with hotspot)
- Relations: agent (reference), amenities (array)
- Meta: featured, createdAt, updatedAt

**Agent Schema** (`sanity/schemas/agent.ts`):

- userId (Clerk ID, required, unique)
- name (string, required)
- email (string, required)
- phone (string)
- photo (image with hotspot)
- bio (text)
- licenseNumber (string)
- agency (string, optional)
- onboardingComplete (boolean, default: false)
- createdAt (datetime)

**Lead Schema** (`sanity/schemas/lead.ts`):

- property (reference to property, required)
- agent (reference to agent, required)
- buyerName (string, required)
- buyerEmail (string, required)
- buyerPhone (string)
- status (string: 'new' | 'contacted' | 'closed', default: 'new')
- createdAt (datetime)

**User Schema** (`sanity/schemas/user.ts`):

- clerkId (string, required, unique)
- name (string, required)
- email (string, required)
- phone (string)
- photo (image with hotspot)
- savedListings (array of references to property)
- createdAt (datetime)

### 2.3 Sanity Client & Live Content Setup

**Create `lib/sanity/client.ts`:**

```typescript
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // For mutations
})
```

**Create `lib/sanity/live.ts` (Live Content API):**

```typescript
import { defineLive } from 'next-sanity'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: 'v2025-01-01' }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})
```

**Update Root Layout to include `<SanityLive />`:**

```typescript
// app/layout.tsx
import { SanityLive } from '@/lib/sanity/live'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### 2.4 GROQ Queries with `defineQuery` & TypeGen

All queries must use `defineQuery` for type generation:

**Create `lib/sanity/queries.ts`:**

```typescript
import { defineQuery } from 'next-sanity'

// Image fragment for reuse
const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  alt
`

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
`)

// Property search with filters
export const PROPERTIES_SEARCH_QUERY = defineQuery(/* groq */ `
  *[_type == "property" && status == "active"
    && price >= $minPrice && price <= $maxPrice
    && bedrooms >= $beds && bathrooms >= $baths
    && ($type == "" || propertyType == $type)
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
`)

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
`)

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
`)

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
`)

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
`)

// Check if user exists (for onboarding detection)
export const USER_EXISTS_QUERY = defineQuery(/* groq */ `
  *[_type == "user" && clerkId == $clerkId][0]{ _id }
`)

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
`)

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
`)
```

### 2.5 TypeGen Configuration

**Create `sanity-typegen.json`:**

```json
{
  "path": "./src/**/*.{ts,tsx,js,jsx}",
  "schema": "./schema.json",
  "generates": "./src/sanity/types.ts"
}
```

**Add scripts to `package.json`:**

```json
{
  "scripts": {
    "typegen": "sanity schema extract --path=./schema.json && sanity typegen generate",
    "update-types": "pnpm run typegen"
  }
}
```

**Workflow:** After modifying schemas or queries, run `pnpm run update-types` to regenerate TypeScript types.

---

## Phase 3: Clerk Authentication Setup (Already Configured)

Clerk is already set up with:

- `@clerk/nextjs` v6.36.10 installed
- `ClerkProvider` wrapping the app in `layout.tsx`
- Basic auth UI components in header

### 3.1 Route Protection via `proxy.ts`

Update `proxy.ts` to protect dashboard routes at the middleware level using `clerkMiddleware` with route matchers and plan checks:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isAgentRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, has } = await auth()

  // Protect dashboard routes - require authentication
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Agent routes require active subscription
  if (isAgentRoute(req) && userId) {
    const hasAgentPlan = has({ plan: 'agent' })
    if (!hasAgentPlan) {
      return NextResponse.redirect(new URL('/pricing', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### 3.2 Clerk Billing SDK Integration

**Pricing Page** (`app/(main)/pricing/page.tsx`):

Use Clerk's built-in `<PricingTable>` component:

```typescript
import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <PricingTable />
    </div>
  )
}
```

**Protecting Content with Plan Checks**:

Use `<Protect>` component for UI-level protection:

```typescript
import { Protect } from '@clerk/nextjs'

export function AgentFeature() {
  return (
    <Protect
      plan="agent"
      fallback={<p>Upgrade to Agent plan to access this feature.</p>}
    >
      <AgentDashboardContent />
    </Protect>
  )
}
```

Use `has()` for server-side plan checks:

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const { has } = await auth()
  const isAgent = has({ plan: 'agent' })
  
  if (!isAgent) {
    redirect('/pricing')
  }
  
  // Render agent dashboard
}
```

### 3.3 Clerk Dashboard Configuration

1. Go to Clerk Dashboard > Billing
2. Create "Agent" plan with monthly subscription ($29/month)
3. Configure billing portal for subscription management
4. Set up webhook endpoint for subscription events

### 3.4 Webhook Handler

Create `app/api/webhooks/clerk/route.ts`:

```typescript
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { client } from '@/lib/sanity/client'

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  const evt = wh.verify(body, {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  }) as WebhookEvent

  if (evt.type === 'user.subscription.created') {
    // Create agent document in Sanity
    const { user_id, plan } = evt.data
    if (plan === 'agent') {
      await client.create({
        _type: 'agent',
        userId: user_id,
        // ... other fields from user data
      })
    }
  }

  if (evt.type === 'user.subscription.deleted') {
    // Mark agent as inactive in Sanity
  }

  return new Response('OK', { status: 200 })
}
```

---

## Phase 4: Mapbox Setup

### 4.1 Account Setup

1. Create account at [mapbox.com](https://www.mapbox.com)
2. Generate access token from Account Dashboard
3. Add to `.env.local`: `NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx`

### 4.2 Map Component

Create `components/map/MapView.tsx` using react-map-gl:

```typescript
'use client'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export function MapView({ properties, onPropertyClick }) {
  // Interactive map with property markers
}
```

---

## Phase 5: Core Pages Implementation

### 5.1 Homepage (`app/(main)/page.tsx`)

- Hero section with search bar (redirects to /properties with query)
- Featured listings grid using `sanityFetch`:

```typescript
import { sanityFetch } from '@/lib/sanity/live'
import { FEATURED_PROPERTIES_QUERY } from '@/lib/sanity/queries'

export default async function HomePage() {
  const { data: featuredProperties } = await sanityFetch({
    query: FEATURED_PROPERTIES_QUERY,
  })
  
  return (
    <>
      <Hero />
      <FeaturedListings properties={featuredProperties} />
      <HowItWorks />
      <BecomeAgentCTA />
    </>
  )
}
```

- "How it works" section
- CTA to become an agent

### 5.2 Property Search (`app/(main)/properties/page.tsx`)

- Filter sidebar: location, price range, beds, baths, property type
- URL-based filter state for shareable searches
- Toggle between map view and list view
- Pagination with `searchParams`

```typescript
import { sanityFetch } from '@/lib/sanity/live'
import { PROPERTIES_SEARCH_QUERY } from '@/lib/sanity/queries'

export default async function PropertiesPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  const params = await searchParams
  const { data: properties } = await sanityFetch({
    query: PROPERTIES_SEARCH_QUERY,
    params: {
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 10000000,
      beds: params.beds || 0,
      baths: params.baths || 0,
      type: params.type || '',
      start: (params.page - 1) * 12,
      end: params.page * 12,
    },
  })

  return (
    <div className="flex">
      <FilterSidebar />
      <div className="flex-1">
        <ViewToggle />
        <PropertyGrid properties={properties} />
        <MapView properties={properties} />
      </div>
    </div>
  )
}
```

### 5.3 Property Detail (`app/(main)/properties/[slug]/page.tsx`)

- Image gallery with lightbox (use Dialog component)
- Property details: price, beds/baths, sqft, year built
- Description and amenities
- Map showing location
- Agent card with photo, bio, contact info (from property's agent reference)
- "Contact Agent" button (one-click lead creation)
- Save/favorite button (requires login)

```typescript
import { sanityFetch } from '@/lib/sanity/live'
import { PROPERTY_DETAIL_QUERY } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'

export default async function PropertyPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const { data: property } = await sanityFetch({
    query: PROPERTY_DETAIL_QUERY,
    params: { slug },
  })

  if (!property) notFound()

  return (
    <div>
      <ImageGallery images={property.images} />
      <PropertyDetails property={property} />
      <AmenitiesList amenities={property.amenities} />
      <PropertyMap location={property.location} />
      
      {/* Agent info from property.agent reference */}
      <AgentCard agent={property.agent} propertyId={property._id} />
    </div>
  )
}
```

The `AgentCard` component displays the agent's photo, name, bio, and agency, with a "Contact Agent" button that creates a lead.

---

## Phase 6: User Features

### 6.1 User Onboarding Flow (`app/(main)/onboarding/page.tsx`)

**Trigger:** After first Clerk sign-up, check if user doc exists in Sanity. If not, redirect to onboarding.

**Detection logic in middleware or layout:**

```typescript
// In proxy.ts or a server component
const { userId } = await auth()
if (userId) {
  const user = await client.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]`,
    { clerkId: userId }
  )
  if (!user && !req.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }
}
```

**Onboarding form captures:**

- Full name
- Phone number
- Profile photo (optional)

**On submit:**

```typescript
'use server'
export async function completeUserOnboarding(data: UserOnboardingData) {
  const { userId } = await auth()
  
  // Create user document in Sanity
  await client.create({
    _type: 'user',
    clerkId: userId,
    name: data.name,
    email: data.email, // from Clerk
    phone: data.phone,
    photo: data.photo,
    savedListings: [],
    createdAt: new Date().toISOString(),
  })
  
  redirect('/')
}
```

### 6.2 User Profile Editing (`app/(main)/profile/page.tsx`)

**Shared profile for all users (regular users AND agents):**

- Edit name, phone, profile photo
- View email (from Clerk, read-only)
- Link to billing portal (if agent)

```typescript
export default async function ProfilePage() {
  const { userId } = await auth()
  const { data: user } = await sanityFetch({
    query: USER_PROFILE_QUERY,
    params: { clerkId: userId },
  })

  return (
    <div>
      <h1>My Profile</h1>
      <ProfileForm user={user} />
      
      {/* Show agent-specific link if applicable */}
      <Protect plan="agent">
        <Link href="/dashboard/profile">Manage Agent Profile</Link>
      </Protect>
    </div>
  )
}
```

**Server action for profile updates:**

```typescript
'use server'
export async function updateUserProfile(data: UserProfileData) {
  const { userId } = await auth()
  
  await client
    .patch({ query: `*[_type == "user" && clerkId == $clerkId][0]`, params: { clerkId: userId } })
    .set({
      name: data.name,
      phone: data.phone,
      photo: data.photo,
    })
    .commit()
  
  revalidatePath('/profile')
}
```

### 6.3 Saved Listings (`app/(main)/saved/page.tsx`)

**Display user's saved/liked properties:**

```typescript
export default async function SavedListingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: savedProperties } = await sanityFetch({
    query: USER_SAVED_LISTINGS_QUERY,
    params: { clerkId: userId },
  })

  return (
    <div>
      <h1>Saved Listings</h1>
      {savedProperties.length === 0 ? (
        <EmptyState message="No saved listings yet" />
      ) : (
        <PropertyGrid properties={savedProperties} showRemoveButton />
      )}
    </div>
  )
}
```

**GROQ Query for saved listings:**

```typescript
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
`)
```

**Server action to toggle saved listing:**

```typescript
'use server'
export async function toggleSavedListing(propertyId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  const user = await client.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]{ _id, "savedIds": savedListings[]._ref }`,
    { clerkId: userId }
  )

  const isSaved = user.savedIds?.includes(propertyId)

  if (isSaved) {
    // Remove from saved
    await client
      .patch(user._id)
      .unset([`savedListings[_ref == "${propertyId}"]`])
      .commit()
  } else {
    // Add to saved
    await client
      .patch(user._id)
      .append('savedListings', [{ _type: 'reference', _ref: propertyId }])
      .commit()
  }

  revalidatePath('/saved')
  revalidatePath(`/properties/[slug]`)
}
```

### 6.4 Contact Agent (One-Click Lead)

Server action creates lead document using logged-in user's info:

```typescript
'use server'
export async function createLead(propertyId: string, agentId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  // Get user info from Sanity
  const user = await client.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]{ name, email, phone }`,
    { clerkId: userId }
  )

  // Create lead document
  await client.create({
    _type: 'lead',
    property: { _type: 'reference', _ref: propertyId },
    agent: { _type: 'reference', _ref: agentId },
    buyerName: user.name,
    buyerEmail: user.email,
    buyerPhone: user.phone,
    status: 'new',
    createdAt: new Date().toISOString(),
  })

  return { success: true }
}
```

---

## Phase 7: Agent Dashboard

### 7.1 Dashboard Layout

Sidebar navigation with: Overview, Listings, Leads, Profile

**Agent onboarding check in layout:**

```typescript
// app/(dashboard)/layout.tsx
export default async function DashboardLayout({ children }) {
  const { userId } = await auth()
  
  // Check if agent has completed onboarding
  const agent = await client.fetch(
    `*[_type == "agent" && userId == $userId][0]{ _id, onboardingComplete }`,
    { userId }
  )
  
  // Redirect to agent onboarding if not complete
  if (!agent?.onboardingComplete) {
    redirect('/dashboard/onboarding')
  }

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

### 7.2 Agent Onboarding Flow (`app/(dashboard)/dashboard/onboarding/page.tsx`)

**Trigger:** First time an agent accesses the dashboard after subscribing.

**Form captures agent-specific details:**

- Professional bio
- Profile photo
- License number
- Agency name (optional)
- Contact phone

```typescript
'use server'
export async function completeAgentOnboarding(data: AgentOnboardingData) {
  const { userId } = await auth()
  
  // Update the agent document created by webhook
  await client
    .patch({ query: `*[_type == "agent" && userId == $userId][0]`, params: { userId } })
    .set({
      bio: data.bio,
      photo: data.photo,
      licenseNumber: data.licenseNumber,
      agency: data.agency,
      phone: data.phone,
      onboardingComplete: true,
    })
    .commit()
  
  redirect('/dashboard')
}
```

### 7.3 Listings Management (Full CRUD)

**7.3.1 Listings List (`app/(dashboard)/dashboard/listings/page.tsx`)**

Table of agent's properties with:

- Property image thumbnail
- Title
- Price
- Status badge (Active/Pending/Sold)
- Date created
- Actions: Edit, Update Status, Delete

```typescript
export default async function ListingsPage() {
  const { userId } = await auth()
  const agent = await getAgentByUserId(userId)
  
  const { data: listings } = await sanityFetch({
    query: AGENT_LISTINGS_QUERY,
    params: { agentId: agent._id },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>My Listings</h1>
        <Link href="/dashboard/listings/new">
          <Button>Add New Listing</Button>
        </Link>
      </div>
      <ListingsTable listings={listings} />
    </div>
  )
}
```

**7.3.2 Create Listing (`app/(dashboard)/dashboard/listings/new/page.tsx`)**

Full property form with:

- Title, description
- Price
- Property type (house, apartment, condo, townhouse, land)
- Status (default: active)
- Bedrooms, bathrooms, square feet, year built
- Address fields (street, city, state, zip)
- Location picker (geopoint for map)
- Image upload (multiple, with drag-and-drop)
- Amenities (multi-select: pool, garage, gym, etc.)

```typescript
'use server'
export async function createListing(data: ListingFormData) {
  const { userId } = await auth()
  const agent = await getAgentByUserId(userId)
  
  const listing = await client.create({
    _type: 'property',
    title: data.title,
    slug: { _type: 'slug', current: slugify(data.title) },
    description: data.description,
    price: data.price,
    propertyType: data.propertyType,
    status: 'active',
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    squareFeet: data.squareFeet,
    yearBuilt: data.yearBuilt,
    address: data.address,
    location: data.location,
    images: data.images,
    amenities: data.amenities,
    agent: { _type: 'reference', _ref: agent._id },
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  
  redirect(`/dashboard/listings/${listing._id}`)
}
```

**7.3.3 Edit Listing (`app/(dashboard)/dashboard/listings/[id]/page.tsx`)**

Pre-populated form with all property fields + status dropdown:

```typescript
export default async function EditListingPage({ params }) {
  const { id } = await params
  const { userId } = await auth()
  
  const { data: listing } = await sanityFetch({
    query: LISTING_BY_ID_QUERY,
    params: { id },
  })
  
  // Verify ownership
  const agent = await getAgentByUserId(userId)
  if (listing.agent._ref !== agent._id) {
    notFound()
  }

  return (
    <div>
      <h1>Edit Listing</h1>
      <ListingForm listing={listing} mode="edit" />
    </div>
  )
}
```

**7.3.4 Update Listing Status**

Quick action to change status without full edit:

```typescript
'use server'
export async function updateListingStatus(
  listingId: string, 
  status: 'active' | 'pending' | 'sold'
) {
  const { userId } = await auth()
  const agent = await getAgentByUserId(userId)
  
  // Verify ownership
  const listing = await client.fetch(
    `*[_type == "property" && _id == $id][0]{ agent }`,
    { id: listingId }
  )
  if (listing.agent._ref !== agent._id) {
    throw new Error('Unauthorized')
  }
  
  await client
    .patch(listingId)
    .set({ status, updatedAt: new Date().toISOString() })
    .commit()
  
  revalidatePath('/dashboard/listings')
}
```

**7.3.5 Delete Listing**

Soft delete or archive:

```typescript
'use server'
export async function deleteListing(listingId: string) {
  const { userId } = await auth()
  const agent = await getAgentByUserId(userId)
  
  // Verify ownership
  const listing = await client.fetch(
    `*[_type == "property" && _id == $id][0]{ agent }`,
    { id: listingId }
  )
  if (listing.agent._ref !== agent._id) {
    throw new Error('Unauthorized')
  }
  
  // Option 1: Hard delete
  await client.delete(listingId)
  
  // Option 2: Soft delete (set status to 'archived')
  // await client.patch(listingId).set({ status: 'archived' }).commit()
  
  revalidatePath('/dashboard/listings')
}
```

### 7.4 Leads Inbox (`app/(dashboard)/dashboard/leads/page.tsx`)

Table showing:

- Property title (linked)
- Buyer name, email, phone
- Date submitted
- Status badge (New/Contacted/Closed)
- Action dropdown to update status

```typescript
'use server'
export async function updateLeadStatus(
  leadId: string, 
  status: 'new' | 'contacted' | 'closed'
) {
  const { userId } = await auth()
  const agent = await getAgentByUserId(userId)
  
  // Verify ownership
  const lead = await client.fetch(
    `*[_type == "lead" && _id == $id][0]{ agent }`,
    { id: leadId }
  )
  if (lead.agent._ref !== agent._id) {
    throw new Error('Unauthorized')
  }
  
  await client.patch(leadId).set({ status }).commit()
  revalidatePath('/dashboard/leads')
}
```

### 7.5 Agent Profile (`app/(dashboard)/dashboard/profile/page.tsx`)

Edit agent-specific fields (separate from base user profile):

- Professional bio
- Profile photo
- License number
- Agency name
- Contact phone

```typescript
'use server'
export async function updateAgentProfile(data: AgentProfileData) {
  const { userId } = await auth()
  
  await client
    .patch({ query: `*[_type == "agent" && userId == $userId][0]`, params: { userId } })
    .set({
      bio: data.bio,
      photo: data.photo,
      licenseNumber: data.licenseNumber,
      agency: data.agency,
      phone: data.phone,
    })
    .commit()
  
  revalidatePath('/dashboard/profile')
}

---

## Phase 8: Agent Subscription Flow

### 8.1 Pricing Page (`app/(main)/pricing/page.tsx`)

Use Clerk's `<PricingTable>` component which automatically:

- Displays configured plans from Clerk Dashboard
- Handles checkout flow
- Manages subscription state

```typescript
import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Become a Real Estate Agent
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        List properties and connect with buyers
      </p>
      <PricingTable />
    </div>
  )
}
```

### 8.2 Subscription Flow

1. User visits `/pricing` and sees `<PricingTable>`
2. User clicks "Subscribe" on Agent plan
3. Clerk handles checkout (Stripe for payment processing only)
4. On success, Clerk updates user's subscription status internally
5. User accesses `/dashboard` → layout checks plan via `has({ plan: 'agent' })`
6. If first access, `getOrCreateAgent()` creates agent doc in Sanity (lazy creation)
7. User redirected to `/dashboard/onboarding` to complete agent profile
8. Agent fills in: bio, photo, license number, contact details

**No webhooks needed** - Clerk Billing is the source of truth for subscription status. Agent doc is created lazily on first dashboard access.

### 8.3 Plan-Based Access Control

**In Components** - Use `<Protect>`:

```typescript
<Protect plan="agent" fallback={<UpgradePrompt />}>
  <AgentOnlyContent />
</Protect>
```

**In Server Components** - Use `has()`:

```typescript
const { has } = await auth()
const isAgent = has({ plan: 'agent' })
```

**In Middleware** - Already configured in `proxy.ts` to redirect non-agents from `/dashboard/*`

---

## Phase 9: Environment Variables

```env
# Clerk (no webhook secret needed - Clerk Billing manages subscriptions natively)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx                    # For mutations (write)
SANITY_API_READ_TOKEN=xxx               # For Live Content API (read)

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
```

---

## Key Architecture Decisions

1. **Route Groups**: `(main)` for public pages, `(dashboard)` for agent dashboard - separate layouts
2. **Live Content API**: Use `defineLive` from `next-sanity` for real-time updates with `<SanityLive />` in root layout
3. **Type-Safe Queries**: All GROQ queries wrapped in `defineQuery()`, types generated via `sanity typegen`
4. **Server Actions**: All mutations via server actions in `/actions`
5. **GROQ Queries**: Centralized in `lib/sanity/queries.ts` with reusable fragments
6. **Image Handling**: Sanity's built-in image pipeline with hotspot support
7. **State Management**: URL state for filters, React state for UI
8. **Route Protection**: Middleware-based via `proxy.ts` using Clerk's `has({ plan })` for billing checks

---

## Data Flow Diagram

```mermaid
flowchart TB
    subgraph client [Client]
        Browser[Browser]
    end
    
    subgraph nextjs [Next.js App]
        Pages[Server Components]
        Actions[Server Actions]
        Studio[Sanity Studio]
    end
    
    subgraph external [External Services]
        Sanity[(Sanity Content Lake)]
        Clerk[Clerk Auth]
        Mapbox[Mapbox API]
    end
    
    Browser --> Pages
    Pages --> Sanity
    Pages --> Clerk
    Browser --> Mapbox
    Actions --> Sanity
    Actions --> Clerk
    Studio --> Sanity
    Clerk -->|Plan checks via has()| Pages
```



