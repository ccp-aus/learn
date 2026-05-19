/**
 * Stack curation — let an MSP filter the site to only the products in their
 * stack. Stored in localStorage, sharable via URL query param `?stack=...`,
 * exportable/importable as JSON. Purely client-side; SSR always renders
 * everything.
 *
 * Schema is versioned. Future migrations bump VERSION and ship a `migrate()`.
 */

export type Level = "l1" | "l2" | "l3";

export interface Curation {
  /** schema version */
  v: 1;
  /**
   * Selected vendor slugs. `null` = no filter (show all). Empty array = show
   * none (hide everything except auto-included).
   */
  vendors: string[] | null;
  /**
   * Per-vendor: which levels are included. Empty array means "include the
   * vendor with all levels" (delegated to autoIncludeNewLevels). Vendors not
   * present in this map fall back to all levels.
   */
  levels: Record<string, Level[]>;
  /**
   * When true, vendors not explicitly in `vendors` are still shown.
   * When false, vendors not in `vendors` are hidden.
   * Default true → curation acts as a deny-list.
   */
  autoIncludeNewVendors: boolean;
  /**
   * When true, levels not explicitly in `levels[vendor]` are still shown.
   * When false, only the explicitly-listed levels are shown.
   * Default true.
   */
  autoIncludeNewLevels: boolean;
}

export const CURATION_KEY = "learnmsp:curation";
export const CURATION_EVENT = "learnmsp:curation-changed";
const VERSION: 1 = 1;

export function defaultCuration(): Curation {
  return {
    v: VERSION,
    vendors: null,
    levels: {},
    autoIncludeNewVendors: true,
    autoIncludeNewLevels: true,
  };
}

/** True when the user hasn't customised anything — show everything. */
export function isDefault(c: Curation): boolean {
  return (
    c.vendors === null &&
    Object.keys(c.levels).length === 0 &&
    c.autoIncludeNewVendors === true &&
    c.autoIncludeNewLevels === true
  );
}

/** True if there's any active filter. */
export function isActive(c: Curation): boolean {
  return !isDefault(c);
}

function migrate(raw: unknown): Curation {
  if (!raw || typeof raw !== "object") return defaultCuration();
  const obj = raw as Partial<Curation> & { v?: number };
  if (obj.v === VERSION) {
    return {
      v: VERSION,
      vendors: obj.vendors ?? null,
      levels: obj.levels ?? {},
      autoIncludeNewVendors: obj.autoIncludeNewVendors ?? true,
      autoIncludeNewLevels: obj.autoIncludeNewLevels ?? true,
    };
  }
  return defaultCuration();
}

export function readCuration(): Curation {
  if (typeof window === "undefined") return defaultCuration();
  try {
    const raw = window.localStorage.getItem(CURATION_KEY);
    if (!raw) return defaultCuration();
    return migrate(JSON.parse(raw));
  } catch {
    return defaultCuration();
  }
}

export function writeCuration(c: Curation): void {
  if (typeof window === "undefined") return;
  if (isDefault(c)) {
    window.localStorage.removeItem(CURATION_KEY);
  } else {
    window.localStorage.setItem(CURATION_KEY, JSON.stringify(c));
  }
  window.dispatchEvent(new CustomEvent(CURATION_EVENT, { detail: c }));
}

export function clearCuration(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURATION_KEY);
  window.dispatchEvent(new CustomEvent(CURATION_EVENT, { detail: defaultCuration() }));
}

/* ------------- URL encode / decode ------------- */

function base64UrlEncode(s: string): string {
  // btoa is browser-only; fall back to Buffer in Node (SSR doesn't actually
  // call this path, but the type-checker thinks it might).
  const b64 =
    typeof btoa === "function"
      ? btoa(unescape(encodeURIComponent(s)))
      : Buffer.from(s, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  if (typeof atob === "function") {
    return decodeURIComponent(escape(atob(padded)));
  }
  return Buffer.from(padded, "base64").toString("utf-8");
}

export function encodeCurationToUrlParam(c: Curation): string {
  return base64UrlEncode(JSON.stringify(c));
}

export function decodeCurationFromUrlParam(param: string): Curation | null {
  try {
    const json = base64UrlDecode(param);
    return migrate(JSON.parse(json));
  } catch {
    return null;
  }
}

/** Build a sharable URL from the user's current curation, on the current origin. */
export function buildShareUrl(c: Curation, origin = window.location.origin): string {
  const u = new URL(origin);
  if (isActive(c)) {
    u.searchParams.set("stack", encodeCurationToUrlParam(c));
  }
  return u.toString();
}

/** True if two curations are deeply equal. Used to skip redundant prompts. */
export function curationsEqual(a: Curation, b: Curation): boolean {
  if (a.v !== b.v) return false;
  if (a.autoIncludeNewVendors !== b.autoIncludeNewVendors) return false;
  if (a.autoIncludeNewLevels !== b.autoIncludeNewLevels) return false;
  const av = a.vendors === null ? "*" : [...a.vendors].sort().join(",");
  const bv = b.vendors === null ? "*" : [...b.vendors].sort().join(",");
  if (av !== bv) return false;
  const ak = Object.keys(a.levels).sort();
  const bk = Object.keys(b.levels).sort();
  if (ak.join(",") !== bk.join(",")) return false;
  for (const k of ak) {
    if ([...a.levels[k]].sort().join(",") !== [...b.levels[k]].sort().join(",")) {
      return false;
    }
  }
  return true;
}
