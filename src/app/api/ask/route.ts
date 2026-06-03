import { NextResponse } from "next/server";

import { listDecisions } from "@/lib/store";
import { answerQuestion } from "@/lib/engine";
import { claudeAnswer } from "@/lib/claude";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const question = (body.question || "").trim();
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  const decisions = listDecisions();
  const local = answerQuestion(question, decisions);

  const apiKey = req.headers.get("x-user-anthropic-key") || "";
  if (apiKey && local.grounded) {
    const cited = local.citations
      .map((c) => decisions.find((d) => d.id === c.decisionId))
      .filter(Boolean);
    const liveAnswer = await claudeAnswer(
      apiKey,
      question,
      cited as NonNullable<(typeof cited)[number]>[]
    );
    if (liveAnswer) {
      return NextResponse.json({
        ...local,
        answer: liveAnswer,
        mode: "live",
      });
    }
  }

  return NextResponse.json(local);
}
