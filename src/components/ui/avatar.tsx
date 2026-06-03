import * as React from "react";

import { cn } from "@/lib/utils";

const palette = [
  "bg-[#611f69] text-white",
  "bg-[#1264a3] text-white",
  "bg-[#2eb67d] text-white",
  "bg-[#e01e5a] text-white",
  "bg-[#ecb22e] text-[#3a2a05]",
  "bg-[#4a154b] text-white",
];

function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({
  name,
  text,
  className,
}: {
  name: string;
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md text-xs font-semibold",
        colorFor(name),
        className
      )}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
