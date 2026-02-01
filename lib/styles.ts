/**
 * Centralized color variant classes for consistent styling across the app.
 * Use these for icon backgrounds, badges, and other colored UI elements.
 */

export const colorVariants = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-amber-500/10 text-amber-600",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
} as const;

export type ColorVariant = keyof typeof colorVariants;

/**
 * Get the color variant class for a given variant name.
 */
export function getColorVariant(variant: ColorVariant): string {
  return colorVariants[variant];
}
