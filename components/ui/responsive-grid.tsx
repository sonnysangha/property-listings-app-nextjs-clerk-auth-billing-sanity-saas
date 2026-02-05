import type * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  children: React.ReactNode;
  className?: string;
}

// Map of column counts to Tailwind classes
const colClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
} as const;

const smColClasses = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
} as const;

const mdColClasses = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
} as const;

const lgColClasses = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
} as const;

const xlColClasses = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
} as const;

const gapClasses = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
} as const;

function ResponsiveGrid({
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  children,
  className,
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    colClasses[1], // Base: 1 column
    cols.sm && smColClasses[cols.sm as keyof typeof smColClasses],
    cols.md && mdColClasses[cols.md as keyof typeof mdColClasses],
    cols.lg && lgColClasses[cols.lg as keyof typeof lgColClasses],
    cols.xl && xlColClasses[cols.xl as keyof typeof xlColClasses],
    gapClasses[gap as keyof typeof gapClasses] || "gap-6",
    className,
  );

  return <div className={gridClasses}>{children}</div>;
}

export { ResponsiveGrid };
export type { ResponsiveGridProps };
