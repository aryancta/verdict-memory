import Link from "next/link";

import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Wordmark />
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <p className="max-w-sm text-muted-foreground">
          That page is not in memory. Let&rsquo;s get you back to the decisions
          that are.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="outline">Back home</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Open the app</Button>
        </Link>
      </div>
    </div>
  );
}
