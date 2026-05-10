import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  drawAttempt,
  emptyAnswer,
  scoreAttempt,
  type Answer,
  type Question,
  type QuizDef,
} from "@/lib/quiz";
import { recordQuizScore, readProgress } from "@/lib/progress";
import { QuestionRenderer } from "@/components/learning/QuestionRenderer";

interface Props {
  /** Quiz slug; data is fetched from /quizzes/<slug>.json */
  slug: string;
  /** Optional inline data (skips fetch). Used by Checkpoint. */
  data?: QuizDef;
  /** Render compact for inline checkpoints. */
  compact?: boolean;
  /** Persist score to localStorage. Off by default for checkpoints. */
  persistScore?: boolean;
  /** Optional callback when the user finishes. */
  onFinished?: (ratio: number) => void;
}

type Phase = "loading" | "intro" | "running" | "finished";

export function Quiz({
  slug,
  data,
  compact = false,
  persistScore = true,
  onFinished,
}: Props) {
  const [phase, setPhase] = React.useState<Phase>(data ? "intro" : "loading");
  const [quiz, setQuiz] = React.useState<QuizDef | null>(data ?? null);
  const [error, setError] = React.useState<string | null>(null);
  const [attempt, setAttempt] = React.useState<Question[]>([]);
  const [answers, setAnswers] = React.useState<(Answer | null)[]>([]);
  const [idx, setIdx] = React.useState(0);
  const [bestRatio, setBestRatio] = React.useState<number | null>(null);
  const [attempts, setAttempts] = React.useState<number>(0);

  React.useEffect(() => {
    if (data) return;
    let cancel = false;
    fetch(`/quizzes/${slug}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<QuizDef>;
      })
      .then((q) => {
        if (cancel) return;
        setQuiz(q);
        setPhase("intro");
      })
      .catch((e) => {
        if (cancel) return;
        setError(e instanceof Error ? e.message : "failed to load quiz");
        setPhase("intro");
      });
    return () => {
      cancel = true;
    };
  }, [slug, data]);

  // Pull existing best score / attempts on mount
  React.useEffect(() => {
    if (!quiz) return;
    const p = readProgress();
    const score = p.quizScores[quiz.slug];
    if (score) {
      setBestRatio(score.best);
      setAttempts(score.attempts);
    }
  }, [quiz?.slug]);

  const startAttempt = () => {
    if (!quiz) return;
    const drawn = drawAttempt(quiz, `${quiz.slug}-${Date.now()}-${attempts}`);
    setAttempt(drawn);
    setAnswers(drawn.map((q) => emptyAnswer(q)));
    setIdx(0);
    setPhase("running");
  };

  const handleSubmitted = (_wasCorrect: boolean) => {
    // Currently we don't snapshot per-question answer state externally;
    // QuestionRenderer manages its own UI state and only reports correctness.
    // (Could be expanded later if we want question-level analytics.)
  };

  const handleAdvance = () => {
    if (idx + 1 < attempt.length) {
      setIdx(idx + 1);
    } else {
      finalize();
    }
  };

  const finalize = () => {
    // Recompute by replaying answers — but since QuestionRenderer is
    // self-contained, we capture correctness via DOM-less mechanism: ask the
    // user to remember? No — we instead score by holding answers in this
    // component. To keep this simple we'll re-derive correctness by asking
    // the renderer to report — that's what `onSubmitted` already does. Maintain
    // a parallel correctness array.
    setPhase("finished");
  };

  if (phase === "loading") {
    return (
      <div className="my-8 flex items-center gap-2 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading quiz…
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="my-8 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Couldn't load quiz <code>{slug}</code>: {error}
      </div>
    );
  }

  if (!quiz) return null;

  const containerClass = compact
    ? "my-6 rounded-lg border border-border bg-card p-5"
    : "my-10 rounded-xl border border-border bg-card p-6 sm:p-8";

  if (phase === "intro") {
    const passPct = Math.round(quiz.passThreshold * 100);
    const drawN =
      quiz.drawCount && quiz.drawCount > 0
        ? quiz.drawCount
        : quiz.questions.length;
    return (
      <section className={containerClass}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{quiz.title}</h2>
          {bestRatio !== null && (
            <Badge variant="secondary" className="font-mono">
              Best: {Math.round(bestRatio * 100)}%
              <span className="ml-1.5 opacity-60">
                ({attempts} attempt{attempts === 1 ? "" : "s"})
              </span>
            </Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {drawN} question{drawN === 1 ? "" : "s"}, drawn from a pool of{" "}
          {quiz.questions.length}. Pass mark: {passPct}%. Wrong answers
          show the explanation immediately so you can correct on the spot.
        </p>
        <div className="mt-5">
          <Button onClick={startAttempt}>
            {attempts > 0 ? "Try again" : "Start quiz"} →
          </Button>
        </div>
      </section>
    );
  }

  if (phase === "running") {
    return (
      <section className={containerClass}>
        <header className="mb-4 flex items-center gap-3">
          <h2 className="text-base font-semibold tracking-tight">
            {quiz.title}
          </h2>
          <ProgressDots count={attempt.length} idx={idx} />
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={attempt[idx].id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <RunningQuestion
              question={attempt[idx]}
              questionIndex={idx}
              total={attempt.length}
              onSubmitted={(wasCorrect) => {
                const next = [...answers];
                next[idx] = wasCorrect
                  ? // store a sentinel non-empty answer so isCorrect-based scoring works on review
                    encodeAsCorrect(attempt[idx])
                  : encodeAsIncorrect(attempt[idx]);
                setAnswers(next);
                handleSubmitted(wasCorrect);
              }}
              onAdvance={handleAdvance}
              isLast={idx + 1 >= attempt.length}
            />
          </motion.div>
        </AnimatePresence>
      </section>
    );
  }

  // phase === finished
  const score = scoreAttempt(attempt, answers);
  const passed = score.ratio >= quiz.passThreshold;

  // Persist score on first paint of finished phase
  return (
    <FinishedView
      compact={compact}
      quiz={quiz}
      score={score}
      passed={passed}
      onPersist={
        persistScore
          ? () => {
              recordQuizScore(quiz.slug, score.ratio);
              const p = readProgress();
              const s = p.quizScores[quiz.slug];
              if (s) {
                setBestRatio(s.best);
                setAttempts(s.attempts);
              }
              onFinished?.(score.ratio);
            }
          : undefined
      }
      onRetry={startAttempt}
    />
  );
}

function ProgressDots({ count, idx }: { count: number; idx: number }) {
  return (
    <div className="flex flex-1 gap-1.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={
            i < idx
              ? "h-1 flex-1 rounded-full bg-primary"
              : i === idx
                ? "h-1 flex-1 rounded-full bg-primary/60"
                : "h-1 flex-1 rounded-full bg-muted"
          }
        />
      ))}
    </div>
  );
}

function FinishedView({
  compact,
  quiz,
  score,
  passed,
  onPersist,
  onRetry,
}: {
  compact: boolean;
  quiz: QuizDef;
  score: { correct: number; total: number; ratio: number };
  passed: boolean;
  onPersist?: () => void;
  onRetry: () => void;
}) {
  React.useEffect(() => {
    onPersist?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className={
        compact
          ? "my-6 rounded-lg border border-border bg-card p-6 text-center"
          : "my-10 rounded-xl border border-border bg-card p-8 text-center"
      }
    >
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary mb-3">
        <Trophy className="h-5 w-5" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">
        {passed ? "Nicely done." : "Close — give it another go."}
      </h2>
      <div className="mt-2 font-mono text-3xl tabular-nums">
        {Math.round(score.ratio * 100)}%
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {score.correct} of {score.total} correct
        {" · "}pass mark {Math.round(quiz.passThreshold * 100)}%
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={onRetry} variant="default">
          <RotateCcw className="h-4 w-4" /> New attempt
        </Button>
      </div>
    </section>
  );
}

/* ---------- correctness encoding helpers ----------
 * The QuestionRenderer is self-contained and only reports correctness to its
 * parent. To later compute final scores via scoreAttempt, we synthesize a
 * minimal Answer that will round-trip through isCorrect() with the same
 * verdict the user actually saw.
 */
function encodeAsCorrect(q: Question): Answer {
  switch (q.type) {
    case "mcq":
      return { type: "mcq", pick: q.correct };
    case "multi":
      return { type: "multi", picks: [...q.correct] };
    case "tf":
      return { type: "tf", pick: q.correct };
    case "hotspot":
      return { type: "hotspot", pick: { x: q.target.x, y: q.target.y } };
    case "order":
      return { type: "order", arrangement: [...q.items] };
  }
}

function encodeAsIncorrect(q: Question): Answer {
  switch (q.type) {
    case "mcq":
      return { type: "mcq", pick: (q.correct + 1) % q.choices.length };
    case "multi":
      return { type: "multi", picks: [] };
    case "tf":
      return { type: "tf", pick: !q.correct };
    case "hotspot":
      // Far enough to definitely miss
      return { type: "hotspot", pick: { x: 0, y: 0 } };
    case "order": {
      const swapped = [...q.items];
      if (swapped.length >= 2) {
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
      }
      return { type: "order", arrangement: swapped };
    }
  }
}

/**
 * Wrapper used inside the running phase. We re-export QuestionRenderer here
 * just for clarity.
 */
function RunningQuestion(props: React.ComponentProps<typeof QuestionRenderer>) {
  return <QuestionRenderer {...props} />;
}

export default Quiz;
