import { Protect } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sanityFetch } from "@/lib/sanity/live";
import { USER_PROFILE_QUERY } from "@/lib/sanity/queries";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: user } = await sanityFetch({
    query: USER_PROFILE_QUERY,
    params: { clerkId: userId },
  });

  if (!user) {
    redirect("/onboarding");
  }

  return (
    <div className="container max-w-2xl py-16">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>

        <Protect plan="agent">
          <Card>
            <CardHeader>
              <CardTitle>Agent Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your professional agent profile, bio, and license
                information.
              </p>
              <Button asChild>
                <Link href="/dashboard/profile">Manage Agent Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </Protect>
      </div>
    </div>
  );
}
