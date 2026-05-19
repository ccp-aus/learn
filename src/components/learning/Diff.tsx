import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DiffAnnotation = {
  /** 1-indexed line in the rendered diff (counts ALL rows: context + +/-). */
  line: number;
  label: string | number;
  title?: string;
  body?: string;
  tone?: "primary" | "warning" | "success";
};

interface Props {
  /**
   * Unified-diff body. Each line is prefixed with one of:
   *   "+ " for added, "- " for removed, "  " for context.
   * Leading whitespace inside the line content is preserved.
   */
  unified: string;
  filename?: string;
  lang?: string;
  annotations?: DiffAnnotation[];
  className?: string;
}

const toneClasses: Record<NonNullable<DiffAnnotation["tone"]>, string> = {
  primary: "bg-primary text-primary-foreground ring-primary/30",
  warning: "bg-amber-500 text-white ring-amber-500/30",
  success: "bg-emerald-500 text-white ring-emerald-500/30",
};

type Row = { kind: "add" | "del" | "ctx"; text: string };

function parseUnified(unified: string): Row[] {
  return unified.replace(/\r\n/g, "\n").split("\n").map((raw) => {
    if (raw.startsWith("+ ")) return { kind: "add", text: raw.slice(2) };
    if (raw.startsWith("- ")) return { kind: "del", text: raw.slice(2) };
    if (raw.startsWith("  ")) return { kind: "ctx", text: raw.slice(2) };
    // Permit bare lines (e.g. trailing newline) as context.
    return { kind: "ctx", text: raw };
  });
}

const kindBg: Record<Row["kind"], string> = {
  add: "bg-emerald-500/8",
  del: "bg-rose-500/8",
  ctx: "",
};
const kindGutter: Record<Row["kind"], string> = {
  add: "text-emerald-500",
  del: "text-rose-500",
  ctx: "text-muted-foreground/70",
};
const kindSign: Record<Row["kind"], string> = { add: "+", del: "-", ctx: " " };

/**
 * Diff — render a hand-authored unified diff with optional line-level
 * popover annotations. Use for config-change reviews (DNS, M365, firewall,
 * GPO) where the value of the lesson is "what changed and why."
 *
 * Authors write the diff inline — no diff algorithm runs at render time —
 * so the lesson decides exactly which lines surface.
 */
export function Diff({
  unified,
  filename,
  lang,
  annotations = [],
  className,
}: Props) {
  const rows = React.useMemo(() => parseUnified(unified), [unified]);
  const annByLine = React.useMemo(() => {
    const m = new Map<number, DiffAnnotation>();
    for (const a of annotations) if (!m.has(a.line)) m.set(a.line, a);
    return m;
  }, [annotations]);

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
            {rows.map((row, i) => {
              const n = i + 1;
              const ann = annByLine.get(n);
              return (
                <tr key={n} className={kindBg[row.kind]}>
                  <td
                    className={cn(
                      "w-8 select-none border-r border-border/40 py-0.5 text-center",
                      kindGutter[row.kind],
                    )}
                  >
                    {kindSign[row.kind]}
                  </td>
                  <td className="w-6 py-0.5 pl-2 align-middle">
                    {ann && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            aria-label={
                              ann.title
                                ? `${ann.title} annotation ${ann.label}`
                                : `Annotation ${ann.label}`
                            }
                            className={cn(
                              "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ring-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:scale-110",
                              toneClasses[ann.tone ?? "primary"],
                            )}
                          >
                            {ann.label}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-[min(22rem,calc(100vw-2rem))] p-0 text-sm leading-relaxed"
                        >
                          <div className="rounded-md bg-card text-card-foreground">
                            {ann.title && (
                              <div className="border-b border-border px-4 py-3 text-sm font-semibold">
                                {ann.title}
                              </div>
                            )}
                            {ann.body && (
                              <p className="px-4 py-3 text-muted-foreground">
                                {ann.body}
                              </p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </td>
                  <td className="whitespace-pre py-0.5 pr-4 pl-2">{row.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export default Diff;
