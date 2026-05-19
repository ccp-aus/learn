/**
 * localStorage-backed learner progress.
 *
 * No accounts. No server. The user owns their data and can export/import
 * a JSON snapshot from /settings/. Wiping browser storage = factory reset.
 *
 * Schema is versioned — future migrations should bump VERSION and ship a
 * migration in `migrate()`.
 */

export const PROGRESS_KEY = "learnmsp:progress";
const VERSION = 1;

export interface QuizScore {
  best: number;            // 0..1
  attempts: number;
  lastAttempt: string;     // ISO timestamp
}

export interface ProgressData {
  version: number;
  /** lessonSlug -> ISO timestamp of completion */
  completedLessons: Record<string, string>;
  /** vendor-level resume marker: "{vendor}-{level}" -> lessonSlug */
  resume: Record<string, string>;
  /** quizSlug -> QuizScore */
  quizScores: Record<string, QuizScore>;
  /** ISO timestamp of last write */
  updated: string;
}

function emptyProgress(): ProgressData {
  return {
    version: VERSION,
    completedLessons: {},
    resume: {},
    quizScores: {},
    updated: new Date().toISOString(),
  };
}

function migrate(raw: unknown): ProgressData {
  if (!raw || typeof raw !== "object") return emptyProgress();
  const obj = raw as Partial<ProgressData>;
  if (obj.version === VERSION && obj.completedLessons && obj.quizScores) {
    return {
      version: VERSION,
      completedLessons: obj.completedLessons ?? {},
      resume: obj.resume ?? {},
      quizScores: obj.quizScores ?? {},
      updated: obj.updated ?? new Date().toISOString(),
    };
  }
  // Unknown / older shape — start fresh but don't lose anything that maps cleanly
  return {
    ...emptyProgress(),
    completedLessons: obj.completedLessons ?? {},
    quizScores: obj.quizScores ?? {},
  };
}

export function readProgress(): ProgressData {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(p: ProgressData) {
  if (typeof window === "undefined") return;
  const next = { ...p, updated: new Date().toISOString() };
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent("learnmsp:progress-changed", { detail: next }),
  );
}

export function isLessonComplete(lessonSlug: string): boolean {
  return Boolean(readProgress().completedLessons[lessonSlug]);
}

export function setLessonComplete(lessonSlug: string, complete = true) {
  const p = readProgress();
  if (complete) {
    p.completedLessons[lessonSlug] = new Date().toISOString();
  } else {
    delete p.completedLessons[lessonSlug];
  }
  writeProgress(p);
}

export function setResumeMarker(
  vendor: string,
  level: string,
  lessonSlug: string,
) {
  const p = readProgress();
  p.resume[`${vendor}-${level}`] = lessonSlug;
  writeProgress(p);
}

export function getResumeMarker(
  vendor: string,
  level: string,
): string | undefined {
  return readProgress().resume[`${vendor}-${level}`];
}

export function recordQuizScore(quizSlug: string, score: number) {
  const p = readProgress();
  const existing = p.quizScores[quizSlug];
  p.quizScores[quizSlug] = {
    best: existing ? Math.max(existing.best, score) : score,
    attempts: (existing?.attempts ?? 0) + 1,
    lastAttempt: new Date().toISOString(),
  };
  writeProgress(p);
}

export function exportProgress(): string {
  return JSON.stringify(readProgress(), null, 2);
}

export function importProgress(json: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json);
    const migrated = migrate(parsed);
    writeProgress(migrated);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "invalid JSON" };
  }
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_KEY);
  window.dispatchEvent(new CustomEvent("learnmsp:progress-changed"));
}

export function courseCompletion(lessonSlugs: string[]): {
  done: number;
  total: number;
  pct: number;
} {
  const p = readProgress();
  const total = lessonSlugs.length;
  const done = lessonSlugs.filter((s) => p.completedLessons[s]).length;
  const pct = total === 0 ? 0 : done / total;
  return { done, total, pct };
}
