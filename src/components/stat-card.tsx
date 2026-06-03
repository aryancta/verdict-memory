import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ReactNode;
  accent?: "primary" | "warning" | "success";
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg",
            accent === "warning"
              ? "bg-warning/15 text-warning"
              : accent === "success"
                ? "bg-success/12 text-success"
                : "bg-primary/10 text-primary"
          )}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-semibold leading-none tracking-tight">
            {value}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{label}</div>
          {hint ? (
            <div className="text-xs text-muted-foreground/80">{hint}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
