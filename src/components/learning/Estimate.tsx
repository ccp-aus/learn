import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  question: string;
  min: number;
  max: number;
  /** The "right" answer. Used to anchor intuition; learner is "close enough" within `tolerance`. */
  correct: number;
  /** Tolerance band as an absolute value (in the same units as min/max). Defaults to 10% of (max - min). */
  tolerance?: number;
  /** Step granularity for the slider. Default = (max - min) / 100. */
  step?: number;
  /** Display unit suffix, e.g. "ms", "GB", "tenants". */
  unit?: string;
  /** Logarithmic scale for orders-of-magnitude questions. Both min and max must be > 0. */
  scale?: "linear" | "log";
  explanation?: string;
  className?: string;
}

function formatNum(n: number): string {
  if (Math.abs(n) >= 1000) {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
    }).format(Math.round(n));
  }
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2);
}

/**
 * Estimate — slider question. Learner drags to commit to a guess, clicks
 * Reveal to see the right answer + explanation. Better than MCQ for
 * order-of-magnitude intuition: "how many DNS lookups per hour does a
 * 50-seat M365 tenant make?" — the slider forces a commitment in the
 * same units the technician has to think in.
 */
export function Estimate({
  question,
  min,
  max,
  correct,
  tolerance,
  step,
  unit,
  scale = "linear",
  explanation,
  className,
}: Props) {
  const tol = tolerance ?? (max - min) * 0.1;
  const isLog = scale === "log" && min > 0 && max > 0;
  const sliderMin = isLog ? Math.log10(min) : min;
  const sliderMax = isLog ? Math.log10(max) : max;
  const sliderStep = step ?? (sliderMax - sliderMin) / 100;
  const initial = isLog
    ? (Math.log10(min) + Math.log10(max)) / 2
    : (min + max) / 2;
  const [raw, setRaw] = React.useState(initial);
  const [revealed, setRevealed] = React.useState(false);
  const value = isLog ? Math.pow(10, raw) : raw;
  const delta = Math.abs(value - correct);
  const within = delta <= tol;

  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Estimate
      </div>
      <p className="text-sm font-medium text-foreground">{question}</p>
      <div className="mt-5">
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={raw}
          onChange={(e) => {
            if (revealed) return;
            setRaw(Number(e.target.value));
          }}
          disabled={revealed}
          className="w-full accent-primary disabled:opacity-60"
          aria-label={question}
        />
        <div className="mt-1 flex items-baseline justify-between text-xs text-muted-foreground">
          <span>
            {formatNum(min)} {unit ?? ""}
          </span>
          <span className="text-base font-semibold text-foreground tabular-nums">
            {formatNum(value)} {unit ?? ""}
          </span>
          <span>
            {formatNum(max)} {unit ?? ""}
          </span>
        </div>
      </div>

      {!revealed ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reveal
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "mt-4 rounded-md border-l-2 px-4 py-3 text-sm",
            within
              ? "border-emerald-500/60 bg-emerald-500/5"
              : "border-amber-500/60 bg-amber-500/5",
          )}
        >
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest">
            <span
              className={within ? "text-emerald-500" : "text-amber-500"}
            >
              {within ? "Close" : "Off"}
            </span>{" "}
            <span className="text-muted-foreground">
              Answer: {formatNum(correct)} {unit ?? ""}
            </span>
          </div>
          {explanation && (
            <p className="text-foreground/85 leading-relaxed">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Estimate;
