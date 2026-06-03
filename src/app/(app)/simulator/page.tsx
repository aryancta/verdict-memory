"use client";

import * as React from "react";
import { Hash, Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { DemoBanner } from "@/components/demo-banner";
import { DecisionDetailDialog } from "@/components/decision-card";
import {
  CaptureCard,
  ContradictionCard,
  SlackMessage,
  VerdictAppMessage,
} from "@/components/slack/slack-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiKeys } from "@/components/providers/api-key-provider";
import type {
  CaptureCandidate,
  ContradictionHit,
  Decision,
} from "@/lib/types";

type Entry =
  | {
      kind: "user";
      id: string;
      author: string;
      role?: string;
      time: string;
      text: string;
      highlight?: boolean;
    }
  | {
      kind: "agent";
      id: string;
      time: string;
      contradictions: ContradictionHit[];
      candidate: CaptureCandidate | null;
      mode: "live" | "demo";
      saved?: boolean;
    };

const PRESETS = [
  {
    label: "Reverse the database call",
    text: "honestly let's just migrate everything to MongoDB next sprint, Postgres is slowing us down",
  },
  {
    label: "Walk back the auth choice",
    text: "I think we should drop Clerk and build our own auth, it will be cheaper long term",
  },
  {
    label: "Reopen mobile strategy",
    text: "should we revisit going native for mobile now that usage is up?",
  },
  {
    label: "Make a brand new decision",
    text: "final call: we're standardizing on Stripe for billing and invoicing",
  },
];

const SEED_HISTORY: Entry[] = [
  {
    kind: "user",
    id: "h1",
    author: "Priya Nair",
    role: "PM",
    time: "9:02 AM",
    text: "Morning all, kicking off planning for next sprint. Drop anything you want on the agenda.",
  },
  {
    kind: "user",
    id: "h2",
    author: "Devin Park",
    role: "Eng",
    time: "9:04 AM",
    text: "I want to talk about query performance on the events table, it is getting heavy.",
  },
];

function now() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SimulatorPage() {
  const { headers } = useApiKeys();
  const [entries, setEntries] = React.useState<Entry[]>(SEED_HISTORY);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries, thinking]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || thinking) return;
    const userEntry: Entry = {
      kind: "user",
      id: `u_${Date.now()}`,
      author: "You",
      time: now(),
      text: value,
      highlight: true,
    };
    setEntries((e) => [...e, userEntry]);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ text: value }),
      });
      if (!res.ok) throw new Error("detect failed");
      const data = (await res.json()) as {
        candidate: CaptureCandidate;
        contradictions: ContradictionHit[];
        mode: "live" | "demo";
      };

      // brief pause so the thinking state reads as the agent working
      await new Promise((r) => setTimeout(r, 700));

      setEntries((e) => [
        ...e,
        {
          kind: "agent",
          id: `a_${Date.now()}`,
          time: now(),
          contradictions: data.contradictions,
          candidate: data.candidate.detected ? data.candidate : null,
          mode: data.mode,
        },
      ]);
    } catch {
      toast.error("The agent could not reach memory. Try again.");
    } finally {
      setThinking(false);
    }
  }

  async function confirmCapture(entryId: string, candidate: CaptureCandidate) {
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: candidate.suggestedTitle,
          topic: candidate.suggestedTopic,
          outcome: candidate.suggestedOutcome,
          chosen: candidate.suggestedChosen,
          rejected: candidate.suggestedRejected,
          rationale:
            "Captured from the live channel. Owner can add more context anytime.",
          owner: { name: "You", role: "Teammate" },
          channel: "C01ENG",
          sourceQuote: candidate.triggerPhrase,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      toast.success("Logged to memory", {
        description: "It now has provenance and a link back to this thread.",
      });
      setEntries((e) =>
        e.map((entry) =>
          entry.kind === "agent" && entry.id === entryId
            ? { ...entry, saved: true }
            : entry
        )
      );
    } catch {
      toast.error("Could not log the decision.");
    }
  }

  function dismissCapture(entryId: string) {
    setEntries((e) =>
      e.map((entry) =>
        entry.kind === "agent" && entry.id === entryId
          ? { ...entry, candidate: null }
          : entry
      )
    );
    toast("Dismissed", { description: "Not logged. The agent keeps watching." });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Live channel</h2>
        <p className="text-muted-foreground">
          A working Slack channel. Post a message and watch Verdict Memory catch
          a contradiction or offer to log a new decision.
        </p>
      </div>

      <DemoBanner feature="Contradiction detection" />

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card className="flex h-[560px] flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">engineering</span>
            <span className="text-xs text-muted-foreground">
              Verdict Memory is watching this channel
            </span>
          </div>

          <div
            ref={scrollRef}
            className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-3"
          >
            {entries.map((entry) =>
              entry.kind === "user" ? (
                <SlackMessage
                  key={entry.id}
                  author={entry.author}
                  role={entry.role}
                  time={entry.time}
                  highlight={entry.highlight}
                >
                  {entry.text}
                </SlackMessage>
              ) : (
                <VerdictAppMessage
                  key={entry.id}
                  badge={entry.mode === "live" ? "LIVE" : "APP"}
                >
                  <div className="space-y-3">
                    {entry.contradictions.length === 0 && !entry.candidate ? (
                      <p className="text-sm text-muted-foreground">
                        Nothing conflicts with memory here. I will keep watching
                        this thread.
                      </p>
                    ) : null}

                    {entry.contradictions.map((hit) => (
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

                    {entry.candidate ? (
                      <CaptureCard
                        candidate={entry.candidate}
                        saved={Boolean(entry.saved)}
                        onConfirm={() =>
                          confirmCapture(entry.id, entry.candidate!)
                        }
                        onDismiss={() => dismissCapture(entry.id)}
                      />
                    ) : null}
                  </div>
                </VerdictAppMessage>
              )
            )}

            {thinking ? (
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">
                  Verdict Memory
                </span>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>searching prior decisions via RTS...</span>
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              name="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message #engineering"
              disabled={thinking}
            />
            <Button type="submit" disabled={thinking || !input.trim()}>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <h3 className="text-sm font-semibold">Try a scenario</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              One tap drops a realistic message into the channel.
            </p>
            <div className="mt-3 space-y-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  className="h-auto w-full justify-start whitespace-normal py-2 text-left"
                  disabled={thinking}
                  onClick={() => send(p.text)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </Card>
          <Card className="bg-accent/40 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">How it works</p>
            <p className="mt-1 leading-relaxed">
              On every message the agent runs a permission-aware search for
              related prior decisions, compares direction, and only speaks up
              when it finds a real conflict or a decision worth logging.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
