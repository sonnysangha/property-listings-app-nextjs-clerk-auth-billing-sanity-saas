"use client";

import { useUser } from "@clerk/nextjs";
import {
  usePaymentMethods,
  usePlans,
  useStatements,
  useSubscription,
} from "@clerk/nextjs/experimental";
import {
  AlertCircle,
  Calendar,
  Check,
  CreditCard,
  Crown,
  FileText,
  Plus,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Plan features for comparison
const PLAN_FEATURES = {
  free: {
    name: "Free",
    description: "Perfect for getting started",
    listings: 1,
    features: [
      "1 property listing",
      "Basic lead inbox",
      "Standard support",
      "Public agent profile",
    ],
    notIncluded: ["Analytics dashboard", "Priority support", "Featured listings"],
  },
  pro: {
    name: "Pro",
    description: "For growing agents",
    listings: 10,
    features: [
      "10 property listings",
      "Advanced lead inbox",
      "Analytics dashboard",
      "Priority support",
      "Public agent profile",
      "Featured listings",
    ],
    notIncluded: ["Unlimited listings", "White-label branding"],
  },
  agency: {
    name: "Agency",
    description: "For teams and agencies",
    listings: "Unlimited",
    features: [
      "Unlimited property listings",
      "Advanced lead inbox",
      "Full analytics suite",
      "Dedicated support",
      "Public agent profile",
      "Featured listings",
      "White-label branding",
      "Team collaboration",
    ],
    notIncluded: [],
  },
};

function SubscriptionStatus() {
  const { data: subscription, isLoading, error } = useSubscription();
  const { user } = useUser();

  if (isLoading) {
    return (
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-warm border-destructive/50">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load subscription details. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasSubscription = subscription !== null;
  // Get the active subscription item (not the free plan)
  const activeItem = subscription?.subscriptionItems?.find(
    (item) => item.status === "active" && item.plan?.name !== "Free"
  );
  const planName = activeItem?.plan?.name || "Free";
  const status = subscription?.status || "inactive";
  const nextBillingDate = subscription?.nextPayment?.date;

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Current Plan
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold font-heading">{planName}</h3>
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {status}
              </Badge>
            </div>
            {hasSubscription && nextBillingDate && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next billing: {new Date(nextBillingDate).toLocaleDateString()}
              </p>
            )}
            {!hasSubscription && (
              <p className="text-sm text-muted-foreground">
                You&apos;re on the free plan. Upgrade to unlock more features!
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {hasSubscription ? (
              <>
                <Button variant="outline" size="sm">
                  Change Plan
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Upgrade Now
              </Button>
            )}
          </div>
        </div>

        {/* Current plan features */}
        <div className="pt-4 border-t border-border/50">
          <h4 className="text-sm font-medium mb-3">Your plan includes:</h4>
          <div className="grid grid-cols-2 gap-2">
            {(
              PLAN_FEATURES[
                planName.toLowerCase() as keyof typeof PLAN_FEATURES
              ] || PLAN_FEATURES.free
            ).features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlanComparison() {
  const { data: plans, isLoading } = usePlans();
  const { data: subscription } = useSubscription();
  const activeItem = subscription?.subscriptionItems?.find(
    (item) => item.status === "active" && item.plan?.name !== "Free"
  );
  const currentPlan = activeItem?.plan?.name?.toLowerCase() || "free";

  if (isLoading) {
    return (
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-heading">Compare Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="font-heading">Compare Plans</CardTitle>
        <CardDescription>
          Choose the plan that best fits your needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PLAN_FEATURES).map(([key, plan]) => {
            const isCurrentPlan = key === currentPlan;
            const isPro = key === "pro";

            return (
              <div
                key={key}
                className={`relative rounded-2xl border p-6 transition-all ${
                  isCurrentPlan
                    ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                    : isPro
                      ? "border-primary/50"
                      : "border-border/50"
                }`}
              >
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Current Plan
                  </Badge>
                )}
                {isPro && !isCurrentPlan && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold font-heading">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold tabular-nums">
                      {typeof plan.listings === "number"
                        ? plan.listings
                        : "∞"}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {typeof plan.listings === "number" ? "listing" : "listings"}
                      {typeof plan.listings === "number" && plan.listings !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {isCurrentPlan ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={isPro ? "default" : "outline"}
                    >
                      {key === "free" ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentMethods() {
  const { data, isLoading, error } = usePaymentMethods();
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) {
    return (
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const paymentMethods = data || [];

  return (
    <Card className="shadow-warm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-heading flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your payment methods for subscriptions
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 text-destructive text-sm p-4 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            Unable to load payment methods
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-8 px-4 bg-accent/30 rounded-xl">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-medium mb-1">No payment methods</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add a payment method to subscribe to a plan
            </p>
            <Button onClick={() => setIsAdding(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-md flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.cardType
                        ? `${method.cardType.charAt(0).toUpperCase()}${method.cardType.slice(1)}`
                        : "Card"}{" "}
                      •••• {method.last4 || "****"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  {method.isRemovable && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => method.remove()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BillingHistory() {
  const { data, isLoading, error } = useStatements();

  if (isLoading) {
    return (
      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statements = data || [];

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Billing History
        </CardTitle>
        <CardDescription>View and download past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center gap-2 text-destructive text-sm p-4 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            Unable to load billing history
          </div>
        ) : statements.length === 0 ? (
          <div className="text-center py-8 px-4 bg-accent/30 rounded-xl">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-medium mb-1">No billing history</h4>
            <p className="text-sm text-muted-foreground">
              Your invoices will appear here once you subscribe to a plan
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements.map((statement) => (
                <TableRow key={statement.id}>
                  <TableCell>
                    {new Date(statement.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell className="tabular-nums">
                    {statement.totals.grandTotal.currencySymbol}
                    {(statement.totals.grandTotal.amount / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statement.status === "closed" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {statement.status === "closed" ? "Paid" : "Open"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      {/* Current Subscription Status */}
      <SubscriptionStatus />

      {/* Plan Comparison */}
      <PlanComparison />

      {/* Two Column Layout for Payment & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethods />
        <BillingHistory />
      </div>
    </div>
  );
}
