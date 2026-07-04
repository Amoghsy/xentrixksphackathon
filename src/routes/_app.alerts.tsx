import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/app/primitives";
import { getAlerts } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/alerts")({
  head: () => ({ meta: [{ title: "Alerts — Crime Intelligence Assistant" }] }),
  component: AlertsPage,
});

const SEV = ["All", "Critical", "Warning", "Info"] as const;

function AlertsPage() {
  const [sev, setSev] = useState<(typeof SEV)[number]>("All");
  const { data, isLoading } = useQuery({ queryKey: ["alerts"], queryFn: getAlerts });
  const items = (data ?? []).filter((a) => sev === "All" || a.severity === sev);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Early Warning Center"
        subtitle="AI-generated alerts from anomaly detection across FIR feeds."
        actions={
          <div className="flex gap-1">
            {SEV.map((s) => (
              <Button
                key={s}
                variant={sev === s ? "default" : "outline"}
                size="sm"
                onClick={() => setSev(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-md" />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-12 text-center text-muted-foreground">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-40" />
          No alerts at this time.
        </div>
      )}

      <ul className="space-y-3">
        {items.map((a) => {
          const color =
            a.severity === "Critical"
              ? "border-l-destructive"
              : a.severity === "Warning"
                ? "border-l-warning"
                : "border-l-info";
          const badge =
            a.severity === "Critical"
              ? "bg-destructive text-destructive-foreground"
              : a.severity === "Warning"
                ? "bg-warning text-warning-foreground"
                : "bg-info text-info-foreground";
          return (
            <li
              key={a.id}
              className={cn(
                "rounded-md border border-border bg-card border-l-4 p-4 hover:shadow-sm transition-shadow",
                color,
              )}
            >
              <div className="flex items-start gap-3">
                <Badge className={badge}>{a.severity}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(a.ts), "d MMM yyyy · HH:mm")}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.area}</div>
                  <p className="text-sm mt-2 text-foreground/90 leading-relaxed">{a.detail}</p>
                  <button className="mt-2 text-xs font-medium text-primary hover:underline">
                    View details →
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
