import { Badge } from "@/components/ui/badge";
import type { DecisionStatus } from "@/lib/types";

const MAP: Record<
  DecisionStatus,
  { label: string; variant: "success" | "warning" | "muted" | "destructive" }
> = {
  active: { label: "Active", variant: "success" },
  stale: { label: "Stale", variant: "warning" },
  revisiting: { label: "Revisiting", variant: "warning" },
  superseded: { label: "Superseded", variant: "muted" },
};

export function StatusBadge({ status }: { status: DecisionStatus }) {
  const { label, variant } = MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
