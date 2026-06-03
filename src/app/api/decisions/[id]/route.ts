import { NextResponse } from "next/server";

import { getDecision, updateDecisionStatus } from "@/lib/store";
import type { DecisionStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const decision = getDecision(params.id);
  if (!decision) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ decision });
}

const VALID: DecisionStatus[] = ["active", "superseded", "stale", "revisiting"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  let body: { status?: DecisionStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.status || !VALID.includes(body.status)) {
    return NextResponse.json(
      { error: `status must be one of ${VALID.join(", ")}` },
      { status: 400 }
    );
  }
  const decision = updateDecisionStatus(params.id, body.status);
  if (!decision) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ decision });
}
