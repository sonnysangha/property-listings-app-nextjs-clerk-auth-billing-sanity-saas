import {
  ArrowRight,
  Heart,
  Home,
  MapPin,
  Search,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanityFetch } from "@/lib/sanity/live";
import { FEATURED_PROPERTIES_QUERY } from "@/lib/sanity/queries";

export default async function HomePage() {
  const { data: featuredProperties } = await sanityFetch({
    query: FEATURED_PROPERTIES_QUERY,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent via-accent/50 to-background py-24 md:py-32 lg:py-40">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Perfect for First-Time Buyers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-6">
              Find Your <span className="text-primary">Perfect Nest</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Making your first home journey simple and stress-free. Browse
              curated properties, save your favorites, and connect with trusted
              agents.
            </p>

            {/* Search Bar */}
            <form
              action="/properties"
              method="GET"
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
            >
              <div className="flex-1 relative">
                <label htmlFor="city-search" className="sr-only">
                  Search by city, neighborhood, or ZIP code
                </label>
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="city-search"
                  name="city"
                  placeholder="Enter city, neighborhood, or ZIP…"
                  autoComplete="address-level2"
                  className="h-14 pl-12 text-base"
                />
              </div>
              <Button type="submit" size="xl" className="h-14">
                <Search className="h-5 w-5" aria-hidden="true" />
                <span className="ml-2">Search Properties</span>
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-success"
                  aria-hidden="true"
                />
                <span>1,000+ Active Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>500+ Happy Homeowners</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-secondary"
                  aria-hidden="true"
                />
                <span>50+ Trusted Agents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading">
                Featured Properties
              </h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked homes curated just for you
              </p>
            </div>
            <Button variant="outline" asChild className="w-fit">
              <Link href="/properties">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {featuredProperties && featuredProperties.length > 0 ? (
            <PropertyGrid properties={featuredProperties} />
          ) : (
            <div className="text-center py-16 bg-accent/50 rounded-2xl border border-border/50">
              <Home
                className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-muted-foreground text-lg">
                No featured properties available at the moment.
              </p>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/properties">Browse All Properties</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-accent/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              How Nestwell Works
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Finding your first home has never been easier. Follow these simple
              steps to start your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-warm transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-warm-md group-hover:border-primary/40">
                <Search className="h-9 w-9 text-primary" aria-hidden="true" />
              </div>
              <div
                className="absolute top-10 left-[60%] right-0 h-px bg-border hidden md:block"
                aria-hidden="true"
              />
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                Step 1
              </span>
              <h3 className="text-xl font-semibold font-heading mb-3">
                Search Properties
              </h3>
              <p className="text-muted-foreground">
                Browse our curated catalog with advanced filters, map view, and
                neighborhood insights.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 bg-background border-2 border-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-warm transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-warm-md group-hover:border-secondary/40">
                <Heart className="h-9 w-9 text-secondary" aria-hidden="true" />
              </div>
              <div
                className="absolute top-10 left-[60%] right-0 h-px bg-border hidden md:block"
                aria-hidden="true"
              />
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium mb-3">
                Step 2
              </span>
              <h3 className="text-xl font-semibold font-heading mb-3">
                Save Favorites
              </h3>
              <p className="text-muted-foreground">
                Save properties you love and compare them side by side to find
                your perfect match.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="w-20 h-20 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-warm transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-warm-md group-hover:border-primary/40">
                <Users className="h-9 w-9 text-primary" aria-hidden="true" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                Step 3
              </span>
              <h3 className="text-xl font-semibold font-heading mb-3">
                Connect with Agents
              </h3>
              <p className="text-muted-foreground">
                Reach out to trusted agents, schedule viewings, and get expert
                guidance throughout your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium mb-4">
                Why Choose Nestwell
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Built for First-Time Homebuyers
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We understand that buying your first home can be overwhelming.
                That&apos;s why we&apos;ve designed Nestwell to make the process
                as simple and stress-free as possible.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold font-heading mb-1">
                      Verified Listings
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Every property is verified by our team to ensure accuracy
                      and quality.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Users
                      className="h-6 w-6 text-secondary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold font-heading mb-1">
                      Trusted Agents
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Connect with experienced agents who specialize in helping
                      first-time buyers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold font-heading mb-1">
                      Personalized Experience
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Save favorites, get recommendations, and track your home
                      search journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-primary-foreground">
              <h3 className="text-2xl md:text-3xl font-bold font-heading mb-8">
                Trusted by Thousands
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl md:text-5xl font-bold tabular-nums mb-2">
                    500+
                  </div>
                  <p className="text-primary-foreground/80">Happy Homeowners</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold tabular-nums mb-2">
                    1,000+
                  </div>
                  <p className="text-primary-foreground/80">Active Listings</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold tabular-nums mb-2">
                    50+
                  </div>
                  <p className="text-primary-foreground/80">Trusted Agents</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold tabular-nums mb-2">
                    4.9
                  </div>
                  <p className="text-primary-foreground/80">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Become an Agent */}
      <section className="py-20 md:py-28 bg-accent/30">
        <div className="container">
          <div className="bg-gradient-to-r from-secondary/90 to-secondary rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-secondary-foreground">
                Are You a Real Estate Agent?
              </h2>
              <p className="text-lg text-secondary-foreground/80 mb-8">
                Join our platform to list properties, connect with motivated
                buyers, and grow your business. Get started with our agent
                subscription today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/pricing">
                    View Pricing Plans
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-background/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-background/20"
                >
                  <Link href="/dashboard">Go to Agent Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
