import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-center py-16 border rounded-lg bg-muted/50",
        className,
      )}
    >
      {Icon && (
        <Icon
          className="h-12 w-12 mx-auto text-muted-foreground mb-4"
          aria-hidden="true"
        />
      )}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
