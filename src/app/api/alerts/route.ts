import { NextResponse } from "next/server";

import { listDecisions } from "@/lib/store";
import { findContradictions } from "@/lib/engine";
import type { ContradictionHit } from "@/lib/types";

export const dynamic = "force-dynamic";

const WATCHED = [
  {
    id: "w1",
    author: "Devin Park",
    role: "Eng",
    channel: "#engineering",
    message:
      "honestly let's just migrate everything to MongoDB next sprint, Postgres is slowing us down",
    when: "2026-06-02T15:40:00.000Z",
  },
  {
    id: "w2",
    author: "Sam Rivera",
    role: "CEO",
    channel: "#growth",
    message:
      "what if we move to per-seat pricing for the enterprise tier, finance keeps asking",
    when: "2026-05-29T11:10:00.000Z",
  },
  {
    id: "w3",
    author: "Aisha Khan",
    role: "Design",
    channel: "#product",
    message: "should we revisit going native for mobile now that usage is up?",
    when: "2026-05-24T17:22:00.000Z",
  },
  {
    id: "w4",
    author: "Maya Chen",
    role: "Eng Lead",
    channel: "#engineering",
    message: "team is asking if we should drop Clerk and roll our own auth again",
    when: "2026-05-20T09:05:00.000Z",
  },
];

export async function GET() {
  const decisions = listDecisions();
  const alerts = WATCHED.map((w) => {
    const hits: ContradictionHit[] = findContradictions(w.message, decisions);
    return { ...w, hits };
  }).filter((a) => a.hits.length > 0);

  return NextResponse.json({ alerts });
}
