import type { Decision } from "./types";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-5";

interface ClaudeResult {
  text: string;
  ok: boolean;
}

async function callClaude(
  apiKey: string,
  system: string,
  user: string,
  maxTokens = 700
): Promise<ClaudeResult> {
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      return { text: "", ok: false };
    }
    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text =
      data.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .join("\n")
        .trim() ?? "";
    return { text, ok: text.length > 0 };
  } catch {
    return { text: "", ok: false };
  }
}

function decisionContext(decisions: Decision[]) {
  return decisions
    .map(
      (d, i) =>
        `[${i + 1}] ${d.title}\n  outcome: ${d.outcome}\n  decided by ${d.owner.name} on ${d.decidedAt}\n  rationale: ${d.rationale}\n  chose: ${d.chosen}; rejected: ${d.rejected.join(", ") || "none"}\n  source quote: "${d.sourceQuote}"`
    )
    .join("\n\n");
}

export async function claudeAnswer(
  apiKey: string,
  question: string,
  decisions: Decision[]
): Promise<string | null> {
  const system =
    "You are Verdict Memory, an organizational-memory agent inside Slack. Answer only from the decision records provided. Always name who decided, when, and why. Never invent facts. Keep it to 2-4 sentences, direct and plain. If the records do not cover the question, say so.";
  const user = `Decision records:\n\n${decisionContext(
    decisions
  )}\n\nQuestion: ${question}\n\nAnswer grounded strictly in the records above.`;
  const result = await callClaude(apiKey, system, user, 500);
  return result.ok ? result.text : null;
}

export async function claudeContradictionNote(
  apiKey: string,
  message: string,
  decision: Decision
): Promise<string | null> {
  const system =
    "You are Verdict Memory. In one or two plain sentences, explain to a teammate how their new message conflicts with a settled decision. Be gentle and specific. Do not invent details.";
  const user = `Settled decision: ${decision.title}. The team chose ${decision.chosen} over ${decision.rejected.join(", ")} because: ${decision.rationale}\n\nNew message in channel: "${message}"\n\nExplain the conflict.`;
  const result = await callClaude(apiKey, system, user, 250);
  return result.ok ? result.text : null;
}
