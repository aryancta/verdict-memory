"use client";

import * as React from "react";

import type { Decision } from "@/lib/types";

export function useDecisions() {
  const [decisions, setDecisions] = React.useState<Decision[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/decisions", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load decisions");
      const data = (await res.json()) as { decisions: Decision[] };
      setDecisions(data.decisions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { decisions, loading, error, refresh, setDecisions };
}
