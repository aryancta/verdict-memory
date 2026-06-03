"use client";

import * as React from "react";

import {
  ApiKeys,
  EMPTY_KEYS,
  authHeaders,
  clearKeys,
  readKeys,
  writeKeys,
} from "@/lib/api-keys";

interface ApiKeyContextValue {
  keys: ApiKeys;
  loaded: boolean;
  hasAnthropic: boolean;
  hasSlack: boolean;
  liveMode: boolean;
  save: (keys: ApiKeys) => void;
  clear: () => void;
  headers: () => Record<string, string>;
}

const ApiKeyContext = React.createContext<ApiKeyContextValue | null>(null);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [keys, setKeys] = React.useState<ApiKeys>(EMPTY_KEYS);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setKeys(readKeys());
    setLoaded(true);
  }, []);

  const save = React.useCallback((next: ApiKeys) => {
    writeKeys(next);
    setKeys(next);
  }, []);

  const clear = React.useCallback(() => {
    clearKeys();
    setKeys(EMPTY_KEYS);
  }, []);

  const value: ApiKeyContextValue = React.useMemo(
    () => ({
      keys,
      loaded,
      hasAnthropic: Boolean(keys.anthropic),
      hasSlack: Boolean(keys.slackToken),
      liveMode: Boolean(keys.anthropic),
      save,
      clear,
      headers: () => authHeaders(keys),
    }),
    [keys, loaded, save, clear]
  );

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}

export function useApiKeys() {
  const ctx = React.useContext(ApiKeyContext);
  if (!ctx) {
    throw new Error("useApiKeys must be used within ApiKeyProvider");
  }
  return ctx;
}
