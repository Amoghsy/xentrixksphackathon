import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

export function Masked({ children, className }: { children: ReactNode; className?: string }) {
  const role = useAuthStore((s) => s.user?.role);
  const allowed = role === "Supervisor";
  if (allowed) return <span className={className}>{children}</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 select-none blur-[3px] hover:blur-0 transition-all",
        className,
      )}
      title="Restricted — Supervisor access required"
    >
      <Lock className="h-3 w-3 opacity-60" />
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-border">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  caption,
}: {
  label: string;
  value: string | number;
  delta?: number;
  caption?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {delta !== undefined && (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              up ? "text-success" : "text-destructive",
            )}
          >
            {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {caption && <div className="text-xs text-muted-foreground mt-1">{caption}</div>}
    </div>
  );
}
