import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface HotspotProps {
  /** percentage of image width (0..100) */
  x: number;
  /** percentage of image height (0..100) */
  y: number;
  /** label inside the marker — typically "1", "2", "3" */
  label: string | number;
  /** short heading shown in the popover card */
  title?: string;
  /** one-line reason a technician opens this surface */
  purpose?: string;
  children?: React.ReactNode;
  tone?: "primary" | "warning" | "success";
}

const toneColors: Record<NonNullable<HotspotProps["tone"]>, string> = {
  primary: "bg-primary text-primary-foreground ring-primary/30",
  warning: "bg-amber-500 text-white ring-amber-500/30",
  success: "bg-emerald-500 text-white ring-emerald-500/30",
};

/* ------------------------------------------------------------------ */
/* Dev-mode positioner                                                */
/* ------------------------------------------------------------------ */
/* Each <Hotspot client:load .../> is an independent island, so the   */
/* wrapper can't share state with them via React context. Instead the */
/* positioner uses DOM coordination: the wrapper exposes a            */
/* `data-positioner-scope` attribute, and each Hotspot writes its     */
/* own metadata as data-* attributes onto its marker button. A small  */
/* toolbar is created lazily by the first Hotspot that mounts in a    */
/* given scope; it reads all sibling markers when building the JSX    */
/* snippet to copy. Everything is gated by `import.meta.env.DEV` so   */
/* Vite's dead-code elimination drops it from the production bundle.  */
/* ------------------------------------------------------------------ */

const POSITIONER_LS_PREFIX = "learn-msp:hotspot-positioner:";
const MARKER_ATTR = "data-positioner-marker";
const SCOPE_ATTR = "data-positioner-scope";
const TOOLBAR_FLAG = "data-positioner-toolbar-mounted";

function fmt(n: number): string {
  return n.toFixed(1);
}

function escapeJsxAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}

function loadScope(scopeKey: string): Record<string, { x: number; y: number }> {
  try {
    const raw = localStorage.getItem(POSITIONER_LS_PREFIX + scopeKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveScope(
  scopeKey: string,
  data: Record<string, { x: number; y: number }>,
) {
  try {
    localStorage.setItem(POSITIONER_LS_PREFIX + scopeKey, JSON.stringify(data));
  } catch {
    /* quota / private mode — ignore */
  }
}

function buildJsxSnippet(scope: HTMLElement): string {
  const markers = Array.from(
    scope.querySelectorAll<HTMLElement>(`[${MARKER_ATTR}]`),
  );
  return markers
    .map((m) => {
      const x = parseFloat(m.dataset.posX ?? "0");
      const y = parseFloat(m.dataset.posY ?? "0");
      const label = m.dataset.posLabel ?? "";
      const title = m.dataset.posTitle ?? "";
      const purpose = m.dataset.posPurpose ?? "";
      const tone = m.dataset.posTone ?? "primary";
      const body = m.dataset.posBody ?? "";
      const attrs: string[] = [
        "client:load",
        `x={${fmt(x)}}`,
        `y={${fmt(y)}}`,
        `label="${escapeJsxAttr(label)}"`,
      ];
      if (title) attrs.push(`title="${escapeJsxAttr(title)}"`);
      if (purpose) attrs.push(`purpose="${escapeJsxAttr(purpose)}"`);
      attrs.push(`tone="${tone}"`);
      const open = `<Hotspot\n  ${attrs.join("\n  ")}\n>`;
      const close = `</Hotspot>`;
      const trimmedBody = body.trim();
      // If the original MDX wrapped body text in a <p> (the common case),
      // Astro's React island serialisation strips it, so we can't recover
      // the original prose. Emit a placeholder so the author knows to keep
      // their existing body text rather than overwriting with an empty tag.
      const inner = trimmedBody || "{/* keep existing body */}";
      return `${open}\n  ${inner}\n${close}`;
    })
    .join("\n");
}

/** Idempotently inject a "Copy JSX / Reset" toolbar into the given scope. */
function ensureToolbar(scope: HTMLElement) {
  if (scope.getAttribute(TOOLBAR_FLAG) === "1") return;
  scope.setAttribute(TOOLBAR_FLAG, "1");

  const scopeKey = scope.getAttribute(SCOPE_ATTR) ?? "";

  const bar = document.createElement("div");
  bar.className =
    "pointer-events-auto absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md border border-amber-400/60 bg-amber-50/95 px-2 py-1 text-xs text-amber-900 shadow-sm dark:bg-amber-950/80 dark:text-amber-100";
  bar.setAttribute("data-dev-only", "hotspot-positioner");

  const tag = document.createElement("span");
  tag.className = "font-mono font-semibold uppercase tracking-wide opacity-70";
  tag.textContent = "dev";
  bar.appendChild(tag);

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className =
    "rounded bg-amber-200 px-2 py-0.5 font-medium hover:bg-amber-300 dark:bg-amber-800 dark:hover:bg-amber-700";
  copyBtn.textContent = "Copy JSX";
  bar.appendChild(copyBtn);

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className =
    "rounded px-2 py-0.5 hover:bg-amber-100 dark:hover:bg-amber-900";
  resetBtn.textContent = "Reset";
  resetBtn.title =
    "Discard saved positions for this image and reload original x/y from MDX";
  bar.appendChild(resetBtn);

  const status = document.createElement("span");
  status.className = "ml-1 font-medium";
  bar.appendChild(status);

  copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const snippet = buildJsxSnippet(scope);
    try {
      await navigator.clipboard.writeText(snippet);
      status.textContent = "Copied!";
    } catch {
      status.textContent = "Copy failed — see console";
      // eslint-disable-next-line no-console
      console.log("[hotspot-positioner] snippet:\n" + snippet);
    }
    window.setTimeout(() => {
      status.textContent = "";
    }, 1500);
  });

  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem(POSITIONER_LS_PREFIX + scopeKey);
    } catch {
      /* ignore */
    }
    // Tell each marker to restore its original x/y (stored as data-orig-x/y).
    const markers = scope.querySelectorAll<HTMLElement>(`[${MARKER_ATTR}]`);
    markers.forEach((m) => {
      const ox = m.dataset.origX;
      const oy = m.dataset.origY;
      if (ox && oy) {
        m.dispatchEvent(
          new CustomEvent("positioner:reset", {
            detail: { x: parseFloat(ox), y: parseFloat(oy) },
          }),
        );
      }
    });
    status.textContent = "Reset";
    window.setTimeout(() => {
      status.textContent = "";
    }, 1500);
  });

  scope.appendChild(bar);
}

