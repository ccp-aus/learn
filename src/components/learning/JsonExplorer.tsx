import * as React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type JsonHighlight = {
  /** Dot-path into the data, e.g. "users.0.email". Wildcards are NOT supported — be explicit. */
  path: string;
  title?: string;
  body?: string;
  tone?: "primary" | "warning" | "success";
};

interface Props {
  data: unknown;
  /** Paths to keep expanded on first paint. Anything not listed renders collapsed. */
  defaultOpen?: string[];
  highlights?: JsonHighlight[];
  className?: string;
}

const toneBg: Record<NonNullable<JsonHighlight["tone"]>, string> = {
  primary: "bg-primary/10 border-primary/40",
  warning: "bg-amber-500/10 border-amber-500/40",
  success: "bg-emerald-500/10 border-emerald-500/40",
};

/**
 * JsonExplorer — collapsible tree view for a (small) JSON payload. Use for
 * Graph API responses, RMM webhooks, vendor SDK output. Mark specific paths
 * with `highlights` so the lesson can call attention to the field that
 * matters without dumping a wall of JSON.
 */
export function JsonExplorer({
  data,
  defaultOpen = [],
  highlights = [],
  className,
}: Props) {
  const highlightMap = React.useMemo(() => {
    const m = new Map<string, JsonHighlight>();
    for (const h of highlights) m.set(h.path, h);
    return m;
  }, [highlights]);
  const openSet = React.useMemo(() => new Set(defaultOpen), [defaultOpen]);

  return (
    <div
      className={cn(
        "my-6 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px] leading-relaxed",
        className,
      )}
    >
      <Node
        value={data}
        path=""
        keyName={null}
        depth={0}
        openSet={openSet}
        highlights={highlightMap}
        last
      />
    </div>
  );
}

function Node({
  value,
  path,
  keyName,
  depth,
  openSet,
  highlights,
  last,
}: {
  value: unknown;
  path: string;
  keyName: string | null;
  depth: number;
  openSet: Set<string>;
  highlights: Map<string, JsonHighlight>;
  last: boolean;
}) {
  const initialOpen = depth === 0 || openSet.has(path);
  const [open, setOpen] = React.useState(initialOpen);
  const highlight = highlights.get(path);

  const isObject = value && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const expandable = isObject || isArray;

  const entries = isObject
    ? Object.entries(value as Record<string, unknown>)
    : isArray
      ? (value as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
      : [];

  const keyLabel = keyName !== null && (
    <span className="text-foreground/80">"{keyName}"</span>
  );

  return (
    <div
      className={cn(
        "rounded-sm",
        highlight && cn("border-l-2 pl-2 -ml-2", toneBg[highlight.tone ?? "primary"]),
      )}
    >
      <div className="flex items-baseline gap-1">
        {expandable ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : (
          <span className="inline-block w-4" />
        )}
        {keyLabel}
        {keyName !== null && <span className="text-muted-foreground/70">:</span>}
        {!expandable && <ScalarLiteral value={value} />}
        {expandable && (
          <span className="text-muted-foreground/80">
            {isArray ? "[" : "{"}
            {!open && (
              <span className="text-muted-foreground/60">
                {" "}
                {entries.length} {entries.length === 1 ? "item" : "items"}{" "}
              </span>
            )}
            {!open && (isArray ? "]" : "}")}
          </span>
        )}
        {highlight?.title && (
          <span className="ml-2 inline-flex items-center rounded bg-foreground/5 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-foreground/70">
            {highlight.title}
          </span>
        )}
      </div>
      {highlight?.body && (
        <div className="ml-5 mt-1 text-xs text-muted-foreground">{highlight.body}</div>
      )}
      {expandable && open && (
        <>
          <div className="ml-3 border-l border-border/40 pl-3">
            {entries.map(([k, v], i) => (
              <Node
                key={k}
                value={v}
                path={path === "" ? k : `${path}.${k}`}
                keyName={isArray ? null : k}
                depth={depth + 1}
                openSet={openSet}
                highlights={highlights}
                last={i === entries.length - 1}
              />
            ))}
          </div>
          <div className="text-muted-foreground/80">
            {isArray ? "]" : "}"}
            {!last && ","}
          </div>
        </>
      )}
    </div>
  );
}

function ScalarLiteral({ value }: { value: unknown }) {
  if (value === null) return <span className="text-muted-foreground/80">null</span>;
  if (typeof value === "boolean")
    return <span className="text-amber-500">{String(value)}</span>;
  if (typeof value === "number")
    return <span className="text-sky-500">{value}</span>;
  if (typeof value === "string")
    return (
      <span className="text-emerald-500">
        "{value}"
      </span>
    );
  return <span>{String(value)}</span>;
}

export default JsonExplorer;
