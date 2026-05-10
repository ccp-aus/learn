import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { GitBranch, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  startId: string;
  nodes: DecisionNode[];
  className?: string;
}

const toneClasses: Record<string, string> = {
  neutral: "border-border bg-card",
  good: "border-emerald-500/40 bg-emerald-500/5",
  success: "border-emerald-500/40 bg-emerald-500/5",
  info: "border-sky-500/40 bg-sky-500/5",
  warn: "border-amber-500/40 bg-amber-500/5",
  bad: "border-rose-500/40 bg-rose-500/5",
};

export function DecisionTree({
  title,
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
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <GitBranch className="h-4 w-4 text-primary" />
          {title ?? "Triage flow"}
        </div>
        <div className="flex gap-1">
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
                <div className="mb-4 text-sm font-medium text-foreground">
                  {current.prompt}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {current.choices.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => choose(c.next)}
                      className="group flex items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-left text-sm transition-all hover:border-primary/50 hover:bg-primary/5"
                    >
                      <span>{c.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "rounded-md border-l-2 px-4 py-3",
                  toneClasses[current.tone ?? "neutral"],
                )}
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Outcome
                </div>
                <div className="text-sm font-semibold tracking-tight">
                  {current.label}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-foreground/85 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
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
