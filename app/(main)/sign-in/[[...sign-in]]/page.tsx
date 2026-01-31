import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container flex items-center justify-center py-16">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}
