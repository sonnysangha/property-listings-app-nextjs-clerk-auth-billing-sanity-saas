import { PricingTable } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FREE_FEATURES = [
  "Browse all properties",
  "Save favorite listings",
  "Contact agents",
  "Property search with filters",
  "Map view",
];

const AGENT_FEATURES = [
  "Everything in Free",
  "Create unlimited listings",
  "Agent dashboard",
  "Lead inbox",
  "Manage property status",
  "Professional profile",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Become a Real Estate Agent</h1>
        <p className="text-xl text-muted-foreground">
          List properties, connect with buyers, and grow your business with our
          agent subscription.
        </p>
      </div>

      {/* Feature Comparison */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <p className="text-muted-foreground">For home buyers</p>
            <p className="text-3xl font-bold mt-4">$0</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Agent</CardTitle>
            <p className="text-muted-foreground">
              For real estate professionals
            </p>
            <p className="text-3xl font-bold mt-4">
              $29<span className="text-lg font-normal">/month</span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {AGENT_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Clerk Pricing Table */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Choose Your Plan
        </h2>
        <PricingTable />
      </div>
    </div>
  );
}
