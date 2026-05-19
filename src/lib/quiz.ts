/**
 * Quiz state machine + helpers.
 *
 * Pure data — UI lives in <Quiz /> and <Checkpoint />.
 * Persistence delegates to lib/progress.ts.
 */

export interface BaseQ {
  id: string;
  prompt: string;
  explanation: string;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
}

/**
 * Choice is either a plain string (label only) or a rich object that
 * carries a per-choice rationale. The rationale shows next to the choice
 * when the learner picks it and is wrong, so wrong answers teach the
 * specific trap rather than displaying a generic "not that one." Authors
 * should write the rationale to explain WHY the look-alike is wrong —
 * the example we lean on: "ping resolves the name but shows one IP only;
 * a domain with multiple A records or a CNAME chain hides behind that."
 */
export type Choice = string | { label: string; rationale?: string };

export function choiceLabel(c: Choice): string {
  return typeof c === "string" ? c : c.label;
}

export function choiceRationale(c: Choice): string | undefined {
  return typeof c === "string" ? undefined : c.rationale;
}

export type Question =
  | (BaseQ & { type: "mcq"; choices: Choice[]; correct: number })
  | (BaseQ & { type: "multi"; choices: Choice[]; correct: number[] })
  | (BaseQ & { type: "tf"; correct: boolean })
  | (BaseQ & {
      type: "hotspot";
      image: string;
      imageAlt?: string;
      target: { x: number; y: number; r: number };
    })
  | (BaseQ & { type: "order"; items: string[] })
  | (BaseQ & {
      type: "fill";
      blanks: {
        answer: string;
        alternatives?: string[];
        placeholder?: string;
        label?: string;
      }[];
    })
  | (BaseQ & {
      type: "label";
      image: string;
      imageAlt?: string;
      zones: { x: number; y: number; w: number; h: number; label: string }[];
      distractors?: string[];
    });

export type QuizDef = {
  slug: string;
  title: string;
  drawCount: number;
  passThreshold: number;
  questions: Question[];
};

export type Answer =
  | { type: "mcq"; pick: number | null }
  | { type: "multi"; picks: number[] }
  | { type: "tf"; pick: boolean | null }
  | { type: "hotspot"; pick: { x: number; y: number } | null }
  | { type: "order"; arrangement: string[] }
  | { type: "fill"; values: string[] }
  | { type: "label"; assignments: (string | null)[] };

/** Returns true iff `answer` is a fully-correct answer to `q`. */
export function isCorrect(q: Question, answer: Answer | null): boolean {
  if (!answer) return false;
  switch (q.type) {
    case "mcq":
      return answer.type === "mcq" && answer.pick === q.correct;
    case "multi": {
      if (answer.type !== "multi") return false;
      const a = [...answer.picks].sort();
      const b = [...q.correct].sort();
      if (a.length !== b.length) return false;
      return a.every((v, i) => v === b[i]);
    }
    case "tf":
      return answer.type === "tf" && answer.pick === q.correct;
    case "hotspot": {
      if (answer.type !== "hotspot" || !answer.pick) return false;
      const dx = answer.pick.x - q.target.x;
      const dy = answer.pick.y - q.target.y;
      return Math.sqrt(dx * dx + dy * dy) <= q.target.r;
    }
    case "order": {
      if (answer.type !== "order") return false;
      if (answer.arrangement.length !== q.items.length) return false;
      return answer.arrangement.every((v, i) => v === q.items[i]);
    }
    case "fill": {
      if (answer.type !== "fill") return false;
      if (answer.values.length !== q.blanks.length) return false;
      const norm = (s: string) => s.trim().toLowerCase();
      return answer.values.every((v, i) => {
        const b = q.blanks[i];
        const accepted = [b.answer, ...(b.alternatives ?? [])].map(norm);
        return accepted.includes(norm(v));
      });
    }
    case "label": {
      if (answer.type !== "label") return false;
      if (answer.assignments.length !== q.zones.length) return false;
      return answer.assignments.every((a, i) => a === q.zones[i].label);
    }
  }
}

/** Mulberry32 — deterministic PRNG seeded from a string for reproducible quiz draws. */
function mulberry32(seed: number) {
  let a = seed | 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Draw an attempt: shuffle the bank, take `drawCount` (or all if 0). */
export function drawAttempt(quiz: QuizDef, attemptSeed?: string): Question[] {
  const seed = hashString(
    attemptSeed ?? `${quiz.slug}:${Date.now()}`,
  );
  const rng = mulberry32(seed);
  const shuffled = shuffle(quiz.questions, rng);
  const n = quiz.drawCount && quiz.drawCount > 0
    ? Math.min(quiz.drawCount, shuffled.length)
    : shuffled.length;
  return shuffled.slice(0, n);
}

export function emptyAnswer(q: Question): Answer {
  switch (q.type) {
    case "mcq":
      return { type: "mcq", pick: null };
    case "multi":
      return { type: "multi", picks: [] };
    case "tf":
      return { type: "tf", pick: null };
    case "hotspot":
      return { type: "hotspot", pick: null };
    case "order":
      // Pre-shuffle so the user has draggable rows on first paint.
      // Done here (not in the renderer) because parent + child useEffects
      // race on mount, and a renderer-side shuffle gets clobbered by the
      // parent's reset-to-empty effect. Correctness still compares to q.items.
      return { type: "order", arrangement: shuffle(q.items) };
    case "fill":
      return { type: "fill", values: q.blanks.map(() => "") };
    case "label":
      return { type: "label", assignments: q.zones.map(() => null) };
  }
}

export function scoreAttempt(
  qs: Question[],
  answers: (Answer | null)[],
): { correct: number; total: number; ratio: number } {
  let correct = 0;
  qs.forEach((q, i) => {
    if (isCorrect(q, answers[i])) correct += 1;
  });
  const total = qs.length;
  return { correct, total, ratio: total === 0 ? 0 : correct / total };
}
