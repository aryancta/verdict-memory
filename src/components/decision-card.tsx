"use client";

import * as React from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Hash,
  Quote,
  Tag,
  Users,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { channelLabel } from "@/lib/channels";
import type { Decision } from "@/lib/types";
import { formatDate, initials, relativeTime } from "@/lib/utils";

export function DecisionCard({ decision }: { decision: Decision }) {
  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary" className="capitalize">
            {decision.topic}
          </Badge>
          <StatusBadge status={decision.status} />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-semibold leading-snug">{decision.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {decision.rationale}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Avatar
              name={decision.owner.name}
              text={initials(decision.owner.name)}
              className="h-7 w-7"
            />
            <div className="leading-tight">
              <div className="font-medium">{decision.owner.name}</div>
              <div className="text-xs text-muted-foreground">
                {relativeTime(decision.decidedAt)}
              </div>
            </div>
          </div>
          <DecisionDetailDialog decision={decision}>
            <Button variant="ghost" size="sm" className="text-primary">
              Details
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </DecisionDetailDialog>
        </div>
      </CardContent>
    </Card>
  );
}

export function DecisionDetailDialog({
  decision,
  children,
}: {
  decision: Decision;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {decision.topic}
            </Badge>
            <StatusBadge status={decision.status} />
          </div>
          <DialogTitle className="pt-1 text-xl">{decision.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Outcome
            </div>
            <p className="mt-1 text-sm font-medium">{decision.outcome}</p>
          </div>

          <div>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Why
            </div>
            <p className="text-sm leading-relaxed">{decision.rationale}</p>
          </div>

          {decision.rejected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Set aside
              </span>
              {decision.rejected.map((r) => (
                <Badge key={r} variant="muted" className="capitalize line-through">
                  {r}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Field icon={<Users className="h-4 w-4" />} label="Decided by">
              {decision.owner.name}
              <span className="block text-xs text-muted-foreground">
                {decision.owner.role}
              </span>
            </Field>
            <Field icon={<CalendarDays className="h-4 w-4" />} label="When">
              {formatDate(decision.decidedAt)}
              <span className="block text-xs text-muted-foreground">
                {relativeTime(decision.decidedAt)}
              </span>
            </Field>
            <Field icon={<Hash className="h-4 w-4" />} label="Channel">
              {channelLabel(decision.channel)}
            </Field>
            <Field icon={<Tag className="h-4 w-4" />} label="Confidence">
              {Math.round(decision.confidence * 100)}%
            </Field>
          </div>

          {decision.stakeholders.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Stakeholders
              </div>
              <div className="flex flex-wrap gap-2">
                {decision.stakeholders.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2 rounded-full border bg-background px-2 py-1 text-xs"
                  >
                    <Avatar
                      name={s.name}
                      text={initials(s.name)}
                      className="h-5 w-5 text-[10px]"
                    />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border-l-2 border-primary bg-accent/40 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
              <Quote className="h-3.5 w-3.5" />
              Source message
            </div>
            <p className="text-sm italic">&ldquo;{decision.sourceQuote}&rdquo;</p>
          </div>

          <a
            href={decision.permalink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              Open source thread in Slack
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-medium">{children}</div>
    </div>
  );
}
