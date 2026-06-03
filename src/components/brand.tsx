import * as React from "react";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="hsl(280 64% 30%)" />
      <path
        d="M9 16.5l4.2 4.2L23 11"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="11.2" stroke="white" strokeOpacity="0.25" strokeWidth="1.4" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-semibold", className)}>
      <Logo />
      <span className="text-base tracking-tight">
        Verdict<span className="text-primary"> Memory</span>
      </span>
    </span>
  );
}
