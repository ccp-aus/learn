import * as React from "react";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepProps {
  /** Optional image displayed above the body. Path is relative to /public,
   *  or a full URL (vendor doc CDN, etc.). */
  image?: string;
  imageAlt?: string;
  title?: string;
  children: React.ReactNode;
}

/**
 * A single numbered step card. Renders inline as part of the SSR pass so
 * MDX content survives Astro's React-renderer pipeline (children are
 * pre-rendered into opaque StaticHtml; the parent can't introspect their
 * props at render time).
 */
export function Step({ image, imageAlt, title, children }: StepProps) {
  return (
    <li
      className={cn(
        "step-card relative grid grid-cols-[2.25rem_1fr] gap-4 transition-[filter,opacity] duration-200",
        // Numbered bubble via :before — sits centered on the connector rail
        // so each card "hangs off" the spine.
        "before:absolute before:left-0 before:top-2 before:flex before:h-9 before:w-9 before:items-center before:justify-center",
        "before:rounded-full before:bg-card before:font-mono before:text-xs before:font-semibold before:text-primary",
        "before:ring-4 before:ring-primary/15 before:[content:counter(step)]",
        // Hidden state: applied at runtime by <StepThrough> to defer cards
        // the learner hasn't reached yet via Continue. SSR/no-JS shows all.
        "data-[hidden=true]:hidden",
      )}
    >
      <div aria-hidden="true" />
      <div className="min-w-0 pt-1.5 pb-1">
        {title && (
          <h4 className="m-0 text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h4>
        )}
        {image && (
          <img
            src={image}
            alt={imageAlt ?? title ?? "Step illustration"}
            loading="lazy"
            decoding="async"
            className="mt-3 max-w-full rounded-md border border-border"
          />
        )}
        <div className="mt-1.5 text-sm leading-relaxed text-foreground/85 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </li>
  );
}
Step.displayName = "Step";

interface StepThroughProps {
  /** Optional heading shown above the steps. */
  title?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * StepThrough.
 *
 * Progressive-reveal vertical thread. Step 1 shows on hydration; the
 * learner clicks "Continue →" (or solves an inline <StepCheck>) to
 * reveal step 2, step 3, and so on. Previously-revealed steps stay
 * visible above so the learner can scroll back when later steps refer
 * to earlier work.
 *
 * Server-side / no-JS: every step renders. The page is a complete,
 * scannable, printable procedure. Hydration immediately defers steps
 * past the current `revealed` index by toggling `data-hidden` on each
 * card; the small flash before that runs is unavoidable on `client:load`
 * but typically imperceptible.
 *
 * Active recall: a Step containing a `<StepCheck>` with a pending
 * challenge keeps Continue disabled. The check fires a bubbling
 * `step-challenge-solved` event when answered correctly; this component
 * listens on its section ref and re-evaluates the gate.
 */
export function StepThrough({ title, className, children }: StepThroughProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const listRef = React.useRef<HTMLOListElement | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [revealed, setRevealed] = React.useState(1);
  const [currentBlocked, setCurrentBlocked] = React.useState(false);

  // Count the SSR-rendered cards once and switch to interactive mode.
  React.useEffect(() => {
    const cards = listRef.current?.querySelectorAll<HTMLElement>(".step-card");
    setTotal(cards?.length ?? 0);
    setHydrated(true);
  }, []);

  // Apply per-card `data-hidden`, `data-current`, and `data-completed` based
  // on the revealed count. Hidden cards are display:none (no layout space).
  // The current card is highlighted; previously-revealed cards are dimmed
  // and show a check rather than their step number. Reveal animation is in
  // CSS via @starting-style on data-hidden=false (see globals).
  React.useEffect(() => {
    if (!hydrated) return;
    const cards = listRef.current?.querySelectorAll<HTMLElement>(".step-card");
    cards?.forEach((card, i) => {
      const hidden = i >= revealed;
      const completed = i < revealed - 1;
      const current = i === revealed - 1;
      card.setAttribute("data-hidden", hidden ? "true" : "false");
      card.setAttribute("data-completed", completed ? "true" : "false");
      card.setAttribute("data-current", current ? "true" : "false");
    });
  }, [hydrated, revealed, total]);

  // Re-check whether the currently-visible last step has an unsolved
  // <StepCheck> inside it. Runs when `revealed` changes (new last step)
  // and when a child fires `step-challenge-solved`.
  const recompute = React.useCallback(() => {
    const cards = listRef.current?.querySelectorAll<HTMLElement>(".step-card");
    if (!cards || cards.length === 0 || revealed === 0) {
      setCurrentBlocked(false);
      return;
    }
    const last = cards[Math.min(revealed, cards.length) - 1];
    setCurrentBlocked(
      !!last?.querySelector('[data-step-challenge="pending"]'),
    );
  }, [revealed]);

  React.useEffect(() => {
    if (!hydrated) return;
    recompute();
  }, [hydrated, revealed, recompute]);

  React.useEffect(() => {
    if (!hydrated) return;
    const node = sectionRef.current;
    if (!node) return;
    const onSolved = () => recompute();
    node.addEventListener("step-challenge-solved", onSolved);
    return () => node.removeEventListener("step-challenge-solved", onSolved);
  }, [hydrated, recompute]);

  const advance = React.useCallback(() => {
    setRevealed((r) => Math.min(r + 1, total));
  }, [total]);

  // Keyboard: arrow-down or Enter while the section has focus advances.
  React.useEffect(() => {
    if (!hydrated) return;
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowDown" || e.key === "Enter") {
        if (currentBlocked || revealed >= total) return;
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hydrated, currentBlocked, revealed, total, advance]);

  const isComplete = hydrated && total > 0 && revealed >= total;
  const showContinue = hydrated && total > 0 && revealed < total;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "step-through @container/step-through my-8 rounded-xl border border-border bg-card/40 p-4 @sm/step-through:p-5",
        className,
      )}
      aria-roledescription="step-through walkthrough"
      tabIndex={hydrated ? 0 : undefined}
    >
      {(title || hydrated) && (
        <header className="mb-4 flex items-baseline justify-between gap-3 px-1">
          {title ? (
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {title}
            </span>
          ) : (
            <span />
          )}
          {hydrated && total > 0 && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {Math.min(revealed, total)} / {total}
            </span>
          )}
        </header>
      )}

      <ol
        ref={listRef}
        className={cn(
          "step-through-thread relative space-y-5 [counter-reset:step] [&_li.step-card]:[counter-increment:step]",
          // Vertical rail behind the bubbles. left-[1.125rem] = half of the
          // 2.25rem first column so the rail is centered on the bubbles.
          "before:absolute before:left-[1.125rem] before:top-3 before:bottom-3 before:w-px",
        )}
      >
        {children}
      </ol>

      {showContinue && (
        <footer className="mt-5 flex items-center justify-between gap-3 px-1">
          <span className="text-xs text-muted-foreground">
            {currentBlocked
              ? "Answer the check above to continue"
              : revealed === total - 1
                ? "One more step"
                : `${total - revealed} step${total - revealed === 1 ? "" : "s"} remaining`}
          </span>
          <Button
            size="sm"
            onClick={advance}
            disabled={currentBlocked}
            aria-label="Reveal next step"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        </footer>
      )}

      {isComplete && (
        <footer className="mt-5 flex items-center justify-end gap-2 px-1 text-xs text-muted-foreground">
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          Walkthrough complete
        </footer>
      )}
    </section>
  );
}

export default StepThrough;
