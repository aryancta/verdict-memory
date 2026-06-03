import { NextResponse } from "next/server";

import { listDecisions } from "@/lib/store";
import { detectDecision, findContradictions } from "@/lib/engine";
import { claudeContradictionNote } from "@/lib/claude";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const text = (body.text || "").trim();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const decisions = listDecisions();
  const candidate = detectDecision(text);
  const contradictions = findContradictions(text, decisions);

  // If the message reverses a settled decision, lead with the warning and do
  // not also offer to log the conflicting direction. Keeps the moment clean.
  const hasReversal = contradictions.some((c) => c.conflictType === "reversal");
  if (hasReversal) {
    candidate.detected = false;
  }

  const apiKey = req.headers.get("x-user-anthropic-key") || "";
  let mode: "live" | "demo" = "demo";

  if (apiKey && contradictions.length > 0) {
    mode = "live";
    const top = contradictions[0];
    const note = await claudeContradictionNote(apiKey, text, top.decision);
    if (note) {
      top.explanation = note;
    } else {
      mode = "demo";
    }
  }

  return NextResponse.json({ candidate, contradictions, mode });
}
