import { type ColorVariant, colorVariants } from "@/lib/styles";

type KPICardProps = {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: ColorVariant;
};

export function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  return (
    <div className="bg-background rounded-2xl border border-border/50 p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorVariants[color]}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <div className="text-3xl font-bold font-heading tabular-nums">
        {value}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}
