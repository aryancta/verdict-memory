"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Hash,
  Sparkles,
  X,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { channelLabel } from "@/lib/channels";
import type { CaptureCandidate, ContradictionHit } from "@/lib/types";
import { cn, formatDate, initials, relativeTime } from "@/lib/utils";

export function SlackMessage({
  author,
  role,
  time,
  children,
  highlight,
}: {
  author: string;
  role?: string;
  time: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-md px-2 py-1.5",
        highlight && "bg-warning/10"
      )}
    >
      <Avatar
        name={author}
        text={initials(author)}
        className="mt-0.5 h-9 w-9 rounded-md text-sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-foreground">{author}</span>
          {role ? (
            <span className="rounded bg-muted px-1.5 text-[10px] font-medium uppercase text-muted-foreground">
              {role}
            </span>
          ) : null}
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <div className="text-sm leading-relaxed text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function VerdictAppMessage({
  children,
  badge = "APP",
}: {
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="flex gap-3 px-2 py-1.5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-foreground">Verdict Memory</span>
          <span className="rounded bg-primary/15 px-1.5 text-[10px] font-bold uppercase text-primary">
            {badge}
          </span>
        </div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

export function ContradictionCard({
  hit,
  actionSlot,
}: {
  hit: ContradictionHit;
  actionSlot?: React.ReactNode;
}) {
  const d = hit.decision;
  const heading =
    hit.conflictType === "reversal"
      ? "Heads up - this reverses a settled decision"
      : "Heads up - you are reopening a settled decision";
  return (
    <div className="overflow-hidden rounded-lg border border-warning/40 bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-warning/30 bg-warning/10 px-4 py-2.5">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <span className="text-sm font-semibold text-foreground">{heading}</span>
      </div>
      <div className="space-y-3 p-4">
        <p className="text-sm text-foreground">{hit.explanation}</p>
        <div className="rounded-md border bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">{d.title}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {relativeTime(d.decidedAt)}
            </span>
          </div>
          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
            {d.rationale}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Avatar
                name={d.owner.name}
                text={initials(d.owner.name)}
                className="h-4 w-4 text-[9px]"
              />
              {d.owner.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {channelLabel(d.channel).replace("#", "")}
            </span>
            <span>{formatDate(d.decidedAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {actionSlot}
          <a href={d.permalink} target="_blank" rel="noreferrer noopener">
            <Button size="sm" variant="outline">
              Open source thread
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export function CaptureCard({
  candidate,
  onConfirm,
  onDismiss,
  saved,
}: {
  candidate: CaptureCandidate;
  onConfirm?: () => void;
  onDismiss?: () => void;
  saved?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-primary/30 bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2.5">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">
          {saved ? "Decision logged to memory" : "Looks like a decision - log it?"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {Math.round(candidate.confidence * 100)}% sure
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <Detail label="Outcome">{candidate.suggestedOutcome}</Detail>
          <Detail label="Topic" capitalize>
            {candidate.suggestedTopic}
          </Detail>
        </div>
        {candidate.suggestedRejected.length > 0 && (
          <Detail label="Set aside" capitalize>
            {candidate.suggestedRejected.join(", ")}
          </Detail>
        )}
        {!saved ? (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={onConfirm}>
              <Check className="h-4 w-4" />
              Confirm and log
            </Button>
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              <X className="h-4 w-4" />
              Not a decision
            </Button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-md bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
            <Check className="h-3.5 w-3.5" />
            Saved with provenance and a link back to this thread
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({
  label,
  children,
  capitalize,
}: {
  label: string;
  children: React.ReactNode;
  capitalize?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={cn("font-medium", capitalize && "capitalize")}>
        {children}
      </div>
    </div>
  );
}
