# Sanity Seed Data

This folder contains seed data and scripts to populate your Sanity database with sample data for development and testing.

## Contents

- **6 Agents** - Real estate agents with bios, agencies, and profile photos
- **25 Properties** - Listings across 10 cities with images, amenities, and locations
- **8 Users** - Sample users with saved listings
- **15 Leads** - Buyer inquiries in various statuses

## Prerequisites

Before running the seed script, ensure you have:

1. **Environment variables** set in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_write_token
   ```

2. **Sanity project** created and schema deployed

## Usage

### Seed the database

```bash
pnpm seed
```

This will:
1. Download images from Unsplash and upload to Sanity Assets
2. Create agents with profile photos
3. Create properties with images and agent references
4. Create users with saved listing references
5. Create leads with property and agent references

### Clean and re-seed

To delete all existing seed data and start fresh:

```bash
pnpm seed:clean
```

## Identifying Seed Data

All seed data uses IDs prefixed with `seed_`:
- Agents: `seed_agent_1`, `seed_agent_2`, etc.
- Properties: `seed_property_1`, `seed_property_2`, etc.
- Users: `seed_user_1`, `seed_user_2`, etc.
- Leads: `seed_lead_1`, `seed_lead_2`, etc.

This makes it easy to identify and clean up test data.

## Data Overview

### Agents (6)
| Name | Agency | Location |
|------|--------|----------|
| Sarah Mitchell | RE/MAX Premier | San Francisco |
| Michael Chen | Coldwell Banker | Los Angeles |
| Jennifer Rodriguez | Keller Williams | Austin |
| David Thompson | Century 21 | Miami |
| Emily Watson | Compass | Seattle |
| Robert Martinez | Martinez Real Estate | Denver |

### Properties by City
- San Francisco: 3 properties
- Los Angeles: 3 properties
- Seattle: 3 properties
- Austin: 3 properties
- Miami: 3 properties
- Denver: 2 properties
- Portland: 2 properties
- Chicago: 2 properties
- Boston: 2 properties
- Phoenix: 2 properties

### Property Status Mix
- Active: 20
- Pending: 3
- Sold: 2
- Featured: 6

### Lead Status Mix
- New: 8
- Contacted: 4
- Closed: 3

## Images

Property and agent images are sourced from Unsplash and uploaded to Sanity Assets during the seed process. The images include:

- House exteriors (modern, traditional, craftsman, etc.)
- Interior shots (living rooms, kitchens, bedrooms)
- Professional headshots for agents

## Troubleshooting

**Error: SANITY_API_TOKEN is required**
- Ensure your `.env.local` file contains a valid Sanity API token with write permissions

**Error: Failed to download image**
- This may occur if Unsplash is rate-limiting requests
- Wait a few minutes and try again

**Error: Document already exists**
- Run `pnpm seed:clean` to remove existing seed data first
