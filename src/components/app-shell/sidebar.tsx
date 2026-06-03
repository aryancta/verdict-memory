"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Wordmark } from "@/components/brand";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card/60 lg:flex">
      <div className="flex h-16 items-center border-b px-5">
        <Link href="/" aria-label="Verdict Memory home">
          <Wordmark />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="flex flex-col">
                <span className="font-medium leading-tight">{item.label}</span>
                <span
                  className={cn(
                    "text-xs leading-tight",
                    active ? "text-primary-foreground/75" : "text-muted-foreground/80"
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="rounded-lg bg-accent/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Grounded in Slack</p>
          <p className="mt-1 leading-relaxed">
            Answers and alerts cite the real thread via the Real-Time Search API,
            and only ever show what you can already see.
          </p>
        </div>
      </div>
    </aside>
  );
}
