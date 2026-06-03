export type DecisionStatus = "active" | "superseded" | "stale" | "revisiting";

export interface Person {
  name: string;
  role: string;
}

export interface Decision {
  id: string;
  title: string;
  topic: string;
  outcome: string;
  chosen: string;
  rejected: string[];
  rationale: string;
  owner: Person;
  stakeholders: Person[];
  status: DecisionStatus;
  decidedAt: string;
  channel: string;
  permalink: string;
  tags: string[];
  confidence: number;
  sourceQuote: string;
  supersededBy?: string;
}

export interface ContradictionHit {
  decision: Decision;
  conflictType: "reversal" | "revival";
  matchedTerms: string[];
  explanation: string;
  severity: "high" | "medium";
}

export interface CaptureCandidate {
  detected: boolean;
  confidence: number;
  suggestedTitle: string;
  suggestedOutcome: string;
  suggestedTopic: string;
  suggestedChosen: string;
  suggestedRejected: string[];
  suggestedRationale: string;
  triggerPhrase: string;
}

export interface AskCitation {
  decisionId: string;
  title: string;
  owner: string;
  decidedAt: string;
  channel: string;
  permalink: string;
  quote: string;
}

export interface AskAnswer {
  answer: string;
  grounded: boolean;
  citations: AskCitation[];
  mode: "live" | "demo";
}

export interface DigestEntry {
  decision: Decision;
  note: string;
}

export interface DigestData {
  weekOf: string;
  newDecisions: DigestEntry[];
  staleDecisions: DigestEntry[];
  activeContradictionWatch: number;
}
