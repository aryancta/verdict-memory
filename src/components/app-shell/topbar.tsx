"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Radio } from "lucide-react";

import { Wordmark } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApiKeys } from "@/components/providers/api-key-provider";
import { NAV_ITEMS } from "@/lib/nav";

export function Topbar() {
  const pathname = usePathname();
  const { liveMode, loaded } = useApiKeys();
  const current = NAV_ITEMS.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/")
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            {NAV_ITEMS.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/" aria-label="Home">
          <Wordmark className="text-sm" />
        </Link>
      </div>

      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold tracking-tight">
          {current?.label ?? "Verdict Memory"}
        </h1>
        {current ? (
          <p className="text-xs text-muted-foreground">{current.description}</p>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings">
              {loaded && liveMode ? (
                <Badge variant="success" className="gap-1.5">
                  <Radio className="h-3 w-3" />
                  Live mode
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1.5">
                  <Radio className="h-3 w-3" />
                  Demo mode
                </Badge>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            {liveMode
              ? "Claude key detected. Answers run live."
              : "Add a Claude key in Settings for live reasoning."}
          </TooltipContent>
        </Tooltip>
        <Link href="/simulator" className="hidden sm:block">
          <Button size="sm">Open live channel</Button>
        </Link>
      </div>
    </header>
  );
}
