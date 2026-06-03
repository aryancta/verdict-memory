import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  FileText,
  Hash,
  MessageSquareWarning,
  Quote,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Automatic decision capture",
    body: "The agent notices when a real call is being made and offers a one-tap card to log it with owner, reasoning, and a link back to the thread. No slash command to remember.",
    tag: "Core",
  },
  {
    icon: Search,
    title: "Grounded answers with receipts",
    body: "Ask why we went with vendor X and get an answer pulled from real messages, with who decided it, when, and a clickable citation. Not a hallucination.",
    tag: "Core",
  },
  {
    icon: MessageSquareWarning,
    title: "Contradiction and revival alerts",
    body: "When a new discussion conflicts with a settled decision, the agent posts a gentle heads-up: you already decided the opposite, here is why.",
    tag: "Core",
  },
  {
    icon: Hash,
    title: "Native Block Kit cards",
    body: "Every decision is a clean interactive card with outcome, reasoning, owner, stakeholders, status, and source link, so memory feels native to Slack.",
    tag: "Core",
  },
  {
    icon: CalendarClock,
    title: "Weekly digest and staleness nudges",
    body: "A standing Monday summary of new decisions plus a prompt to revisit calls that may now be stale, so memory stays current instead of rotting.",
    tag: "Bonus",
  },
  {
    icon: FileText,
    title: "Provenance on everything",
    body: "Each entry tracks author, timestamp, confidence, and evidence, so the agent can reconcile conflicts and justify what it surfaces.",
    tag: "Bonus",
  },
];

const STEPS = [
  {
    title: "Watch",
    body: "As people talk, the agent recognizes decision-shaped moments and offers to log them with full context.",
  },
  {
    title: "Search",
    body: "On every related discussion it runs a permission-aware Real-Time Search for prior decisions on the same topic.",
  },
  {
    title: "Warn",
    body: "If the new direction reverses or reopens a settled call, it speaks up in the thread with the original reasoning and a citation.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="absolute inset-0 glow" />
          <div className="container relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
            <div className="space-y-6">
              <Badge variant="secondary" className="gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Slack Agent Builder Challenge
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Stop re-deciding what you already decided.
              </h1>
              <p className="text-lg text-muted-foreground">
                Verdict Memory is the Slack agent that remembers every decision
                your team makes, answers why with receipts, and warns you the
                moment a new discussion contradicts a settled call.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/simulator">
                  <Button size="lg">
                    Watch it catch a contradiction
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Explore decision memory
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Grounded by the Real-Time Search API
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquareWarning className="h-4 w-4 text-primary" />
                  Permission-aware by default
                </span>
              </div>
            </div>

            <HeroPreview />
          </div>
        </section>

        <section className="border-b py-16">
          <div className="container space-y-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Memory with provenance, not just search
              </h2>
              <p className="mt-3 text-muted-foreground">
                Slack search is keyword-based and surfaces recent over relevant.
                Verdict Memory treats decisions as living memory: who, when, why,
                and a link to the thread that produced them.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <Card key={f.title} className="h-full">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <Badge variant={f.tag === "Core" ? "default" : "secondary"}>
                        {f.tag}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {f.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b bg-card/40 py-16">
          <div className="container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <Badge variant="warning" className="gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                The wow moment
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                It catches the team before it reverses itself
              </h2>
              <p className="text-muted-foreground">
                Three months ago the team chose Postgres over MongoDB for ACID
                guarantees. Today someone proposes migrating everything to
                MongoDB. Within seconds, Verdict Memory posts the original
                reasoning and the thread it came from, right where the
                discussion is happening.
              </p>
              <Link href="/simulator">
                <Button>
                  Try the live channel
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <StoryCard />
          </div>
        </section>

        <section className="py-16">
          <div className="container space-y-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
              <p className="mt-3 text-muted-foreground">
                Three steps, all grounded in live workspace context.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <Card key={s.title}>
                  <CardContent className="space-y-2 p-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                      {i + 1}
                    </div>
                    <h3 className="pt-1 font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center">
              <h3 className="text-xl font-semibold">
                Give your team a memory it cannot scroll past
              </h3>
              <p className="text-muted-foreground">
                Open the dashboard to see a seeded decision log, or jump into the
                live channel and watch the agent work.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/dashboard">
                  <Button size="lg">Open the app</Button>
                </Link>
                <Link href="/ask">
                  <Button size="lg" variant="outline">
                    Ask memory a question
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="rounded-2xl border bg-card p-3 shadow-xl">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">engineering</span>
        </div>
        <div className="space-y-3 p-3">
          <div className="flex gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-[#1264a3] text-xs font-semibold text-white">
              DP
            </span>
            <div>
              <div className="text-sm">
                <span className="font-bold">Devin Park</span>{" "}
                <span className="text-xs text-muted-foreground">10:42 AM</span>
              </div>
              <p className="text-sm">
                let&rsquo;s just migrate everything to MongoDB next sprint
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-warning/40">
            <div className="flex items-center gap-2 bg-warning/10 px-3 py-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Heads up - this reverses a settled decision
            </div>
            <div className="space-y-2 p-3 text-sm">
              <p>
                On Mar 12 this team chose Postgres over MongoDB for ACID
                guarantees on the billing tables.
              </p>
              <div className="rounded-md border bg-muted/40 p-2.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Quote className="h-3 w-3" />
                  Maya Chen, Engineering Lead
                </div>
                <p className="mt-1 text-xs italic text-muted-foreground">
                  &ldquo;Final call: we are going with Postgres. The billing
                  tables need real transactions.&rdquo;
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                  View decision
                </span>
                <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                  Open source thread
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryCard() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">product</span>
      </div>
      <CardContent className="space-y-3 p-4 text-sm">
        <div className="flex gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-[#e01e5a] text-xs font-semibold text-white">
            SR
          </span>
          <div>
            <span className="font-bold">Sam Rivera</span>
            <p>can someone DM the agent and ask why we picked Postgres?</p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <span className="font-bold">Verdict Memory</span>
            <p className="text-muted-foreground">
              Maya Chen made the call on Mar 12: Postgres over MongoDB. The
              billing and audit tables need real transactions across rows, and
              the prototype kept hitting eventual-consistency bugs.
            </p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
              <Quote className="h-3 w-3" />
              cited from #engineering, Mar 12
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
