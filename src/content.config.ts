import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Optional leading underscore marks dev-only entries (see src/lib/dev-only.ts).
// Production routes filter them out via isPublic(); dev-mode routes include them.
const slug = z.string().regex(/^_?[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message:
    "slugs must be lowercase, hyphen-separated (optional leading _ for dev-only entries)",
});

const oklch = z
  .string()
  .regex(/^oklch\(/i, "accent must be a valid oklch() string");

/** Vendors — one JSON file per vendor under src/content/vendors/.
 *
 * `kind` distinguishes vendor-product tracks ("vendor") from vendor-neutral
 * concept tracks ("concept", e.g. Domains & DNS, TLS, identity protocols).
 * Concept entries reuse the same routing under /vendors/<slug>/ but the
 * listing pages group them separately, and authoring rules differ
 * (no "problem this product solves" opener for concepts).
 */
const vendors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/vendors" }),
  schema: z.object({
    slug,
    name: z.string(),
    tagline: z.string(),
    summary: z.string(),
    accent: oklch.default("oklch(0.78 0.17 215)"),
    logo: z.string().optional(),
    website: z.url().optional(),
    kind: z.enum(["vendor", "concept"]).default("vendor"),
    status: z.enum(["live", "planned", "draft"]).default("planned"),
    order: z.number().int().default(100),
  }),
});

/** Courses — JSON per vendor+level under src/content/courses/ */
const courses = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/courses" }),
  schema: z.object({
    slug,
    vendor: reference("vendors"),
    level: z.enum(["l1", "l2", "l3"]),
    title: z.string(),
    /**
     * Short, chip-friendly course name (2-4 words) used in prereq links,
     * curation panels, and other compact UI. Falls back to `title` if absent.
     * Existing courses (DNSFilter, ThreatLocker, etc.) will get one in a
     * follow-up rename; new courses should always set it.
     */
    shortTitle: z.string().optional(),
    summary: z.string(),
    estimatedMinutes: z.number().int().positive(),
    /** Slugs of prerequisite courses (e.g. dnsfilter-l1 for the Intermediate course). */
    prereqs: z.array(slug).default([]),
    /** Lesson slugs in display order. */
    lessons: z.array(slug).default([]),
    /** Optional end-of-course quiz slug. */
    quiz: slug.nullable().default(null),
    status: z.enum(["live", "draft"]).default("draft"),
  }),
});

/** Lessons — MDX under src/content/lessons/<vendor>/<level>/.
 *
 * generateId: lesson filenames repeat across vendors (every vendor has an
 * `02-portal-tour.mdx`). The default glob loader keys by basename, so those
 * collide and only one survives `getCollection('lessons')`. Use the full
 * relative path (without extension) as the ID so each lesson is unique.
 * The Zod-validated `slug` field stays the in-vendor URL slug; this `id`
 * is just the collection key.
 */
const lessons = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/lessons",
    generateId: ({ entry }) =>
      entry.replace(/\\/g, "/").replace(/\.mdx$/, ""),
  }),
  schema: z.object({
    slug,
    vendor: reference("vendors"),
    level: z.enum(["l1", "l2", "l3"]),
    title: z.string(),
    summary: z.string(),
    estimatedMinutes: z.number().int().positive().default(8),
    order: z.number().int().nonnegative(),
    topics: z.array(z.string()).default([]),
    updated: z.coerce.date().default(() => new Date()),
    /**
     * Draft = generated/unverified content. The lesson page renders a banner;
     * course progress excludes it. Default false (publish-ready).
     * The future LLM ingestion pipeline emits draft: true and a human reviewer
     * flips it to false after verifying against the vendor-rag MCP.
     */
    draft: z.boolean().default(false),
    draftReason: z.string().optional(),
  }),
});

/** Glossary terms — markdown per term under src/content/glossary/ */
const glossary = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/glossary" }),
  schema: z.object({
    slug,
    term: z.string(),
    aliases: z.array(z.string()).default([]),
    short: z.string().min(8).max(280),
    related: z.array(slug).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

/** Question types — discriminated union by `type`. */
const baseQuestion = z.object({
  id: slug,
  prompt: z.string(),
  explanation: z.string(),
  topic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

// A choice is either a bare string (label only) or a rich object that
// carries a per-choice rationale shown when the learner picks that
// specific wrong answer. See src/lib/quiz.ts for the helper exports.
const choice = z.union([
  z.string(),
  z.object({ label: z.string(), rationale: z.string().optional() }),
]);

const mcq = baseQuestion.extend({
  type: z.literal("mcq"),
  choices: z.array(choice).min(2).max(8),
  correct: z.number().int().nonnegative(),
});

const multi = baseQuestion.extend({
  type: z.literal("multi"),
  choices: z.array(choice).min(2).max(8),
  correct: z.array(z.number().int().nonnegative()).min(1),
});

const tf = baseQuestion.extend({
  type: z.literal("tf"),
  correct: z.boolean(),
});

const hotspot = baseQuestion.extend({
  type: z.literal("hotspot"),
  image: z.string(),
  imageAlt: z.string().default(""),
  /** Target hit-zone as percentages of image dimensions (0..100). */
  target: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    r: z.number().positive().max(50),
  }),
});

const order = baseQuestion.extend({
  type: z.literal("order"),
  /** The CORRECT order; the renderer shuffles for display. */
  items: z.array(z.string()).min(2).max(8),
});

const fill = baseQuestion.extend({
  type: z.literal("fill"),
  /**
   * Each blank renders below the prompt as a text input. Match is
   * case-insensitive + trim; `alternatives` adds extra accepted strings.
   * `placeholder` is the input's placeholder text (e.g. "3-letter acronym").
   */
  blanks: z
    .array(
      z.object({
        answer: z.string(),
        alternatives: z.array(z.string()).default([]),
        placeholder: z.string().optional(),
        label: z.string().optional(),
      }),
    )
    .min(1)
    .max(6),
});

const label = baseQuestion.extend({
  type: z.literal("label"),
  image: z.string(),
  imageAlt: z.string().default(""),
  /**
   * Zones to drop labels onto. x/y/w/h are percentages of image dimensions.
   * `label` is the correct text for that zone.
   */
  zones: z
    .array(
      z.object({
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
        w: z.number().positive().max(100),
        h: z.number().positive().max(100),
        label: z.string(),
      }),
    )
    .min(1)
    .max(8),
  /** Extra labels in the pool that don't belong on any zone. */
  distractors: z.array(z.string()).default([]),
});

const question = z.discriminatedUnion("type", [
  mcq,
  multi,
  tf,
  hotspot,
  order,
  fill,
  label,
]);

const quizzes = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/quizzes" }),
  schema: z.object({
    slug,
    /** Course this quiz belongs to. May be the end-of-course quiz, or an inline checkpoint. */
    course: slug.optional(),
    kind: z.enum(["final", "checkpoint"]).default("final"),
    title: z.string(),
    /** Number of questions to draw from the bank for a given attempt. Set 0 for "all". */
    drawCount: z.number().int().nonnegative().default(0),
    passThreshold: z.number().min(0).max(1).default(0.7),
    questions: z.array(question).min(1),
  }),
});

const paths = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/paths" }),
  schema: z.object({
    slug,
    title: z.string(),
    summary: z.string(),
    audience: z.string(),
    courses: z.array(slug).default([]),
  }),
});

export const collections = {
  vendors,
  courses,
  lessons,
  glossary,
  quizzes,
  paths,
};
