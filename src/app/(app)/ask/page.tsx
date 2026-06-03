"use client";

import * as React from "react";
import {
  ArrowUpRight,
  CornerDownLeft,
  Hash,
  Loader2,
  Quote,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { DemoBanner } from "@/components/demo-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiKeys } from "@/components/providers/api-key-provider";
import type { AskAnswer } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const SUGGESTIONS = [
  "Why did we pick Postgres?",
  "What did we decide about pricing?",
  "Which analytics tool are we using and why?",
  "Did we decide anything about mobile apps?",
];

export default function AskPage() {
  const { headers } = useApiKeys();
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AskAnswer | null>(null);
  const [asked, setAsked] = React.useState("");

  async function ask(q: string) {
    const value = q.trim();
    if (!value || loading) return;
    setLoading(true);
    setAsked(value);
    setResult(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ question: value }),
      });
      if (!res.ok) throw new Error("ask failed");
      const data = (await res.json()) as AskAnswer;
      setResult(data);
    } catch {
      toast.error("Could not reach memory. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Ask memory</h2>
        <p className="text-muted-foreground">
          Ask in plain language. Every answer names who decided, when, and links
          the thread it came from.
        </p>
      </div>

      <DemoBanner feature="Grounded Q&A" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="relative"
      >
        <Input
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask why a decision was made..."
          className="h-12 pr-28 text-base"
        />
        <Button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-1.5 top-1.5 h-9"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CornerDownLeft className="h-4 w-4" />
          )}
          Ask
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <Button
            key={s}
            variant="outline"
            size="sm"
            onClick={() => {
              setQuestion(s);
              ask(s);
            }}
            disabled={loading}
          >
            {s}
          </Button>
        ))}
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Searching the workspace for related decisions...
          </CardContent>
        </Card>
      ) : null}

      {result && !loading ? (
        <Card className="animate-fade-in">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Verdict Memory</span>
                  <Badge variant={result.mode === "live" ? "success" : "warning"}>
                    {result.mode === "live" ? "Live" : "Demo"}
                  </Badge>
                </div>
                <p className="text-[15px] leading-relaxed text-foreground">
                  {result.answer}
                </p>
              </div>
            </div>

            {result.citations.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Receipts
                </div>
                {result.citations.map((c) => (
                  <a
                    key={c.decisionId}
                    href={c.permalink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{c.title}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="mt-1 flex items-start gap-1.5 text-sm italic text-muted-foreground">
                      <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {c.quote}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{c.owner}</span>
                      <span className="inline-flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {c.channel.replace("#", "")}
                      </span>
                      <span>{formatDate(c.decidedAt)}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {!result && !loading ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Ask anything your team has decided. Try one of the suggestions above
            to see a grounded answer with citations.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
