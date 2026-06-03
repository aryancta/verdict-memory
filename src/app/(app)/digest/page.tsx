"use client";

import * as React from "react";
import { CalendarClock, Clock4, Sparkles } from "lucide-react";

import { DecisionDetailDialog } from "@/components/decision-card";
import { StatusBadge } from "@/components/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DigestData } from "@/lib/types";
import { formatDate, initials, relativeTime } from "@/lib/utils";

export default function DigestPage() {
  const [digest, setDigest] = React.useState<DigestData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/digest", { cache: "no-store" });
        const data = (await res.json()) as DigestData;
        setDigest(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Weekly digest</h2>
        <p className="text-muted-foreground">
          A standing summary the agent posts every Monday: what got decided, and
          what may be going stale.
        </p>
      </div>

      {loading || !digest ? (
        <Card className="h-64 animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="mt-4 h-3 w-full rounded bg-muted" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden border-primary/30">
            <div className="flex items-center gap-2 border-b bg-primary/5 px-5 py-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Verdict Memory digest</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Week of {formatDate(digest.weekOf)}
              </span>
            </div>
            <CardContent className="grid grid-cols-3 gap-4 p-5 text-center">
              <Metric value={digest.newDecisions.length} label="New decisions" />
              <Metric value={digest.staleDecisions.length} label="Going stale" />
              <Metric
                value={digest.activeContradictionWatch}
                label="Watched live"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="h-4 w-4 text-primary" />
                New this period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {digest.newDecisions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No new decisions logged this period.
                </p>
              ) : (
                digest.newDecisions.map((entry) => (
                  <DecisionDetailDialog
                    key={entry.decision.id}
                    decision={entry.decision}
                  >
                    <button className="flex w-full items-center gap-3 rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted/50">
                      <Avatar
                        name={entry.decision.owner.name}
                        text={initials(entry.decision.owner.name)}
                        className="h-8 w-8"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {entry.decision.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.note} {relativeTime(entry.decision.decidedAt)}
                        </div>
                      </div>
                      <StatusBadge status={entry.decision.status} />
                    </button>
                  </DecisionDetailDialog>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock4 className="h-4 w-4 text-warning" />
                Worth revisiting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {digest.staleDecisions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing looks stale right now.
                </p>
              ) : (
                digest.staleDecisions.map((entry) => (
                  <div
                    key={entry.decision.id}
                    className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {entry.decision.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.note}
                      </div>
                    </div>
                    <DecisionDetailDialog decision={entry.decision}>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </DecisionDetailDialog>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
