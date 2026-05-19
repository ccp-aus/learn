/**
 * Helpers for building URLs that depend on a vendor entry's `kind`.
 *
 * Vendor-kind entries route under `/vendors/<slug>/...`. Concept-kind
 * entries route under `/concepts/<slug>/...`. The same content collection
 * holds both; the difference is purely URL routing and the listing pages.
 */

export type VendorKind = "vendor" | "concept";

const SECTION_LABEL: Record<VendorKind, string> = {
  vendor: "Vendors",
  concept: "Concepts",
};

const SECTION_PATH: Record<VendorKind, string> = {
  vendor: "/vendors/",
  concept: "/concepts/",
};

/** Treat missing kind as "vendor" for backward compat. */
export function kindOf(v: { data?: { kind?: VendorKind } } | undefined | null): VendorKind {
  return v?.data?.kind === "concept" ? "concept" : "vendor";
}

/** "/vendors/" or "/concepts/". */
export function sectionRoot(kind: VendorKind): string {
  return SECTION_PATH[kind];
}

/** "Vendors" or "Concepts". */
export function sectionLabel(kind: VendorKind): string {
  return SECTION_LABEL[kind];
}

/** "/vendors/<slug>/" or "/concepts/<slug>/". */
export function vendorBase(slug: string, kind: VendorKind): string {
  return `${SECTION_PATH[kind]}${slug}/`;
}

/** "/vendors/<slug>/<level>/" or "/concepts/<slug>/<level>/". */
export function levelBase(slug: string, kind: VendorKind, level: string): string {
  return `${SECTION_PATH[kind]}${slug}/${level}/`;
}

/** "/vendors/<slug>/<level>/<lesson>/" or "/concepts/<slug>/<level>/<lesson>/". */
export function lessonHref(slug: string, kind: VendorKind, level: string, lessonSlug: string): string {
  return `${SECTION_PATH[kind]}${slug}/${level}/${lessonSlug}/`;
}

/** "/vendors/<slug>/<level>/quiz/" or "/concepts/<slug>/<level>/quiz/". */
export function quizHref(slug: string, kind: VendorKind, level: string): string {
  return `${SECTION_PATH[kind]}${slug}/${level}/quiz/`;
}
