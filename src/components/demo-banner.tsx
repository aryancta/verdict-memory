"use client";

import Link from "next/link";
import { Info } from "lucide-react";

import { useApiKeys } from "@/components/providers/api-key-provider";

export function DemoBanner({ feature }: { feature: string }) {
  const { liveMode, loaded } = useApiKeys();
  if (!loaded || liveMode) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-foreground">
        Running on seeded memory. {feature} works right now from the demo
        dataset. Add your Claude API key in{" "}
        <Link href="/settings" className="font-medium text-primary underline">
          Settings
        </Link>{" "}
        to run the reasoning live.
      </p>
    </div>
  );
}
