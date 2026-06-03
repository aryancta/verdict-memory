"use client";

import Link from "next/link";

import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label="Verdict Memory home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/simulator" className="hover:text-foreground">
            Live demo
          </Link>
          <Link href="/ask" className="hover:text-foreground">
            Ask memory
          </Link>
          <Link href="/digest" className="hover:text-foreground">
            Digest
          </Link>
          <Link href="/settings" className="hover:text-foreground">
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Open the app</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
