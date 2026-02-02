import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/forms/OnboardingForm";
import { sanityFetch } from "@/lib/sanity/live";
import { USER_EXISTS_QUERY } from "@/lib/sanity/queries";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already completed onboarding
  const { data: existingUser } = await sanityFetch({
    query: USER_EXISTS_QUERY,
    params: { clerkId: userId },
  });

  if (existingUser) {
    redirect("/");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress || "";
  const name =
    `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim();

  return (
    <div className="container max-w-md py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to HomeFind!</h1>
        <p className="text-muted-foreground">
          Let's set up your profile to get started.
        </p>
      </div>

      <OnboardingForm defaultName={name} email={email} />
    </div>
  );
}
