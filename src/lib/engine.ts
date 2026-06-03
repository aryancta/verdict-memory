import type {
  AskAnswer,
  AskCitation,
  CaptureCandidate,
  ContradictionHit,
  Decision,
} from "./types";

const STOPWORDS = new Set([
  "the", "a", "an", "to", "for", "of", "and", "or", "we", "our", "us", "is",
  "are", "be", "with", "on", "in", "it", "this", "that", "should", "would",
  "could", "do", "did", "does", "have", "has", "let", "lets", "just", "going",
  "go", "gonna", "next", "sprint", "everything", "thing", "things", "about",
  "why", "what", "when", "who", "how", "did", "was", "were", "i", "you",
]);

const ADOPT_VERBS = [
  "migrate to", "move to", "switch to", "switching to", "move everything to",
  "migrate everything to", "go with", "going with", "adopt", "use", "using",
  "pick", "choose", "rebuild on", "rewrite on", "swap to", "swap in",
  "move over to", "shift to", "standardize on",
];

const DROP_VERBS = [
  "drop", "dropping", "ditch", "ditching", "move off", "moving off",
  "replace", "replacing", "get rid of", "stop using", "kill", "killing",
  "rip out", "deprecate", "abandon", "walk back", "reverse",
];

const REVIVAL_HINTS = [
  "reconsider", "revisit", "rethink", "bring back", "again", "second look",
  "re-open", "reopen", "another look", "what if we", "should we still",
  "do we still", "maybe we should", "thinking about",
];

