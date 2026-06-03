"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TEAM } from "@/lib/seed";
import { CHANNELS } from "@/lib/channels";
import type { Decision } from "@/lib/types";

const PEOPLE = Object.values(TEAM);

export function LogDecisionDialog({
  onCreated,
  trigger,
}: {
  onCreated?: (d: Decision) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    topic: "",
    outcome: "",
    chosen: "",
    rejected: "",
    rationale: "",
    ownerName: PEOPLE[0].name,
    channel: "C01ENG",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.title.trim() || !form.outcome.trim()) {
      toast.error("Add a title and an outcome first.");
      return;
    }
    setSubmitting(true);
    const owner = PEOPLE.find((p) => p.name === form.ownerName) ?? PEOPLE[0];
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          topic: form.topic || "general",
          outcome: form.outcome,
          chosen: form.chosen,
          rejected: form.rejected
            ? form.rejected.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          rationale: form.rationale,
          owner,
          channel: form.channel,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = (await res.json()) as { decision: Decision };
      toast.success("Decision logged to memory", {
        description: `${data.decision.title} is now searchable with full provenance.`,
      });
      onCreated?.(data.decision);
      setOpen(false);
      setForm({
        title: "",
        topic: "",
        outcome: "",
        chosen: "",
        rejected: "",
        rationale: "",
        ownerName: PEOPLE[0].name,
        channel: "C01ENG",
      });
    } catch {
      toast.error("Could not save the decision. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            Log a decision
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log a decision</DialogTitle>
          <DialogDescription>
            Capture the call with its owner and reasoning so memory can cite it
            later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Title">
            <Input
              name="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Use PostgreSQL as the primary datastore"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Topic">
              <Input
                value={form.topic}
                onChange={(e) => set("topic", e.target.value)}
                placeholder="database"
              />
            </Field>
            <Field label="Owner">
              <Select
                value={form.ownerName}
                onValueChange={(v) => set("ownerName", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PEOPLE.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Outcome">
            <Input
              value={form.outcome}
              onChange={(e) => set("outcome", e.target.value)}
              placeholder="PostgreSQL over MongoDB for core data"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Chosen">
              <Input
                value={form.chosen}
                onChange={(e) => set("chosen", e.target.value)}
                placeholder="postgresql"
              />
            </Field>
            <Field label="Set aside (comma separated)">
              <Input
                value={form.rejected}
                onChange={(e) => set("rejected", e.target.value)}
                placeholder="mongodb, dynamodb"
              />
            </Field>
          </div>
          <Field label="Channel">
            <Select value={form.channel} onValueChange={(v) => set("channel", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHANNELS).map(([id, label]) => (
                  <SelectItem key={id} value={id}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Why">
            <Textarea
              value={form.rationale}
              onChange={(e) => set("rationale", e.target.value)}
              placeholder="The reasoning behind the call."
              rows={3}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "Saving..." : "Save to memory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
