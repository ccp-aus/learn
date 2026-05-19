import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Choice, choiceLabel, choiceRationale } from "@/lib/quiz";
import {
  SHELL_LABELS,
  SHELL_PROMPTS,
  type Shell,
  useShellPreference,
} from "@/lib/shell-preference";

/**
 * Per-shell variant of a step. When `variants` is present on a step,
 * the component picks the entry matching the visitor's current shell
 * preference (sticky across the session via localStorage) and renders
 * its choices/expected/response.
 */
export type ConsoleStepVariant = {
  /** Overrides the Console-level prompt for this step. Defaults to the
   *  preference-resolved prompt (e.g. "$ " for bash, "PS C:\\> " for PowerShell). */
  prompt?: string;
  /** Pick-the-command mode. Each entry can be `{ label, rationale }` —
   *  the rationale teaches the specific trap when the learner picks
   *  the lookalike (e.g., ping resolves the name but hides multi-A / CNAME). */
  choices?: Choice[];
  correctIndex?: number;
  /** Free-type mode. */
  expected?: string | RegExp;
  /** Hand-authored output shown after the learner answers correctly. */
  response: string;
};

export type ConsoleStep = ConsoleStepVariant & {
  /** Short context shown above the prompt. Shared across variants. */
  narration?: string;
  /** Optional teacher's note shown below the response. Shared across variants. */
  comment?: string;
  /**
   * Optional per-shell variants. Provide entries for any shells this
   * step applies to (typically bash + powershell + cmd). If a step has
   * a `variants` map, the top-level choices/expected/response on the
   * step are ignored. Missing-shell falls back to the first variant
   * declared so the learner never sees a broken step.
   */
  variants?: Partial<Record<Shell, ConsoleStepVariant>>;
};

interface Props {
  /** Fallback prompt when no variant or step-level prompt sets one. */
  prompt?: string;
  /** Window-title bar text. Cosmetic. */
  title?: string;
  steps: ConsoleStep[];
  className?: string;
}

function resolveStep(step: ConsoleStep, shell: Shell): ConsoleStepVariant {
  if (step.variants) {
    const v = step.variants[shell];
    if (v) return v;
    // Fall back to the first declared variant so the step is still usable.
    const first = Object.values(step.variants).find((x): x is ConsoleStepVariant => !!x);
    if (first) return first;
  }
  return {
    prompt: step.prompt,
    choices: step.choices,
    correctIndex: step.correctIndex,
    expected: step.expected,
    response: step.response ?? "",
  };
}

function matchExpected(input: string, expected: string | RegExp): boolean {
  const trimmed = input.trim();
  if (expected instanceof RegExp) return expected.test(trimmed);
  return trimmed.toLowerCase() === expected.trim().toLowerCase();
}

/**
 * Console — pretend shell. Walk the learner through a sequence of commands,
 * each step in one of two modes:
 *  - pick-the-command (active recall): present candidate commands; only
 *    one is right. Wrong picks display the per-choice rationale next to
 *    the chosen option so the learner learns the specific trap, not just
 *    "not that one."
 *  - free-type (finger memory): learner types into a fake prompt, the
 *    response renders when the input matches a string or RegExp.
 *
 * Steps can declare per-shell `variants` (bash, powershell, cmd). The
 * Console reads the visitor's `shellPreference` from localStorage and
 * surfaces a toggle in the header so they can switch any time. Other
 * Consoles on the same page stay in sync.
 *
 * The response is hand-authored — no backend, no sandbox.
 */
