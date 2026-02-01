type KPICardProps = {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "secondary" | "success" | "warning";
};

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-amber-500/10 text-amber-600",
};

export function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  return (
    <div className="bg-background rounded-2xl border border-border/50 p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <div className="text-3xl font-bold font-heading tabular-nums">{value}</div>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}
