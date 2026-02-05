"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateAgentProfile } from "@/actions/agents";
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
import type { Agent } from "@/types";

const formSchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  licenseNumber: z.string().min(1, "License number is required"),
  agency: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AgentProfileFormProps {
  agent: Agent;
}

export function AgentProfileForm({ agent }: AgentProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: agent.bio || "",
      phone: agent.phone || "",
      licenseNumber: agent.licenseNumber || "",
      agency: agent.agency || "",
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await updateAgentProfile({
          bio: data.bio,
          phone: data.phone,
          licenseNumber: data.licenseNumber,
          agency: data.agency,
        });
        toast.success("Profile updated successfully");
      } catch (_error) {
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="agent-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="agent-name"
            value={agent.name}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Name is managed in your user profile
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="agent-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="agent-email"
            value={agent.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email is managed by your account settings
          </p>
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell potential clients about your experience..."
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
              <FormLabel>Agency / Brokerage</FormLabel>
              <FormControl>
                <Input placeholder="e.g., RE/MAX, Coldwell Banker" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          type="submit"
          loading={isPending}
          loadingText="Saving..."
        >
          Save Changes
        </LoadingButton>
      </form>
    </Form>
  );
}
