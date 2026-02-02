import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/saved(.*)",
  "/profile(.*)",
  "/onboarding(.*)",
]);

const isAgentRoute = createRouteMatcher(["/dashboard(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/properties(.*)",
  "/pricing(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/studio(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, has } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Agent routes require active subscription (Clerk Billing)
  if (isAgentRoute(req) && userId) {
    const hasAgentPlan = has({ plan: "agent" });
    if (!hasAgentPlan) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  // Inject pathname header for use in layouts
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
