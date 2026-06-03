import { NextResponse } from "next/server";

import { listDecisions } from "@/lib/store";
import { channelLabel } from "@/lib/channels";
import type { DigestData, DigestEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const decisions = listDecisions();
  const now = Date.now();
  const day = 1000 * 60 * 60 * 24;

  // Most recent calls, shown as what landed in memory this period.
  const newDecisions: DigestEntry[] = decisions
    .filter((d) => d.status !== "superseded")
    .slice(0, 4)
    .map((d) => ({
      decision: d,
      note: `Logged by ${d.owner.name} in ${channelLabel(d.channel)},`,
    }));

  const staleDecisions: DigestEntry[] = decisions
    .filter(
      (d) =>
        d.status === "stale" ||
        (d.status === "active" &&
          now - new Date(d.decidedAt).getTime() > 100 * day)
    )
    .slice(0, 5)
    .map((d) => ({
      decision: d,
      note: `No activity in months. Worth a quick check that ${d.chosen} still holds.`,
    }));

  const data: DigestData = {
    weekOf: new Date().toISOString(),
    newDecisions,
    staleDecisions,
    activeContradictionWatch: decisions.filter((d) => d.status === "active")
      .length,
  };

  return NextResponse.json(data);
}
