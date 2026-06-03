import type { Decision } from "./types";
import { SEED_DECISIONS } from "./seed";

// In-memory store seeded on first import. Decision content stays here for the
// demo; in production this metadata would live in Postgres while message text
// stays in Slack per platform terms.
type Store = {
  decisions: Decision[];
};

const globalForStore = globalThis as unknown as {
  __verdictStore?: Store;
};

function createStore(): Store {
  return {
    decisions: SEED_DECISIONS.map((d) => ({ ...d })),
  };
}

export function getStore(): Store {
  if (!globalForStore.__verdictStore) {
    globalForStore.__verdictStore = createStore();
  }
  return globalForStore.__verdictStore;
}

export function listDecisions(): Decision[] {
  return [...getStore().decisions].sort(
    (a, b) => new Date(b.decidedAt).getTime() - new Date(a.decidedAt).getTime()
  );
}

export function getDecision(id: string): Decision | undefined {
  return getStore().decisions.find((d) => d.id === id);
}

export function addDecision(d: Decision): Decision {
  getStore().decisions.unshift(d);
  return d;
}

export function updateDecisionStatus(
  id: string,
  status: Decision["status"]
): Decision | undefined {
  const d = getDecision(id);
  if (d) d.status = status;
  return d;
}

export function resetStore() {
  globalForStore.__verdictStore = createStore();
}
