"use client";

import * as React from "react";
import { Check, Eye, EyeOff, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useApiKeys } from "@/components/providers/api-key-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { keys, save, clear, loaded, liveMode } = useApiKeys();
  const [anthropic, setAnthropic] = React.useState("");
  const [slackToken, setSlackToken] = React.useState("");
  const [showAnthropic, setShowAnthropic] = React.useState(false);
  const [showSlack, setShowSlack] = React.useState(false);

  React.useEffect(() => {
    if (loaded) {
      setAnthropic(keys.anthropic);
      setSlackToken(keys.slackToken);
    }
  }, [loaded, keys]);

  function onSave() {
    save({ anthropic: anthropic.trim(), slackToken: slackToken.trim() });
    toast.success("Saved to this browser", {
      description: "Keys live in localStorage only and never touch our server.",
    });
  }

  function onClear() {
    clear();
    setAnthropic("");
    setSlackToken("");
    toast("Cleared", { description: "Keys removed from this browser." });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Bring your own keys to run the reasoning live. Everything works in
          demo mode without them.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border bg-accent/40 p-4 text-sm">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-medium text-foreground">Your keys stay yours</p>
          <p className="text-muted-foreground">
            Keys are stored in this browser under{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              verdictmemory_api_keys
            </code>
            . They are sent only as request headers to call the provider
            directly, never written to disk or logged on our side.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-primary" />
              Anthropic Claude
            </CardTitle>
            <Badge variant={liveMode ? "success" : "muted"}>
              {liveMode ? "Live" : "Demo"}
            </Badge>
          </div>
          <CardDescription>
            Powers decision detection, contradiction reasoning, and grounded
            answers. Sponsored framework for this hackathon - leave blank to run
            in demo mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="anthropic">API key</Label>
            <div className="relative">
              <Input
                id="anthropic"
                name="anthropic"
                type={showAnthropic ? "text" : "password"}
                value={anthropic}
                onChange={(e) => setAnthropic(e.target.value)}
                placeholder="sk-ant-..."
                className="pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowAnthropic((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showAnthropic ? "Hide key" : "Show key"}
              >
                {showAnthropic ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Get a free key at{" "}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-primary underline"
            >
              console.anthropic.com
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4 text-primary" />
            Slack user token
          </CardTitle>
          <CardDescription>
            Optional. A user token with search:read scopes lets the Real-Time
            Search API pull live thread context, with Slack permissions enforced
            automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="slack">Token</Label>
            <div className="relative">
              <Input
                id="slack"
                name="slack"
                type={showSlack ? "text" : "password"}
                value={slackToken}
                onChange={(e) => setSlackToken(e.target.value)}
                placeholder="xoxp-..."
                className="pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSlack((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showSlack ? "Hide token" : "Show token"}
              >
                {showSlack ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Read the setup at{" "}
            <a
              href="https://docs.slack.dev/apis/web-api/real-time-search-api/"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-primary underline"
            >
              the Real-Time Search API docs
            </a>
          </p>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onSave}>
          <Check className="h-4 w-4" />
          Save keys
        </Button>
        <Button variant="outline" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
          Clear keys
        </Button>
        <span className="text-xs text-muted-foreground">
          Saved locally on this device only.
        </span>
      </div>
    </div>
  );
}
