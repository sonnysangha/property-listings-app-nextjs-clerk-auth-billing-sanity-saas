"use client";

import {
  Protect,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Heart, Home, LayoutDashboard, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Disable sticky header on pricing page to prevent z-index conflicts with Clerk's PricingTable
  const isPricingPage = pathname === "/pricing";

  return (
    <header
      className={
        isPricingPage
          ? "w-full border-b border-border/50 bg-background"
          : "sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      }
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
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

          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            <Link
              href="/properties"
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
            >
              Browse Properties
            </Link>
            <SignedIn>
              <Protect
                plan="agent"
                fallback={
                  <Link
                    href="/pricing"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                  >
                    Become an Agent
                  </Link>
                }
              >
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                >
                  Dashboard
                </Link>
              </Protect>
            </SignedIn>
            <SignedOut>
              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
              >
                Become an Agent
              </Link>
            </SignedOut>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <SignedIn>
            <Link
              href="/saved"
              aria-label="Saved properties"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/profile"
              aria-label="My profile"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Protect plan="agent">
              <Link
                href="/dashboard"
                aria-label="Agent dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
              >
                <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Protect>
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Get Started</Button>
            </SignUpButton>
          </SignedOut>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] overscroll-contain"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Home
                      className="h-4 w-4 text-primary-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="font-heading">Nestwell</span>
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-2 mt-8"
                aria-label="Mobile navigation"
              >
                <Link
                  href="/properties"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                >
                  Browse Properties
                </Link>
                <SignedIn>
                  <Protect
                    plan="agent"
                    fallback={
                      <Link
                        href="/pricing"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                      >
                        Become an Agent
                      </Link>
                    }
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                    >
                      <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                      Agent Dashboard
                    </Link>
                  </Protect>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                  >
                    Become an Agent
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="h-px bg-border my-2" />
                  <Link
                    href="/saved"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                  >
                    <Heart className="h-5 w-5" aria-hidden="true" />
                    Saved Properties
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                  >
                    <User className="h-5 w-5" aria-hidden="true" />
                    My Profile
                  </Link>
                </SignedIn>
                <SignedOut>
                  <div className="h-px bg-border my-2" />
                  <div className="flex flex-col gap-2 px-4 mt-2">
                    <SignInButton mode="modal">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
