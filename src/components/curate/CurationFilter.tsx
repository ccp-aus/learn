import * as React from "react";
import {
  CURATION_EVENT,
  defaultCuration,
  isActive,
  readCuration,
  type Curation,
  type Level,
} from "@/lib/curation";
import { vendorVisible, levelVisible } from "@/lib/curation-filter";

/**
 * Client-side filter applier.
 *
 * Astro pages mark filterable items with `data-curate-vendor="<slug>"` and
 * (optionally) `data-curate-level="l1|l2|l3"`. This component reads the
 * curation from localStorage and writes a single `<style>` tag that hides
 * non-matching items via attribute selectors.
 *
 * Why this shape:
 * - SSR ships the full content, so search engines, no-JS users, and first
 *   paint all see everything.
 * - The hide rule is one CSS rule per hidden vendor/level combo, applied
 *   atomically — no DOM-walking, no flash, no per-item state.
 * - localStorage changes (from the badge's clear button or another tab)
 *   re-render the rule via the CURATION_EVENT.
 *
 * Mount this once per page that has filterable items (or once globally in
 * BaseLayout — it's a no-op when no matching elements exist).
 */
export function CurationFilter() {
  const [c, setC] = React.useState<Curation>(defaultCuration);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setC(readCuration());
    setHydrated(true);
    const onChange = () => setC(readCuration());
    window.addEventListener(CURATION_EVENT, onChange);
    return () => window.removeEventListener(CURATION_EVENT, onChange);
  }, []);

  // Discover which vendor+level combos exist on this page so we can decide
  // which to hide. Re-discover on curation change too in case Astro
  // hot-reloaded the markup.
  const [combos, setCombos] = React.useState<
    { vendor: string; level: Level | null }[]
  >([]);

  React.useEffect(() => {
    if (!hydrated) return;
    const seen = new Set<string>();
    const out: { vendor: string; level: Level | null }[] = [];
    document
      .querySelectorAll<HTMLElement>("[data-curate-vendor]")
      .forEach((el) => {
        const vendor = el.dataset.curateVendor;
        const lvl = el.dataset.curateLevel as Level | undefined;
        if (!vendor) return;
        const key = `${vendor}::${lvl ?? ""}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ vendor, level: lvl ?? null });
      });
    setCombos(out);
  }, [hydrated, c]);

  const css = React.useMemo(() => {
    if (!hydrated || !isActive(c)) return "";
    const rules: string[] = [];
    for (const { vendor, level } of combos) {
      const visible = level
        ? levelVisible(vendor, level, c)
        : vendorVisible(vendor, c);
      if (visible) continue;
      if (level) {
        rules.push(
          `[data-curate-vendor="${vendor}"][data-curate-level="${level}"]{display:none!important}`,
        );
      } else {
        rules.push(
          `[data-curate-vendor="${vendor}"]:not([data-curate-level]){display:none!important}`,
        );
      }
    }
    return rules.join("\n");
  }, [combos, c, hydrated]);

  return <style data-curation-style="">{css}</style>;
}

export default CurationFilter;