/* ------------------------------------------------------------------ */
/* Hotspot component                                                  */
/* ------------------------------------------------------------------ */

export function Hotspot({
  x,
  y,
  label,
  title,
  purpose,
  tone = "primary",
  children,
}: HotspotProps) {
  const accessibleName = title ? `${title} hotspot ${label}` : `Hotspot ${label}`;

  // Initial position. In dev mode it may be overridden from localStorage.
  const [pos, setPos] = React.useState({ x, y });
  const [dragging, setDragging] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const scopeRef = React.useRef<HTMLElement | null>(null);
  const dragStartedRef = React.useRef(false);

  // Extract plain-text body for the copy snippet. MDX wraps the inner text
  // in a <p> (and possibly nested inline elements), so walk the React tree
  // and concatenate string nodes. Best-effort: if a child carries non-text
  // content (Term hovercards, links, etc.) we still capture the visible
  // text and lose the markup. The author can paste back, then re-add
  // inline formatting if needed.
  const bodyText = React.useMemo(() => {
    if (!import.meta.env.DEV) return undefined;
    const collect = (node: React.ReactNode): string => {
      if (node == null || typeof node === "boolean") return "";
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      if (Array.isArray(node)) return node.map(collect).join("");
      if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return collect(props.children);
      }
      return "";
    };
    const text = collect(children).replace(/\s+/g, " ").trim();
    return text || undefined;
  }, [children]);

  // On mount in dev mode: find the wrapper scope, restore persisted position,
  // ensure the toolbar is mounted, wire up reset listener.
  React.useEffect(() => {
    if (!import.meta.env.DEV) return;
    const btn = buttonRef.current;
    if (!btn) return;
    const scope = btn.closest<HTMLElement>(`[${SCOPE_ATTR}]`);
    if (!scope) return;
    scopeRef.current = scope;
    ensureToolbar(scope);
    const scopeKey = scope.getAttribute(SCOPE_ATTR) ?? "";
    const saved = loadScope(scopeKey);
    const persisted = saved[String(label)];
    if (persisted) {
      setPos(persisted);
    }
    const onReset = (e: Event) => {
      const detail = (e as CustomEvent).detail as { x: number; y: number };
      setPos(detail);
    };
    btn.addEventListener("positioner:reset", onReset);
    return () => {
      btn.removeEventListener("positioner:reset", onReset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag handler (dev only).
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!import.meta.env.DEV) return;
    if (e.button !== 0) return;
    const scope = scopeRef.current;
    if (!scope) return;
    const img = scope.querySelector<HTMLImageElement>("img");
    if (!img) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      /* synthesised test events have no active pointer — ignore */
    }
    dragStartedRef.current = false;
    setDragging(true);

    // Track the latest committed coords in a closure so onUp can persist
    // them synchronously — React state flush is async and the data-pos-*
    // attrs may lag by a frame.
    let lastX = pos.x;
    let lastY = pos.y;

    const onMove = (ev: PointerEvent) => {
      const rect = img.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((ev.clientX - rect.left) / rect.width) * 100;
      const ny = ((ev.clientY - rect.top) / rect.height) * 100;
      lastX = Math.max(0, Math.min(100, nx));
      lastY = Math.max(0, Math.min(100, ny));
      dragStartedRef.current = true;
      setPos({ x: lastX, y: lastY });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setDragging(false);
      // Persist after drop.
      if (dragStartedRef.current) {
        const scopeKey = scope.getAttribute(SCOPE_ATTR) ?? "";
        const saved = loadScope(scopeKey);
        saved[String(label)] = { x: lastX, y: lastY };
        saveScope(scopeKey, saved);
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  // Suppress popover-open click immediately after a drag.
  const handleClickCapture = (e: React.MouseEvent) => {
    if (!import.meta.env.DEV) return;
    if (dragStartedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      dragStartedRef.current = false;
    }
  };

  const devMode = import.meta.env.DEV;

  // Build the marker. In dev mode we tag it with data-* attributes so the
  // toolbar (which lives outside this React island) can enumerate siblings
  // and build the snippet. We also keep the original x/y around for reset.
  const devDataProps: Record<string, string> = devMode
    ? {
        [MARKER_ATTR]: "1",
        "data-pos-x": String(pos.x),
        "data-pos-y": String(pos.y),
        "data-pos-label": String(label),
        "data-pos-tone": tone,
        "data-orig-x": String(x),
        "data-orig-y": String(y),
        ...(title ? { "data-pos-title": title } : {}),
        ...(purpose ? { "data-pos-purpose": purpose } : {}),
        ...(bodyText ? { "data-pos-body": bodyText } : {}),
      }
    : {};

  const marker = (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center",
        "rounded-full text-sm font-bold leading-none ring-4 transition-transform",
        "hover:scale-110 focus-visible:outline-none focus-visible:scale-110",
        "animate-pulse motion-reduce:animate-none",
        toneColors[tone],
        devMode &&
          "cursor-grab brightness-110 ring-offset-2 ring-offset-background hover:brightness-125",
        devMode && dragging && "cursor-grabbing animate-none brightness-150",
      )}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label={accessibleName}
      onPointerDown={devMode ? handlePointerDown : undefined}
      onClickCapture={devMode ? handleClickCapture : undefined}
      {...devDataProps}
    >
      {label}
      {devMode && dragging && (
        <span
          className="pointer-events-none absolute left-full top-full ml-2 mt-1 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white"
          aria-hidden="true"
        >
          x={fmt(pos.x)} y={fmt(pos.y)}
        </span>
      )}
    </button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{marker}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(22rem,calc(100vw-2rem))] p-0 text-sm leading-relaxed"
      >
        <div className="rounded-md bg-card text-card-foreground">
          {(title || purpose) && (
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-2",
                    toneColors[tone],
                  )}
                >
                  {label}
                </span>
                {title && <h3 className="text-sm font-semibold">{title}</h3>}
              </div>
              {purpose && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {purpose}
                </p>
              )}
            </div>
          )}
          {children && (
            <div className="space-y-2 px-4 py-3 text-muted-foreground">
              {children}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ */
/* AnnotatedScreenshot wrapper                                        */
/* ------------------------------------------------------------------ */

interface AnnotatedScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  /** Aspect-ratio hint for layout stability (e.g., "16/9", "4/3") */
  aspect?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AnnotatedScreenshot({
  src,
  alt,
  caption,
  aspect,
  children,
  className,
}: AnnotatedScreenshotProps) {
  // Tagging the inner container with `data-positioner-scope` is a no-op in
  // production: there's no script that reads it (Hotspot's dev branch is
  // tree-shaken). Leaving the attribute on costs ~one short attribute per
  // image and lets the dev positioner find its scope without a separate
  // wrapper component.
  const scopeAttr: Record<string, string> = import.meta.env.DEV
    ? { [SCOPE_ATTR]: src }
    : {};

  return (
    <figure className={cn("my-8", className)}>
      <div
        className="relative overflow-hidden rounded-lg border border-border bg-muted"
        style={aspect ? { aspectRatio: aspect } : undefined}
        {...scopeAttr}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain"
        />
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default AnnotatedScreenshot;
