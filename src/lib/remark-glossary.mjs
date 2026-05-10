/**
 * Build-time remark plugin: auto-wraps known glossary terms (and aliases) in
 * <Term slug="..."> JSX so the React HoverCard can display the definition.
 *
 * - Reads frontmatter from src/content/glossary/*.md
 * - Builds a single case-insensitive regex of all terms + aliases
 * - Visits text nodes in markdown / MDX, skipping code, inline code, links,
 *   headings, and existing <Term> wrappers
 * - Each known term in a document is wrapped at most ONCE (the first occurrence)
 *   to avoid noisy lessons
 *
 * Pure ESM, no dependencies beyond unist-util-visit and node:fs.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { visit, SKIP } from "unist-util-visit";

const GLOSSARY_DIR = "src/content/glossary";

/** Lazy-loaded once per process. */
let TERMS_CACHE = null;

function loadTerms() {
  if (TERMS_CACHE) return TERMS_CACHE;
  const entries = [];
  let dirExists = true;
  try {
    statSync(GLOSSARY_DIR);
  } catch {
    dirExists = false;
  }
  if (!dirExists) {
    TERMS_CACHE = { entries: [], regex: null };
    return TERMS_CACHE;
  }

  const files = readdirSync(GLOSSARY_DIR).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const raw = readFileSync(join(GLOSSARY_DIR, filename), "utf8");
    const fm = parseFrontmatter(raw);
    if (!fm) continue;
    if (!fm.slug || !fm.term) continue;
    const aliases = Array.isArray(fm.aliases) ? fm.aliases : [];
    const variants = [fm.term, ...aliases].filter(Boolean);
    for (const v of variants) {
      entries.push({ surface: v, slug: fm.slug });
    }
  }

  // Longest-first so multi-word terms beat their constituent words.
  entries.sort((a, b) => b.surface.length - a.surface.length);

  if (entries.length === 0) {
    TERMS_CACHE = { entries: [], regex: null };
    return TERMS_CACHE;
  }

  const escaped = entries
    .map((e) => e.surface.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  // \b doesn't behave well with unicode; we'll fence with start/end-of-token guards.
  const regex = new RegExp(`(?<![A-Za-z0-9_])(${escaped})(?![A-Za-z0-9_])`, "i");

  TERMS_CACHE = { entries, regex };
  return TERMS_CACHE;
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return null;
  const yaml = raw.slice(3, end).trim();
  const out = {};
  let pendingKey = null;
  let pendingArr = null;
  for (const lineRaw of yaml.split(/\r?\n/)) {
    const line = lineRaw.replace(/\s+$/, "");
    if (!line.trim()) continue;
    if (pendingArr && /^\s*-\s+/.test(line)) {
      pendingArr.push(stripQuotes(line.replace(/^\s*-\s+/, "")));
      continue;
    } else if (pendingArr) {
      out[pendingKey] = pendingArr;
      pendingKey = null;
      pendingArr = null;
    }
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2];
    if (val === "" || val === "[]") {
      // open list on next lines or empty
      if (val === "[]") {
        out[key] = [];
      } else {
        pendingKey = key;
        pendingArr = [];
      }
    } else if (val.startsWith("[") && val.endsWith("]")) {
      out[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => stripQuotes(s.trim()))
        .filter(Boolean);
    } else {
      out[key] = stripQuotes(val);
    }
  }
  if (pendingArr) out[pendingKey] = pendingArr;
  return out;
}

function stripQuotes(s) {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function findSlugBySurface(entries, surface) {
  const lower = surface.toLowerCase();
  for (const e of entries) {
    if (e.surface.toLowerCase() === lower) return e.slug;
  }
  return null;
}

export function remarkGlossaryAutolink() {
  const { entries, regex } = loadTerms();
  if (!regex) {
    return () => {};
  }

  return (tree, file) => {
    if (file?.path && /\/glossary\//.test(file.path)) return;
    const linkedThisDoc = new Set();

    visit(tree, (node, index, parent) => {
      // Don't descend into nodes that should not be auto-linked.
      if (
        node.type === "code" ||
        node.type === "inlineCode" ||
        node.type === "link" ||
        node.type === "linkReference" ||
        node.type === "heading" ||
        node.type === "yaml" ||
        node.type === "mdxJsxFlowElement" ||
        node.type === "mdxJsxTextElement" ||
        node.type === "mdxFlowExpression" ||
        node.type === "mdxTextExpression" ||
        node.type === "html" ||
        node.type === "mdxjsEsm"
      ) {
        return SKIP;
      }
      if (node.type !== "text" || !parent || typeof index !== "number") return;

      const text = node.value;
      const m = text.match(regex);
      if (!m) return;

      const surface = m[1];
      const slug = findSlugBySurface(entries, surface);
      if (!slug) return;
      if (linkedThisDoc.has(slug)) return;

      const start = m.index ?? 0;
      const end = start + surface.length;
      const before = text.slice(0, start);
      const after = text.slice(end);

      const replacement = {
        type: "mdxJsxTextElement",
        name: "Term",
        attributes: [
          { type: "mdxJsxAttribute", name: "slug", value: slug },
        ],
        children: [{ type: "text", value: surface }],
      };

      const replacements = [];
      if (before) replacements.push({ type: "text", value: before });
      replacements.push(replacement);
      if (after) replacements.push({ type: "text", value: after });

      parent.children.splice(index, 1, ...replacements);
      linkedThisDoc.add(slug);

      // Skip past the inserted nodes to avoid re-visiting.
      return [SKIP, index + replacements.length];
    });
  };
}

export default remarkGlossaryAutolink;
