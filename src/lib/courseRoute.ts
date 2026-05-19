import type { CollectionEntry } from "astro:content";

type CourseEntry = CollectionEntry<"courses">;
type VendorEntry = CollectionEntry<"vendors">;

/**
 * URL suffix for a course derived from its slug. Courses are slug-prefixed
 * with their vendor slug, and the suffix is what appears after that prefix:
 *   threatlocker-l1     -> "l1"            -> /vendors/threatlocker/l1/
 *   domains-and-dns-l2  -> "l2"            -> /concepts/domains-and-dns/l2/
 *   yeastar-linkus      -> "linkus"        -> /vendors/yeastar/linkus/
 *   yeastar-pse-config  -> "pse-config"    -> /vendors/yeastar/pse-config/
 *   yeastar-foundations -> "foundations"   -> /vendors/yeastar/foundations/
 *
 * Backward-compatible with the legacy slug-with-level convention (suffix is
 * just the level), and forward-compatible with descriptive course names.
 */
export function courseUrlSuffix(course: CourseEntry): string {
  const ref = course.data.vendor;
  const vendorSlug = typeof ref === "string" ? ref : ref?.id;
  if (vendorSlug && course.data.slug.startsWith(`${vendorSlug}-`)) {
    return course.data.slug.slice(vendorSlug.length + 1);
  }
  return course.data.slug;
}

export function vendorRouteBase(vendor: VendorEntry): string {
  return vendor.data.kind === "concept" ? "/concepts" : "/vendors";
}

export function courseUrl(course: CourseEntry, vendor: VendorEntry): string {
  return `${vendorRouteBase(vendor)}/${vendor.data.slug}/${courseUrlSuffix(course)}/`;
}

export function vendorSlugOfCourse(course: CourseEntry): string | undefined {
  const ref = course.data.vendor;
  return typeof ref === "string" ? ref : ref?.id;
}

export function vendorOfCourse(
  course: CourseEntry,
  vendors: readonly VendorEntry[],
): VendorEntry | undefined {
  const slug = vendorSlugOfCourse(course);
  return vendors.find((v) => v.data.slug === slug);
}

export const levelLabel: Record<"l1" | "l2" | "l3", string> = {
  l1: "Beginner",
  l2: "Intermediate",
  l3: "Advanced",
};
