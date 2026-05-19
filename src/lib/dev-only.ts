/**
 * Dev-only gate for content collections.
 *
 * Convention: collection entries (vendors, courses, quizzes) whose `slug`
 * starts with `_` are dev-only. They exist in source and render under
 * `astro dev` so contributors can iterate on the element library and
 * lesson chrome end-to-end, but are excluded from the production build
 * (`astro build`), the sitemap, and the Pagefind index because the
 * matching static routes are never generated.
 *
 * Apply this filter to every getCollection consumer that drives public
 * routes or listings. `import.meta.env.DEV` is true under `astro dev`
 * (ports 4321 and the preview MCP) and false under `astro build`.
 *
 * Lessons inherit the gate transitively: lesson and quiz routes only
 * emit paths whose owning course passes this filter, so filtering at the
 * vendor/course/quiz boundary is sufficient.
 */
export function isPublic<T extends { data: { slug: string } }>(
  entry: T,
): boolean {
  if (import.meta.env.DEV) return true;
  return !entry.data.slug.startsWith("_");
}