export function Console({ prompt: fallbackPrompt = "$ ", title, steps, className }: Props) {
  const [shell, setShell] = useShellPreference();

  const [stepIdx, setStepIdx] = React.useState(0);
  const [pick, setPick] = React.useState<number | null>(null);
  const [submittedPicks, setSubmittedPicks] = React.useState<number[]>([]);
  const [input, setInput] = React.useState("");
  const [shake, setShake] = React.useState(0);
  // Captured command + response per solved step so scrollback survives
  // shell changes and free-type → RegExp matches.
  const [history, setHistory] = React.useState<{ command: string; response: string }[]>([]);

  // Reset transient state when the active step changes OR the shell
  // changes (because the choices / expected pattern just swapped).
  React.useEffect(() => {
    setPick(null);
    setSubmittedPicks([]);
    setInput("");
  }, [stepIdx, shell]);

  const solved = steps.slice(0, stepIdx);
  const hasVariants = steps.some((s) => s.variants);

  return (
    <section
      className={cn(
        "my-6 overflow-hidden rounded-lg border border-border bg-zinc-950 text-zinc-100 shadow-sm",
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2 text-xs">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
          <span className="h-2 w-2 rounded-full bg-amber-500/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
        </span>
        <span className="font-mono text-zinc-400">{title ?? "terminal"}</span>
        {hasVariants && (
          <ShellToggle shell={shell} setShell={setShell} />
        )}
      </header>
      <div className="px-4 py-4 font-mono text-[13px] leading-relaxed">
        {solved.map((step, i) => (
          <SolvedRow
            key={i}
            narration={step.narration}
            comment={step.comment}
            prompt={
              // Use the recorded shell's prompt if we had one; otherwise
              // fall back to current shell or the Console-level prompt.
              steps[i].prompt ??
              SHELL_PROMPTS[shell] ??
              fallbackPrompt
            }
            command={history[i]?.command ?? ""}
            response={history[i]?.response ?? ""}
          />
        ))}

        {stepIdx < steps.length && (
          <CurrentRow
            // Bump the key on shell change so the row re-renders cleanly.
            key={`${stepIdx}-${shell}`}
            step={steps[stepIdx]}
            variant={resolveStep(steps[stepIdx], shell)}
            shellPrompt={SHELL_PROMPTS[shell]}
            fallbackPrompt={fallbackPrompt}
            pick={pick}
            setPick={setPick}
            submittedPicks={submittedPicks}
            input={input}
            setInput={setInput}
            shake={shake}
            onSubmit={() => {
              const variant = resolveStep(steps[stepIdx], shell);
              let correct = false;
              let captured = "";
              if (variant.choices && variant.correctIndex !== undefined) {
                correct = pick === variant.correctIndex;
                captured = pick !== null ? choiceLabel(variant.choices[pick]) : "";
                if (!correct && pick !== null) {
                  setSubmittedPicks((arr) =>
                    arr.includes(pick) ? arr : [...arr, pick],
                  );
                }
              } else if (variant.expected !== undefined) {
                correct = matchExpected(input, variant.expected);
                captured = input.trim();
              }
              if (correct) {
                setHistory((h) => {
                  const next = [...h];
                  next[stepIdx] = { command: captured, response: variant.response };
                  return next;
                });
                setStepIdx((i) => i + 1);
              } else {
                setShake((n) => n + 1);
              }
            }}
          />
        )}

        {stepIdx >= steps.length && (
          <div className="mt-2 text-[11px] uppercase tracking-widest text-emerald-400/80">
            Session complete
          </div>
        )}
      </div>
    </section>
  );
}

function ShellToggle({
  shell,
  setShell,
}: {
  shell: Shell;
  setShell: (s: Shell) => void;
}) {
  const shells: Shell[] = ["bash", "powershell", "cmd"];
  return (
    <div
      role="group"
      aria-label="Shell preference"
      className="ml-auto inline-flex items-center gap-0 rounded-md border border-white/10 bg-white/5 p-0.5"
    >
      {shells.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setShell(s)}
          aria-pressed={shell === s}
          className={cn(
            "rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest transition-colors",
            shell === s
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-zinc-400 hover:text-zinc-100",
          )}
        >
          {SHELL_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

function SolvedRow({
  narration,
  comment,
  prompt,
  command,
  response,
}: {
  narration?: string;
  comment?: string;
  prompt: string;
  command: string;
  response: string;
}) {
  return (
    <div className="mb-4">
      {narration && (
        <div className="mb-1 text-[11px] uppercase tracking-widest text-zinc-500">
          {narration}
        </div>
      )}
      <div>
        <span className="text-emerald-400/80">{prompt}</span>
        <span className="text-zinc-100">{command}</span>
      </div>
      <pre className="mt-1 whitespace-pre-wrap text-zinc-300/90">{response}</pre>
      {comment && (
        <div className="mt-1 text-[11px] italic text-zinc-500">{comment}</div>
      )}
    </div>
  );
}

function CurrentRow({
  step,
  variant,
  shellPrompt,
  fallbackPrompt,
  pick,
  setPick,
  submittedPicks,
  input,
  setInput,
  shake,
  onSubmit,
}: {
  step: ConsoleStep;
  variant: ConsoleStepVariant;
  shellPrompt: string;
  fallbackPrompt: string;
  pick: number | null;
  setPick: (n: number) => void;
  submittedPicks: number[];
  input: string;
  setInput: (s: string) => void;
  shake: number;
  onSubmit: () => void;
}) {
  const isChoiceMode = !!variant.choices && variant.correctIndex !== undefined;
  const canSubmit = isChoiceMode ? pick !== null : input.trim().length > 0;
  const prompt = variant.prompt ?? shellPrompt ?? fallbackPrompt;

  return (
    <div key={shake} className={cn(shake > 0 && "console-shake")}>
      {step.narration && (
        <div className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">
          {step.narration}
        </div>
      )}
      <div className="flex items-baseline">
        <span className="text-emerald-400/80">{prompt}</span>
        {isChoiceMode ? (
          <span className="ml-1 inline-flex items-center gap-1 text-zinc-500">
            <ChevronDown className="h-3 w-3" />
            <span className="text-[11px] uppercase tracking-widest">
              pick one
            </span>
          </span>
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) onSubmit();
            }}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            className="ml-1 flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
            placeholder="type a command…"
            aria-label="Command input"
          />
        )}
      </div>

      {isChoiceMode && (
        <div className="mt-2 grid gap-1.5">
          {variant.choices!.map((choice, i) => {
            const selected = pick === i;
            const isCorrect = i === variant.correctIndex;
            const wasTried = submittedPicks.includes(i);
            const rationale = choiceRationale(choice);
            const showRationale = wasTried && !isCorrect && rationale;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setPick(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded border px-3 py-1.5 text-left text-zinc-100 transition-colors",
                    selected
                      ? "border-emerald-500/60 bg-emerald-500/10"
                      : "border-white/10 hover:border-white/30",
                    wasTried &&
                      !isCorrect &&
                      "border-rose-500/60 bg-rose-500/10",
                  )}
                >
                  <span className="text-zinc-500">
                    {String.fromCharCode(65 + i)})
                  </span>
                  <span className="flex-1">{choiceLabel(choice)}</span>
                  {wasTried && isCorrect && (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  {wasTried && !isCorrect && (
                    <X className="h-3.5 w-3.5 text-rose-400" />
                  )}
                </button>
                {showRationale && (
                  <p className="ml-7 mt-1 text-[11px] leading-relaxed text-rose-300/90">
                    {rationale}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2 flex items-center justify-end gap-3">
        {submittedPicks.length > 0 && !isCorrectAlreadySolved(submittedPicks, variant.correctIndex) && (
          <span className="text-[11px] text-zinc-500">
            Pick another — see the explanation under your last try.
          </span>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="rounded bg-emerald-500 px-3 py-1 text-xs font-medium text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-40"
        >
          Run
        </button>
      </div>
    </div>
  );
}

function isCorrectAlreadySolved(
  submittedPicks: number[],
  correctIndex: number | undefined,
): boolean {
  return correctIndex !== undefined && submittedPicks.includes(correctIndex);
}

export default Console;
