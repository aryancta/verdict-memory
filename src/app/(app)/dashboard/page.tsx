"use client";

import * as React from "react";
import {
  Brain,
  CircleCheckBig,
  Clock4,
  Search,
  ShieldAlert,
} from "lucide-react";

import { DecisionCard } from "@/components/decision-card";
import { LogDecisionDialog } from "@/components/log-decision-dialog";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDecisions } from "@/hooks/use-decisions";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { decisions, loading, error, refresh } = useDecisions();
  const [query, setQuery] = React.useState("");
  const [topic, setTopic] = React.useState<string>("all");

  const topics = React.useMemo(() => {
    const set = new Set(decisions.map((d) => d.topic));
    return ["all", ...Array.from(set)];
  }, [decisions]);

  const filtered = decisions.filter((d) => {
    const matchesTopic = topic === "all" || d.topic === topic;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.rationale.toLowerCase().includes(q) ||
      d.tags.some((t) => t.includes(q));
    return matchesTopic && matchesQuery;
  });

  const stats = {
    total: decisions.length,
    active: decisions.filter((d) => d.status === "active").length,
    stale: decisions.filter((d) => d.status === "stale").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Decision memory
          </h2>
          <p className="text-muted-foreground">
            Every call your team has made, with the reasoning and a link back to
            the thread.
          </p>
        </div>
        <LogDecisionDialog onCreated={refresh} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Decisions in memory"
          value={loading ? "-" : stats.total}
          icon={<Brain className="h-5 w-5" />}
          accent="primary"
        />
        <StatCard
          label="Active and holding"
          value={loading ? "-" : stats.active}
          icon={<CircleCheckBig className="h-5 w-5" />}
          accent="success"
        />
        <StatCard
          label="Flagged stale"
          value={loading ? "-" : stats.stale}
          hint="May need a revisit"
          icon={<Clock4 className="h-5 w-5" />}
          accent="warning"
        />
        <StatCard
          label="Watched for contradictions"
          value={loading ? "-" : stats.active}
          hint="Live via RTS"
          icon={<ShieldAlert className="h-5 w-5" />}
          accent="primary"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decisions, reasoning, or tags"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={topic === t ? "default" : "outline"}
              onClick={() => setTopic(t)}
              className={cn("capitalize", t === "all" && "lowercase")}
            >
              {t === "all" ? "All topics" : t}
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={refresh} variant="outline">
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-44 animate-pulse">
              <CardContent className="p-5">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-full rounded bg-muted" />
                <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No decisions match that filter yet.
            </p>
            <Button variant="outline" onClick={() => { setQuery(""); setTopic("all"); }}>
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}
    </div>
  );
}
