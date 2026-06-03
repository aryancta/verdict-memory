<p align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="Verdict Memory logo" />
</p>

<h1 align="center">Verdict Memory</h1>

<p align="center">
  The Slack agent that remembers every decision your team makes and warns you before you contradict one.
</p>

---

## What this is

Teams make their most important calls inside Slack threads, and then those calls scroll away. Six weeks later someone proposes the exact opposite, a new hire cannot find out why a choice was made, and the team quietly re-litigates a settled question. Slack search is keyword-based, so it can tell you a message exists but it cannot answer "why did we decide this" or warn you "we already decided the opposite."

We built Verdict Memory to fix that. It is a Slack agent that treats organizational decisions as living memory with provenance, not a flat searchable archive. It notices when a decision is being made, offers a one-tap card to log it with the owner and reasoning, answers "why" questions with real citations, and - the part we are proudest of - speaks up the moment a new discussion reverses or reopens a settled call.

This repo is the web companion: the control center where you can browse decision memory, run grounded Q&A, read the contradiction-alert feed, and most importantly use the **live channel** to watch the agent catch a contradiction in real time.

## The 60-second story

1. Three months ago the team chose Postgres over MongoDB for ACID guarantees on the billing tables. It is sitting in memory with the owner, the reasoning, and a link to the thread.
2. Today someone types in `#engineering`: *"let's just migrate everything to MongoDB next sprint."*
3. Within seconds Verdict Memory posts a Block Kit alert: *"Heads up - this reverses a settled decision,"* with the original reasoning and a citation back to the source thread.
4. A teammate DMs the agent *"why did we pick Postgres?"* and gets a crisp, sourced answer with the owner's name and a permalink.

Open `/simulator` and tap **Reverse the database call** to see exactly this.

## Features

- **Automatic decision capture.** The agent recognizes decision-shaped moments ("final call: ...", "let's go with ...") and offers a one-tap card to log the outcome, owner, reasoning, and source link. No slash command to memorize.
- **Grounded Q&A with receipts.** Ask in plain language and get an answer pulled from real decision records, with who decided, when, and a clickable citation. Every answer carries provenance.
- **Contradiction and revival alerts.** On every related discussion the agent searches prior decisions, compares direction, and warns when the new path reverses or reopens a settled one.
- **Native Block Kit cards.** Each decision is a clean interactive card with outcome, reasoning, owner, stakeholders, status, and source thread, instead of a wall of text.
- **Weekly digest and staleness nudges.** A standing summary of what got decided plus a nudge to revisit calls that may be going stale.
- **Permission-aware by design.** Retrieval is built around the Real-Time Search model, which only ever returns content the asking user can already see.

## Demo mode vs live mode

The whole app works out of the box on a seeded decision log, so judges can click through every feature with zero setup. That is **demo mode**.

To run the reasoning live, open **Settings** and paste your own keys:

- **Anthropic Claude** key powers decision detection, contradiction reasoning, and grounded answers. Claude is a first-class framework in Slack's own agent quickstart, which is why we lean on it. Leave it blank to stay in demo mode.
- **Slack user token** (optional) with `search:read` scopes is what a production deployment uses to ground answers in live workspace context through the Real-Time Search API.

Keys are stored in your browser under `verdictmemory_api_keys` and are sent only as request headers to call the provider directly. They never touch our server, never get logged, and are never committed.

## Tech stack

- **Next.js 14** (App Router) with **TypeScript**
- **Tailwind CSS** + a small **shadcn/ui**-style component layer (Radix primitives)
- **Anthropic Claude** for detection, reasoning, and grounded answers (live mode)
- **Slack Real-Time Search API** model for permission-aware retrieval
- **lucide-react** icons, **sonner** for toasts
- Packaged with a multi-stage **Docker** build on Next.js standalone output

## Architecture

```
src/
  app/
    page.tsx              Landing page
    (app)/                Authenticated app shell (sidebar + topbar)
      dashboard/          Decision memory grid + stats
      simulator/          Live channel: capture + contradiction catch
      ask/                Grounded Q&A with citations
      alerts/             Recent contradiction and revival warnings
      digest/             Weekly digest and staleness nudges
      settings/           Bring-your-own API keys (localStorage only)
    api/
      decisions/          List, create, and update decisions
      detect/             Decision detection + contradiction check
      ask/                Grounded question answering
      alerts/             Recent flagged moments
      digest/             Weekly summary
  components/             UI, Slack-style Block Kit cards, app shell
  lib/
    engine.ts             Detection, contradiction, and retrieval logic
    claude.ts             Optional Claude calls with graceful fallback
    seed.ts / store.ts    Seeded decision log + in-memory store
    types.ts              Data model
```

The contradiction engine is the heart of it. Each decision records what was `chosen` and what was `rejected`, plus topic tags. When a new message arrives, the engine looks for messages that advocate a previously rejected option or propose dropping a chosen one (a **reversal**), or that reopen a settled topic (a **revival**). With a Claude key present, the agent uses Claude to phrase the warning naturally; without one it falls back to a deterministic explanation so the feature always works.

We keep decision content and provenance in a lightweight store and treat message text as living in Slack, which mirrors how a real deployment would respect platform terms.

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Run it with Docker

```bash
docker build -t app .
docker run -p 3000:3000 app
# open http://localhost:3000
```

## Where we would take it next

- Wire the live Slack MCP server so capture cards and alerts post into real channels.
- Turn a topic's decision history into a Slack canvas a new hire can read top to bottom.
- Track decision drift over time and score confidence as supporting evidence accumulates or ages.
- Team-level analytics on which topics get re-litigated most, so leads know where memory is thin.

## Credits

Built by Aryan Choudhary for the Slack Agent Builder Challenge. Grounded in Slack's Real-Time Search API and MCP server, with reasoning by Anthropic's Claude.
