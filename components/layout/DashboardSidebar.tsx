"use client";

import {
  ArrowLeft,
  CreditCard,
  Home,
  LayoutDashboard,
  ListPlus,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Dashboard summary",
  },
  {
    href: "/dashboard/listings",
    label: "My Listings",
    icon: Home,
    description: "Manage your properties",
  },
  {
    href: "/dashboard/listings/new",
    label: "Add Listing",
    icon: ListPlus,
    description: "Create new listing",
  },
  {
    href: "/dashboard/leads",
    label: "Lead Inbox",
    icon: MessageSquare,
    description: "Buyer inquiries",
  },
  {
    href: "/dashboard/profile",
    label: "Agent Profile",
    icon: User,
    description: "Your public profile",
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    description: "Manage subscription",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-border/50 bg-sidebar min-h-screen sticky top-0">
      <div className="p-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Back to Nestwell</span>
        </Link>

        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold font-heading">Agent Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your listings and leads
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-[background-color,color,transform] duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-warm"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats (Optional) */}
        <div className="mt-10 pt-6 border-t border-sidebar-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Quick Stats
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Listings</span>
              <span className="text-sm font-semibold tabular-nums">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New Leads</span>
              <span className="text-sm font-semibold tabular-nums">—</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
