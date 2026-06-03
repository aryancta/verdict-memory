export const STORAGE_KEY = "verdictmemory_api_keys";

export interface ApiKeys {
  anthropic: string;
  slackToken: string;
}

export const EMPTY_KEYS: ApiKeys = { anthropic: "", slackToken: "" };

export function readKeys(): ApiKeys {
  if (typeof window === "undefined") return EMPTY_KEYS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_KEYS;
    const parsed = JSON.parse(raw) as Partial<ApiKeys>;
    return {
      anthropic: parsed.anthropic ?? "",
      slackToken: parsed.slackToken ?? "",
    };
  } catch {
    return EMPTY_KEYS;
  }
}

export function writeKeys(keys: ApiKeys) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function clearKeys() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function authHeaders(keys: ApiKeys): Record<string, string> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (keys.anthropic) headers["x-user-anthropic-key"] = keys.anthropic;
  if (keys.slackToken) headers["x-user-slack-token"] = keys.slackToken;
  return headers;
}
