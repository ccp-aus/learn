/**
 * Vite plugin: prepends a standard set of learning-component imports to every
 * lesson MDX file before MDX's compiler sees it. This keeps lesson authors
 * (human or LLM-pipeline) free of the import boilerplate.
 *
 * Only fires for files under src/content/lessons/.
 */

const IMPORTS = `import { Term } from "@/components/learning/Term";
import { Callout } from "@/components/learning/Callout";
import { Kbd } from "@/components/learning/Kbd";
import { AnnotatedScreenshot, Hotspot } from "@/components/learning/AnnotatedScreenshot";
import { StepThrough, Step } from "@/components/learning/StepThrough";
import { StepCheck } from "@/components/learning/StepCheck";
import { DecisionTree } from "@/components/learning/DecisionTree";
import { Checkpoint } from "@/components/learning/Checkpoint";
import { AnnotatedCode } from "@/components/learning/AnnotatedCode";
import { Diff } from "@/components/learning/Diff";
import { JsonExplorer } from "@/components/learning/JsonExplorer";
import { Ticket } from "@/components/learning/Ticket";
import { Estimate } from "@/components/learning/Estimate";
import { Console } from "@/components/learning/Console";
import { Runbook } from "@/components/learning/Runbook";
import { Recall } from "@/components/learning/Recall";

`;

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

export function viteLessonImports() {
  return {
    name: "learnmsp-lesson-imports",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".mdx")) return null;
      const norm = id.replace(/\\/g, "/");
      if (!norm.includes("/content/lessons/")) return null;
      // Skip if imports already present (idempotent)
      if (code.includes("@/components/learning/")) return null;

      const fmMatch = code.match(FRONTMATTER_RE);
      const out = fmMatch
        ? code.slice(0, fmMatch[0].length) +
          IMPORTS +
          code.slice(fmMatch[0].length)
        : IMPORTS + code;
      return { code: out, map: null };
    },
  };
}

export default viteLessonImports;
