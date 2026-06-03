import { NextResponse } from "next/server";

import { addDecision, listDecisions } from "@/lib/store";
import { channelName } from "@/lib/engine";
import type { Decision } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ decisions: listDecisions() });
}

export async function POST(req: Request) {
  let body: Partial<Decision> & { rawText?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.title || !body.outcome) {
    return NextResponse.json(
      { error: "title and outcome are required" },
      { status: 400 }
    );
  }

  const id = `dec_${Date.now().toString(36)}`;
  const channelId = body.channel || "C01ENG";
  const decision: Decision = {
    id,
    title: body.title,
    topic: body.topic || "general",
    outcome: body.outcome,
    chosen: body.chosen || "",
    rejected: body.rejected || [],
    rationale: body.rationale || "No rationale captured yet.",
    owner: body.owner || { name: "Unassigned", role: "Team" },
    stakeholders: body.stakeholders || [],
    status: "active",
    decidedAt: body.decidedAt || new Date().toISOString(),
    channel: channelId,
    permalink:
      body.permalink ||
      `https://northwind.slack.com/archives/${channelId}/p${Date.now()}000`,
    tags: body.tags && body.tags.length ? body.tags : tagsFrom(body),
    confidence: body.confidence ?? 0.9,
    sourceQuote: body.sourceQuote || body.rawText || body.outcome,
  };

  addDecision(decision);
  return NextResponse.json({ decision, channelName: channelName(channelId) });
}

function tagsFrom(body: Partial<Decision>): string[] {
  const base = [body.topic, body.chosen, ...(body.rejected || [])]
    .filter(Boolean)
    .map((t) => String(t).toLowerCase());
  return Array.from(new Set(base));
}
