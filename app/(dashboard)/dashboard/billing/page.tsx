"use client";

import { UserProfile } from "@clerk/nextjs";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground mt-1">
          Upgrade to Agent to list properties and connect with buyers
        </p>
      </div>

      {/* Clerk's built-in PricingTable handles everything */}
      <UserProfile routing="hash" />
    </div>
  );
}
