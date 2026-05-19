import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type CodeMark = {
  /** Single line number (1-indexed), or omit and use `lines` for a range. */
  line?: number;
  /** Inclusive [start, end] range. Takes precedence over `line` when present. */
  lines?: [number, number];
  /** Short marker text, typically "1" "2" "3". */
  label: string | number;
  title?: string;
  purpose?: string;
  /** Long-form body shown inside the popover. */
  body?: string;
  tone?: "primary" | "warning" | "success";
};

interface Props {
  /** Source as a single string. Lines are split on \n. */
  code: string;
  /** Hint for the gutter chrome (e.g., "bash", "ini", "json"). Cosmetic only — no Shiki here. */
  lang?: string;
  /** Filename or section label shown above the block. */
  filename?: string;
  /** Marker list — config-prop, not children, so they survive StaticHtml pre-render. */
  marks?: CodeMark[];
  className?: string;
}

const toneClasses: Record<NonNullable<CodeMark["tone"]>, string> = {
  primary: "bg-primary text-primary-foreground ring-primary/30",
  warning: "bg-amber-500 text-white ring-amber-500/30",
  success: "bg-emerald-500 text-white ring-emerald-500/30",
};

const toneLineBg: Record<NonNullable<CodeMark["tone"]>, string> = {
  primary: "bg-primary/8",
  warning: "bg-amber-500/8",
  success: "bg-emerald-500/8",
};

/**
 * AnnotatedCode — Hotspot for text. Renders a code/log block with line
 * numbers; configured `marks` attach a clickable marker to specific lines
 * (or line ranges) and open a popover with the explanation. Use for SIP
 * traces, PowerShell errors, DNS answers, config diffs without diff
 * semantics, anywhere a tech needs to "look at line N".
 *
 * Same tone enum as `Hotspot` (primary | warning | success). Other values
 * render unstyled, matching the existing convention.
 *
 * Marks live as a config prop (not children) for the same reason
 * DecisionTree does: nested React children get pre-rendered into opaque
 * StaticHtml before the parent component can introspect them.
 */
export function AnnotatedCode({
  code,
  lang,
  filename,
  marks = [],
  className,
}: Props) {
  const lines = React.useMemo(() => code.replace(/\r\n/g, "\n").split("\n"), [
    code,
  ]);

  // Build a line → mark[] map for quick lookup during render.
  const marksByLine = React.useMemo(() => {
    const m = new Map<number, CodeMark[]>();
    for (const mark of marks) {
      const [start, end] = mark.lines ?? [mark.line ?? 0, mark.line ?? 0];
      for (let n = start; n <= end; n++) {
        const list = m.get(n) ?? [];
        list.push(mark);
        m.set(n, list);
      }
    }
    return m;
  }, [marks]);

  return (
    <figure
      className={cn(
        "my-6 overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      {(filename || lang) && (
        <header className="flex items-baseline justify-between border-b border-border bg-muted/40 px-4 py-2 text-xs">
          <span className="font-mono text-muted-foreground">{filename ?? ""}</span>
          {lang && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {lang}
            </span>
          )}
        </header>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[13px]! leading-relaxed">
          <tbody>
            {lines.map((line, i) => {
              const n = i + 1;
              const lineMarks = marksByLine.get(n);
              const firstMark = lineMarks?.[0];
              return (
                <tr
                  key={n}
                  className={cn(
                    firstMark && toneLineBg[firstMark.tone ?? "primary"],
                  )}
                >
                  <td className="w-12 select-none border-r border-border/40 px-3 py-0.5 text-right text-muted-foreground/70">
                    {n}
                  </td>
                  <td className="w-6 py-0.5 pl-2 align-middle">
                    {firstMark && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            aria-label={
                              firstMark.title
                                ? `${firstMark.title} annotation ${firstMark.label}`
                                : `Annotation ${firstMark.label}`
                            }
                            className={cn(
                              "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ring-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:scale-110",
                              toneClasses[firstMark.tone ?? "primary"],
                            )}
                          >
                            {firstMark.label}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-[min(22rem,calc(100vw-2rem))] p-0 text-sm leading-relaxed"
                        >
                          <div className="rounded-md bg-card text-card-foreground">
                            {(firstMark.title || firstMark.purpose) && (
                              <div className="border-b border-border px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-2",
                                      toneClasses[firstMark.tone ?? "primary"],
                                    )}
                                  >
                                    {firstMark.label}
                                  </span>
                                  {firstMark.title && (
                                    <h3 className="text-sm font-semibold">
                                      {firstMark.title}
                                    </h3>
                                  )}
                                </div>
                                {firstMark.purpose && (
                                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                    {firstMark.purpose}
                                  </p>
                                )}
                              </div>
                            )}
                            {firstMark.body && (
                              <p className="px-4 py-3 text-muted-foreground">
                                {firstMark.body}
                              </p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </td>
                  <td className="whitespace-pre py-0.5 pr-4 pl-2">{line}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export default AnnotatedCode;
