import * as React from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  /** Audience pill, e.g. "On-call only" or "Helpdesk L1". Cosmetic. */
  audience?: string;
  className?: string;
  /** Expects <Step> children (same Step component as StepThrough). */
  children: React.ReactNode;
}

/**
 * Runbook — non-progressive, all-at-once numbered procedure. Different
 * mental model from StepThrough: this is a reference, not a tutorial.
 * Reuses the existing <Step> component so the numbered bubble and shape
 * stay consistent.
 *
 * Server-side renderable; no client:load needed. Step's `data-hidden`
 * attribute defaults to absent here (StepThrough is what flips it on),
 * so every step is visible in both SSR and hydrated views.
 */
export function Runbook({ title, audience, className, children }: Props) {
  return (
    <section
      className={cn(
        "my-8 rounded-xl border border-dashed border-border bg-card/60 px-5 py-5",
        className,
      )}
      aria-roledescription="runbook"
    >
      <header className="mb-4 flex items-center gap-3 border-b border-border/60 pb-3">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold tracking-tight">
          {title ?? "Runbook"}
        </h3>
        {audience && (
          <span className="ml-auto rounded bg-foreground/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-foreground/70">
            {audience}
          </span>
        )}
      </header>
      <ol className="step-list space-y-5 [counter-reset:step]">{children}</ol>
    </section>
  );
}

export default Runbook;
