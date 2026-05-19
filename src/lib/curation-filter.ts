/**
 * Pure predicates that decide whether a vendor/lesson/path is visible under
 * a given curation. No DOM, no localStorage — safe for SSR + tests.
 */

import type { Curation, Level } from "@/lib/curation";

/** Should this vendor card be rendered? */
export function vendorVisible(vendorSlug: string, c: Curation): boolean {
  if (c.vendors === null) return true;
  if (c.vendors.includes(vendorSlug)) return true;
  return c.autoIncludeNewVendors;
}

/** Should this level (l1/l2/l3) of `vendorSlug` be rendered? */
export function levelVisible(
  vendorSlug: string,
  level: Level,
  c: Curation,
): boolean {
  if (!vendorVisible(vendorSlug, c)) return false;
  const explicit = c.levels[vendorSlug];
  if (!explicit || explicit.length === 0) return true;
  if (explicit.includes(level)) return true;
  return c.autoIncludeNewLevels;
}

/**
 * Should this lesson be rendered (where lesson knows its vendor + level)?
 * Convenience wrapper around levelVisible.
 */
export function lessonVisible(
  vendorSlug: string,
  level: Level,
  c: Curation,
): boolean {
  return levelVisible(vendorSlug, level, c);
}

/**
 * Should a path be shown? A path is visible if at least one of its courses
 * is visible. Returns "full" if every course is visible, "partial" if some
 * are hidden, or null if hidden entirely.
 */
export type PathVisibility = "full" | "partial" | null;

export function pathVisibility(
  pathCourses: { vendor: string; level: Level }[],
  c: Curation,
): PathVisibility {
  if (pathCourses.length === 0) return "full";
  let visible = 0;
  for (const { vendor, level } of pathCourses) {
    if (levelVisible(vendor, level, c)) visible += 1;
  }
  if (visible === 0) return null;
  if (visible === pathCourses.length) return "full";
  return "partial";
}

/**
 * Filter Pagefind result URLs by curation. URL patterns:
 *   /vendors/<slug>/                         vendor overview
 *   /vendors/<slug>/<level>/                 course
 *   /vendors/<slug>/<level>/<lesson>/        lesson
 *   /vendors/<slug>/<level>/quiz/            quiz
 *   /glossary/...                            always visible
 *   /paths/...                               we let through; path-detail page handles its own filter
 *   everything else (/, /about/, etc.)       always visible
 */
export function urlVisible(url: string, c: Curation): boolean {
  const m = url.match(/^\/vendors\/([^/]+)(?:\/(l[123])(?:\/.*)?)?\/?$/i);
  if (!m) return true; // non-vendor URL
  const vendorSlug = m[1];
  const level = m[2]?.toLowerCase() as Level | undefined;
  if (!level) return vendorVisible(vendorSlug, c);
  return levelVisible(vendorSlug, level, c);
}
