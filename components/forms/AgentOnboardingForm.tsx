"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { completeAgentOnboarding } from "@/actions/agents";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  licenseNumber: z.string().min(1, "License number is required"),
  agency: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AgentOnboardingForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      phone: "",
      licenseNumber: "",
      agency: "",
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await completeAgentOnboarding({
          bio: data.bio,
          phone: data.phone,
          licenseNumber: data.licenseNumber,
          agency: data.agency,
        });
      } catch (_error) {
        toast.error("Failed to complete setup. Please try again.");
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell potential clients about your experience, specializations, and what makes you a great agent..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on your listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormDescription>
                    Clients will use this to contact you
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., DRE#01234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency / Brokerage (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., RE/MAX, Coldwell Banker"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton type="submit" className="w-full" loading={isPending} loadingText="Setting up...">
              Complete Agent Setup
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
