import Link from "next/link";

import { Wordmark } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/40">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs space-y-3">
          <Wordmark />
          <p className="text-sm text-muted-foreground">
            The Slack agent that remembers every decision your team makes and
            warns you before you contradict one.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <FooterCol title="Product">
            <FooterLink href="/dashboard">Decision memory</FooterLink>
            <FooterLink href="/simulator">Live channel</FooterLink>
            <FooterLink href="/ask">Ask memory</FooterLink>
          </FooterCol>
          <FooterCol title="Stay current">
            <FooterLink href="/alerts">Contradiction alerts</FooterLink>
            <FooterLink href="/digest">Weekly digest</FooterLink>
            <FooterLink href="/settings">Settings</FooterLink>
          </FooterCol>
          <FooterCol title="Built on">
            <ExternalLink href="https://docs.slack.dev/apis/web-api/real-time-search-api/">
              Real-Time Search API
            </ExternalLink>
            <ExternalLink href="https://docs.slack.dev/ai/">
              Slack MCP Server
            </ExternalLink>
            <ExternalLink href="https://console.anthropic.com/">
              Claude
            </ExternalLink>
          </FooterCol>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs text-muted-foreground">
          Built for the Slack Agent Builder Challenge. Decision content stays in
          Slack; only metadata and provenance are indexed.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="font-medium text-foreground">{title}</div>
      <ul className="space-y-2 text-muted-foreground">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-foreground">
        {children}
      </Link>
    </li>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="hover:text-foreground"
      >
        {children}
      </a>
    </li>
  );
}