const DECISION_TRIGGERS = [
  "let's go with", "lets go with", "we're going with", "were going with",
  "final call", "decision:", "we decided", "we've decided", "weve decided",
  "let's ship", "lets ship", "we're dropping", "were dropping",
  "we are dropping", "we'll use", "well use", "let's use", "lets use",
  "going with", "agreed, we", "the call is", "we should go with",
  "let's just", "lets just", "i say we", "we are going with",
];

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(text: string) {
  return normalize(text)
    .split(" ")
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function phraseTerms(value: string): string[] {
  // turn "per-seat pricing" into useful match terms
  const base = normalize(value);
  const parts = base.split(" ").filter((p) => p.length > 2 && !STOPWORDS.has(p));
  return Array.from(new Set([base, ...parts, base.replace(/\s+/g, "")]));
}

function containsTerm(haystack: string, term: string) {
  const t = normalize(term);
  if (!t) return false;
  return haystack.includes(t);
}

function decisionTerms(d: Decision) {
  const chosen = phraseTerms(d.chosen);
  const rejected = d.rejected.flatMap(phraseTerms);
  const tags = d.tags.map(normalize);
  return { chosen, rejected, tags };
}

export function detectDecision(text: string): CaptureCandidate {
  const norm = normalize(text);
  const trigger = DECISION_TRIGGERS.find((t) => norm.includes(t));
  const adoptVerb = ADOPT_VERBS.find((v) => norm.includes(v));
  const dropVerb = DROP_VERBS.find((v) => norm.includes(v));

  const hasSignal = Boolean(trigger || adoptVerb || dropVerb);
  if (!hasSignal) {
    return {
      detected: false,
      confidence: 0.18,
      suggestedTitle: "",
      suggestedOutcome: "",
      suggestedTopic: "",
      suggestedChosen: "",
      suggestedRejected: [],
      suggestedRationale: "",
      triggerPhrase: "",
    };
  }

  // pull the option referenced after the verb / trigger
  const keyTokens = tokens(text);
  const chosen = extractOption(norm, adoptVerb) ?? keyTokens.slice(-3).join(" ");
  const rejected = dropVerb ? [extractOption(norm, dropVerb) ?? ""] : [];

  let confidence = 0.45;
  if (trigger) confidence += 0.28;
  if (adoptVerb || dropVerb) confidence += 0.18;
  confidence = Math.min(confidence, 0.95);

  const topic = guessTopic(keyTokens);
  const title = toTitle(chosen, dropVerb ? "drop" : "adopt");

  return {
    detected: true,
    confidence,
    suggestedTitle: title,
    suggestedOutcome: dropVerb
      ? `Stop using ${cap(chosen)}`
      : `Adopt ${cap(chosen)}`,
    suggestedTopic: topic,
    suggestedChosen: chosen,
    suggestedRejected: rejected.filter(Boolean),
    suggestedRationale: "",
    triggerPhrase: trigger ?? adoptVerb ?? dropVerb ?? "",
  };
}

function extractOption(norm: string, verb?: string): string | null {
  if (!verb) return null;
  const idx = norm.indexOf(verb);
  if (idx === -1) return null;
  const after = norm.slice(idx + verb.length).trim();
  const words = after.split(" ").filter((w) => !STOPWORDS.has(w) && w.length > 1);
  return words.slice(0, 2).join(" ") || null;
}

function guessTopic(keyTokens: string[]): string {
  const map: Record<string, string> = {
    mongodb: "database", postgres: "database", postgresql: "database",
    database: "database", db: "database", dynamodb: "database",
    pricing: "pricing", seat: "pricing", "usage-based": "pricing",
    auth: "authentication", clerk: "authentication", auth0: "authentication",
    mobile: "mobile", native: "mobile", pwa: "mobile",
    analytics: "analytics", posthog: "analytics", mixpanel: "analytics",
    intercom: "support tooling", zendesk: "support tooling",
    vercel: "infrastructure", kubernetes: "infrastructure", aws: "infrastructure",
    design: "design system", tailwind: "design system",
  };
  for (const t of keyTokens) {
    if (map[t]) return map[t];
  }
  return keyTokens[0] ?? "general";
}

function toTitle(option: string, kind: "adopt" | "drop") {
  const o = cap(option);
  return kind === "drop" ? `Move off ${o}` : `Go with ${o}`;
}

function cap(s: string) {
  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function findContradictions(
  text: string,
  decisions: Decision[]
): ContradictionHit[] {
  const norm = normalize(text);
  const adoptVerb = ADOPT_VERBS.some((v) => norm.includes(v));
  const dropVerb = DROP_VERBS.some((v) => norm.includes(v));
  const revivalHint = REVIVAL_HINTS.some((v) => norm.includes(v));

  const hits: ContradictionHit[] = [];

  for (const d of decisions) {
    if (d.status === "superseded") continue;
    const { chosen, rejected, tags } = decisionTerms(d);

    const mentionsRejected = rejected.filter((t) => containsTerm(norm, t));
    const mentionsChosen = chosen.filter((t) => containsTerm(norm, t));
    const mentionsTopic = tags.filter((t) => containsTerm(norm, t));

    // Reversal: the new message proposes adopting something this decision
    // explicitly rejected, or proposes dropping what this decision chose.
    const reversalByRejected = mentionsRejected.length > 0;
    const reversalByDrop = dropVerb && mentionsChosen.length > 0;

    if (reversalByRejected || reversalByDrop) {
      const matched = Array.from(
        new Set([...mentionsRejected, ...mentionsChosen, ...mentionsTopic])
      ).slice(0, 4);
      hits.push({
        decision: d,
        conflictType: "reversal",
        matchedTerms: matched,
        severity: "high",
        explanation: reversalByRejected
          ? `This points back toward ${cap(mentionsRejected[0])}, which the team explicitly rejected when it chose ${cap(d.chosen)}.`
          : `This proposes moving off ${cap(d.chosen)}, the option the team committed to.`,
      });
      continue;
    }

    // Revival: same topic resurfaces with reopen language, no clear new winner.
    if (mentionsTopic.length > 0 && (revivalHint || adoptVerb || dropVerb)) {
      hits.push({
        decision: d,
        conflictType: "revival",
        matchedTerms: Array.from(new Set([...mentionsTopic, ...mentionsChosen])).slice(0, 4),
        severity: "medium",
        explanation: `This reopens the ${d.topic} question the team already settled on ${cap(d.chosen)}.`,
      });
    }
  }

  // strongest first
  return hits.sort((a, b) => {
    const order = { high: 0, medium: 1 } as const;
    return order[a.severity] - order[b.severity];
  });
}

export function answerQuestion(
  question: string,
  decisions: Decision[]
): AskAnswer {
  const qTokens = tokens(question);
  const scored = decisions
    .map((d) => {
      const hay = normalize(
        [d.title, d.outcome, d.rationale, d.chosen, ...d.rejected, ...d.tags].join(" ")
      );
      let score = 0;
      for (const t of qTokens) {
        if (hay.includes(t)) score += 1;
        if (d.tags.map(normalize).includes(t)) score += 1.5;
        if (normalize(d.chosen).includes(t)) score += 1.5;
      }
      return { d, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      answer:
        "I could not find a logged decision that matches that yet. Try asking about the database, pricing, auth, analytics, hosting, support tooling, or mobile, or capture the decision first so it becomes part of memory.",
      grounded: false,
      citations: [],
      mode: "demo",
    };
  }

  const top = scored.slice(0, 3).map((s) => s.d);
  const lead = top[0];
  const citations: AskCitation[] = top.map((d) => ({
    decisionId: d.id,
    title: d.title,
    owner: d.owner.name,
    decidedAt: d.decidedAt,
    channel: channelName(d.channel),
    permalink: d.permalink,
    quote: d.sourceQuote,
  }));

  const answer = `${lead.owner.name} (${lead.owner.role}) made the call on ${formatShort(
    lead.decidedAt
  )}: ${lead.outcome}. The reasoning was: ${lead.rationale} ${
    lead.rejected.length
      ? `The team considered and set aside ${lead.rejected.map(cap).join(", ")}.`
      : ""
  }`.trim();

  return {
    answer,
    grounded: true,
    citations,
    mode: "demo",
  };
}

export function channelName(id: string): string {
  const map: Record<string, string> = {
    C01ENG: "#engineering",
    C02PRD: "#product",
    C03GRW: "#growth",
    C04DSN: "#design",
    C05OPS: "#ops",
  };
  return map[id] ?? "#general";
}

function formatShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
