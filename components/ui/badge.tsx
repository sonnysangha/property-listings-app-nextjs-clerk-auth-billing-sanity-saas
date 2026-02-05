import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,background-color,border-color,box-shadow] duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        // Primary: Terracotta
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        // Secondary: Sage green
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        // Destructive: Warm red
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        // Success: Forest green
        success: "bg-success text-white [a&]:hover:bg-success/90",
        // Outline: Warm border
        outline:
          "border-border text-foreground bg-background [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Ghost: No background
        ghost:
          "text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Muted: Soft background
        muted: "bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
        // Link
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
