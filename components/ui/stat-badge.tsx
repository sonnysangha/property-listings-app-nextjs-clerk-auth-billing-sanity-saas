import type { LucideIcon } from "lucide-react";
import { type ColorVariant, colorVariants } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface StatBadgeProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: ColorVariant;
  className?: string;
}

function StatBadge({
  icon: Icon,
  value,
  label,
  color = "primary",
  className,
}: StatBadgeProps) {
  return (
    <div
      className={cn(
        "bg-background rounded-2xl border border-border/50 p-5 shadow-warm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            colorVariants[color],
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xl font-bold font-heading tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

export { StatBadge };
export type { StatBadgeProps };
