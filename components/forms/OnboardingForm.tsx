"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { completeUserOnboarding } from "@/actions/users";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface OnboardingFormProps {
  defaultName: string;
  email: string;
}

export function OnboardingForm({ defaultName, email }: OnboardingFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
      phone: "",
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await completeUserOnboarding({
          name: data.name,
          phone: data.phone || "",
          email,
        });
      } catch (error) {
        // Redirect throws internally - rethrow to let Next.js handle it
        if (isRedirectError(error)) {
          throw error;
        }
        toast.error("Failed to complete onboarding. Please try again.");
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label htmlFor="onboarding-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="onboarding-email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email is managed by your account settings
              </p>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              className="w-full"
              loading={isPending}
              loadingText="Setting up..."
            >
              Complete Setup
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
