import { PricingTable } from "@clerk/nextjs";
import { Check } from "lucide-react";

const AGENT_FEATURES = [
  "Unlimited property listings",
  "Professional agent dashboard",
  "Lead inbox & management",
  "Property status tracking",
  "Public agent profile",
  "Analytics & insights",
  "Priority support",
  "Verified agent badge",
];

export default function PricingPage() {
  return (
    <main className="container py-16">
      {/* Hero Section */}
      <header className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-balance">
          Become a Real Estate Agent
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Upgrade to list properties, connect with buyers, and grow your
          business.
        </p>
      </header>

      {/* Features Grid */}
      <div className="flex justify-center mb-10">
        <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
          {AGENT_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check
                className="h-4 w-4 text-primary shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Clerk Pricing Table */}
      <section className="max-w-md mx-auto" aria-label="Subscribe">
        <PricingTable />
      </section>
    </main>
  );
}
