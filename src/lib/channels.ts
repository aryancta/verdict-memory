export const CHANNELS: Record<string, string> = {
  C01ENG: "#engineering",
  C02PRD: "#product",
  C03GRW: "#growth",
  C04DSN: "#design",
  C05OPS: "#ops",
};

export function channelLabel(id: string): string {
  return CHANNELS[id] ?? "#general";
}
