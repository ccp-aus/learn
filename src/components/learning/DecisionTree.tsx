import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { GitBranch, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { shuffle } from "@/lib/quiz";

/**
 * DecisionTree takes its tree as a `nodes` config prop.
 *
 * Why config-prop, not children? Astro 5's React renderer pre-renders any
 * React-component children into an opaque StaticHtml blob before the parent
 * component sees them, which makes the marker pattern
 * (`<DecisionTree><Question/><Choice/><Outcome/></DecisionTree>`) impossible
 * to resolve server-side. Same constraint that made us redesign StepThrough.
 *
 * Outcome bodies are React.ReactNode, so MDX authors can still embed JSX inside
 * them by writing the prop value as `<>plain prose with <strong>JSX</strong></>`
 * if they need richer content.
 *
 * Authoring discipline — the card is self-contained:
 *
 *   Lead-in framing belongs INSIDE the card. Use `title` for the card's name
 *   (e.g. "The is-it-in-the-Recommendation test") and `description` for the
 *   one- or two-sentence scenario setup that used to live in a paragraph
 *   immediately above the card. Don't put a setup paragraph immediately
 *   before the <DecisionTree> — push it into `description` instead, so the
 *   card stands on its own and the rendered page doesn't read as "prose,
 *   then a duplicated reframing inside a box."
 *
 *   <DecisionTree
 *     client:load
 *     title="The is-it-in-the-Recommendation test"
 *     description="Before any action, ask the question below. The tree exists
 *       to keep the 'yes-but' rationalisation out."
 *     startId="root"
 *     nodes={[ ... ]}
 *   />
 */

export type ChoiceConfig = {
  label: string;
  next: string;
};

export type DecisionNode =
  | {
      type: "question";
      id: string;
      prompt: React.ReactNode;
      choices: ChoiceConfig[];
    }
  | {
      type: "outcome";
      id: string;
      label: string;
      tone?: "neutral" | "good" | "bad" | "info" | "warn" | "success";
      body: React.ReactNode;
    };

interface DecisionTreeProps {
  title?: string;
  description?: React.ReactNode;
  startId: string;
  nodes: DecisionNode[];
  className?: string;
}

// Outcome card visual treatment: a 4px solid left stripe in the tone colour,
// plus a desaturated, low-opacity tint of the same hue for the card body so
// the text stays high-contrast. The whole-card saturated fills were too loud
// and the wrong-choice text in particular read as red-on-red.
const toneClasses: Record<string, string> = {
  neutral: "border-l-border bg-muted/30",
  good: "border-l-emerald-500 bg-emerald-500/[0.06]",
  success: "border-l-emerald-500 bg-emerald-500/[0.06]",
  info: "border-l-sky-500 bg-sky-500/[0.06]",
  warn: "border-l-amber-500 bg-amber-500/[0.06]",
  bad: "border-l-rose-500 bg-rose-500/[0.06]",
};

const toneLabelClasses: Record<string, string> = {
  neutral: "text-foreground",
  good: "text-emerald-700 dark:text-emerald-300",
  success: "text-emerald-700 dark:text-emerald-300",
  info: "text-sky-700 dark:text-sky-300",
  warn: "text-amber-700 dark:text-amber-300",
  bad: "text-rose-700 dark:text-rose-300",
};

export function DecisionTree({
  title,
  description,
  startId,
  nodes,
  className,
}: DecisionTreeProps) {
  const map = React.useMemo(() => {
    const m = new Map<string, DecisionNode>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  const [path, setPath] = React.useState<string[]>([startId]);
  const currentId = path[path.length - 1];
  const current = map.get(currentId);

  // Shuffle question choices per-node so the same right answer isn't always
  // in the same position. Stable for the lifetime of a given node visit.
  const shuffledChoices = React.useMemo(() => {
    if (!current || current.type !== "question") return [];
    return shuffle(current.choices.slice());
  }, [currentId, current]);

  const choose = (nextId: string) => {
    if (!map.has(nextId)) return;
    setPath((p) => [...p, nextId]);
  };

  const restart = () => setPath([startId]);
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));

  if (!current) {
    return (
      <div className="my-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
        DecisionTree: unknown node id <code>{currentId}</code>.
      </div>
    );
  }

  return (
    <section
      className={cn(
        "my-8 rounded-xl border border-border bg-card",
        className,
      )}
      aria-roledescription="branching decision tree"
    >
      <header className="border-b border-border px-5 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <GitBranch className="h-4 w-4 shrink-0 text-primary" />
            {title ?? "Triage flow"}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={back}
              disabled={path.length === 1}
            >
              Back
            </Button>
            <Button size="sm" variant="ghost" onClick={restart}>
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </Button>
          </div>
        </div>
        {description && (
          <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {description}
          </div>
        )}
      </header>

      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {current.type === "question" ? (
              <div>
                <div className="mb-4 text-base font-medium leading-relaxed text-foreground">
                  {current.prompt}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {shuffledChoices.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => choose(c.next)}
                      className="group flex items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-left text-base leading-relaxed transition-all hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <span>{c.label}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "rounded-md border-l-4 px-4 py-3",
                  toneClasses[current.tone ?? "neutral"],
                )}
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Outcome
                </div>
                <div
                  className={cn(
                    "text-base font-bold tracking-tight",
                    toneLabelClasses[current.tone ?? "neutral"],
                  )}
                >
                  {current.label}
                </div>
                <div className="mt-2 text-base leading-relaxed text-foreground [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                  {current.body}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {path.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
            <span className="uppercase tracking-wider">Path:</span>
            {path.map((id, idx) => {
              const n = map.get(id);
              if (!n) return null;
              const label = n.type === "question" ? `Q${idx + 1}` : n.label;
              return (
                <React.Fragment key={`${id}-${idx}`}>
                  {idx > 0 && <span>→</span>}
                  <span className="rounded bg-muted px-1.5 py-0.5">
                    {label}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default DecisionTree;
