"use client";

import * as React from "react";
import { MessageSquareWarning } from "lucide-react";

import { DecisionDetailDialog } from "@/components/decision-card";
import { ContradictionCard, SlackMessage } from "@/components/slack/slack-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ContradictionHit } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface Alert {
  id: string;
  author: string;
  role: string;
  channel: string;
  message: string;
  when: string;
  hits: ContradictionHit[];
}

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/alerts", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load alerts");
        const data = (await res.json()) as { alerts: Alert[] };
        setAlerts(data.alerts);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Contradiction alerts
        </h2>
        <p className="text-muted-foreground">
          When a discussion conflicts with or reopens a settled decision, the
          agent posts a heads-up in the thread. Here is what it has flagged
          recently.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="mt-4 h-3 w-full rounded bg-muted" />
                <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No active contradictions. Memory is holding.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {alerts.map((alert) => (
            <Card key={alert.id} className="overflow-hidden">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{alert.channel}</Badge>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquareWarning className="h-3.5 w-3.5 text-warning" />
                    flagged {relativeTime(alert.when)}
                  </span>
                </div>
                <SlackMessage
                  author={alert.author}
                  role={alert.role}
                  time={relativeTime(alert.when)}
                >
                  {alert.message}
                </SlackMessage>
                {alert.hits.map((hit) => (
                  <ContradictionCard
                    key={hit.decision.id}
                    hit={hit}
                    actionSlot={
                      <DecisionDetailDialog decision={hit.decision}>
                        <Button size="sm">View decision</Button>
                      </DecisionDetailDialog>
                    }
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
