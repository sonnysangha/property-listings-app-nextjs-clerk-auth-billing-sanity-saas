"use client";

import { Home, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thanks for subscribing!");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <footer className="border-t border-border/50 bg-accent/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 w-fit transition-opacity duration-200 hover:opacity-80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home
                  className="h-5 w-5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight">
                Nestwell
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Making your first home journey simple and stress-free. Find your
              perfect nest with trusted agents and curated listings.
            </p>

            {/* Newsletter */}
            <div className="max-w-sm">
              <h3 className="font-semibold font-heading mb-3">Stay Updated</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email…"
                    autoComplete="email"
                    required
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-4"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="sr-only">Subscribing…</span>
                    </span>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">
                        Subscribe
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Browse Column */}
          <nav aria-label="Browse properties">
            <h3 className="font-semibold font-heading mb-4">Browse</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/properties"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  All Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=house"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Houses
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=apartment"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=condo"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Condos
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=townhouse"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Townhouses
                </Link>
              </li>
            </ul>
          </nav>

          {/* For Agents Column */}
          <nav aria-label="Agent resources">
            <h3 className="font-semibold font-heading mb-4">For Agents</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Become an Agent
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Agent Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/listings"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Manage Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/leads"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Lead Inbox
                </Link>
              </li>
            </ul>
          </nav>

          {/* Account Column */}
          <nav aria-label="Account">
            <h3 className="font-semibold font-heading mb-4">Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/saved"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Saved Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Nestwell. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
