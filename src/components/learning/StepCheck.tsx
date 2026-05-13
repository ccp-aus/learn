import * as React from "react";
import { motion, useAnimationControls } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckType = "mcq" | "multi";

interface Props {
  /** Question prompt the learner has to answer to advance. */
  question: string;
  /** mcq = pick one, multi = pick all that apply. Defaults to mcq. */
  type?: CheckType;
  /** Choice strings, in display order. */
  choices: string[];
  /** Index (mcq) or indices (multi) of the correct answer(s). */
  correct: number | number[];
  /** Optional hint shown under the choices after a wrong submit. */
  hint?: string;
  /** Optional one-line explanation revealed after a correct submit. */
  explanation?: string;
}

/**
 * StepCheck — an inline quick-check inside a <Step>.
 *
 * Active recall, not assessment: the learner has to actually choose and
 * submit before the StepThrough lets them advance. Wrong answers give a
 * gentle shake and (optional) hint; correct answers lock the choices,
 * highlight the right ones, and dispatch a `step-challenge-solved` event
 * up the DOM so the parent <StepThrough client:load> re-enables its Next button.
 *
 * Communication is via DOM (data attribute + bubbling event) rather than
 * React context so it survives Astro 5's StaticHtml children pre-render.
 */
export function StepCheck({
  question,
  type = "mcq",
  choices,
  correct,
  hint,
  explanation,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();

  const correctSet = React.useMemo(
    () => (type === "mcq" ? [correct as number] : (correct as number[])),
    [type, correct],
  );

  const [picks, setPicks] = React.useState<number[]>([]);
  const [submitted, setSubmitted] = React.useState(false);
  const [solved, setSolved] = React.useState(false);

  const togglePick = (i: number) => {
    if (solved) return;
    setSubmitted(false);
    setPicks((p) => {
      if (type === "mcq") return [i];
      return p.includes(i) ? p.filter((x) => x !== i) : [...p, i];
    });
  };

  const submit = () => {
    setSubmitted(true);
    const isCorrect =
      picks.length === correctSet.length &&
      picks.every((p) => correctSet.includes(p));
    if (isCorrect) {
      setSolved(true);
      // Notification fires from the effect below — must wait for React to
      // commit `solved=true` so the data-step-challenge attribute is on the
      // DOM before <StepThrough> re-scans.
    } else {
      void controls.start({
        x: [0, -4, 4, -3, 3, 0],
        transition: { duration: 0.3 },
      });
    }
  };

  React.useEffect(() => {
    if (!solved) return;
    ref.current?.dispatchEvent(
      new CustomEvent("step-challenge-solved", {
        bubbles: true,
        composed: true,
      }),
    );
  }, [solved]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      data-step-challenge={solved ? "solved" : "pending"}
      className={cn(
        "mt-4 rounded-md border p-3 transition-colors",
        solved
          ? "border-emerald-500/50 bg-emerald-500/5"
          : submitted
            ? "border-destructive/40 bg-destructive/5"
            : "border-border bg-background/40",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Quick check
        </span>
        {type === "multi" && (
          <span className="text-[10px] text-muted-foreground">
            (select all that apply)
          </span>
        )}
      </div>
      <p className="mb-3 text-sm font-medium text-foreground">{question}</p>

      <div className="space-y-1.5" role="group" aria-label={question}>
        {choices.map((choice, i) => {
          const picked = picks.includes(i);
          const isCorrectChoice = correctSet.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => togglePick(i)}
              disabled={solved}
              aria-pressed={picked}
              className={cn(
                "flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-sm transition-colors",
                solved &&
                  isCorrectChoice &&
                  "border-emerald-500/50 bg-emerald-500/10 text-foreground",
                solved && !isCorrectChoice && "border-border opacity-50",
                !solved &&
                  submitted &&
                  picked &&
                  !isCorrectChoice &&
                  "border-destructive/60 bg-destructive/10 text-destructive",
                !solved &&
                  !submitted &&
                  picked &&
                  "border-primary bg-primary/10 text-foreground",
                !solved &&
                  !picked &&
                  "border-border text-foreground hover:border-primary/40 hover:bg-accent/40",
              )}
            >
              <span className="flex-1">{choice}</span>
              {solved && isCorrectChoice && (
                <Check className="h-4 w-4 text-emerald-500" />
              )}
              {!solved && submitted && picked && !isCorrectChoice && (
                <X className="h-4 w-4 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {!solved && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {submitted
              ? (hint ?? "Not quite — try again.")
              : type === "mcq"
                ? "Pick one."
                : "Pick all that apply."}
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={picks.length === 0}
            className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
          >
            Check
          </button>
        </div>
      )}

      {solved && (explanation || true) && (
        <p className="mt-3 text-xs text-foreground/80">
          <span className="font-semibold text-emerald-500">Correct.</span>
          {explanation ? ` ${explanation}` : ""}
        </p>
      )}
    </motion.div>
  );
}

export default StepCheck;
