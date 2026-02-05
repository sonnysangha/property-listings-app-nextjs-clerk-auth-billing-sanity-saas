import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-11 w-full min-w-0 rounded-lg border-2 border-border bg-background px-4 py-2 text-base shadow-xs",
        // Placeholder
        "placeholder:text-muted-foreground",
        // Selection
        "selection:bg-primary selection:text-primary-foreground",
        // File input
        "file:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Focus state with warm ring
        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]",
        // Invalid state
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Dark mode
        "dark:bg-card dark:border-border",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Transition (explicit, not all)
        "transition-[border-color,box-shadow] duration-200",
        // Responsive text size
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
