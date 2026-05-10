import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "slugs must be lowercase, hyphen-separated",
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

const mcq = baseQuestion.extend({
  type: z.literal("mcq"),
  choices: z.array(z.string()).min(2).max(8),
  correct: z.number().int().nonnegative(),
});

const multi = baseQuestion.extend({
  type: z.literal("multi"),
  choices: z.array(z.string()).min(2).max(8),
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

const question = z.discriminatedUnion("type", [mcq, multi, tf, hotspot, order]);

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
