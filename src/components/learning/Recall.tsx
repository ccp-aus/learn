import * as React from "react";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type Answer,
  type Question,
  type QuizDef,
  emptyAnswer,
  isCorrect,
  shuffle,
} from "@/lib/quiz";
import { QuestionRenderer } from "@/components/learning/QuestionRenderer";

interface Props {
  /** Quiz slugs to pull questions from. The component fetches each, pools the questions, and picks `count`. */
  pool: string[];
  /** Number of questions to surface. Defaults to 2. */
  count?: number;
  /** Header label. Defaults to "Quick recall". */
  title?: string;
  className?: string;
}

type Phase = "loading" | "ready" | "running" | "done" | "error";

/**
 * Recall — top-of-lesson spaced-repetition panel. Pulls a small number of
 * questions from previously-completed quizzes and presents them as a brief
 * recall warmup. Persistence-free (recall, not assessment).
 *
 * In production this would gate on which quizzes the visitor has already
 * completed (from localStorage `completedLessons`); for the kitchen-sink
 * demo we always show the configured pool.
 */
export function Recall({
  pool,
  count = 2,
  title = "Quick recall",
  className,
}: Props) {
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [idx, setIdx] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fetched = await Promise.all(
          pool.map(async (slug) => {
            const r = await fetch(`/quizzes/${slug}.json`);
            if (!r.ok) throw new Error(`${slug}: HTTP ${r.status}`);
            return (await r.json()) as QuizDef;
          }),
        );
        if (cancelled) return;
        const all = fetched.flatMap((q) => q.questions);
        const picked = shuffle(all).slice(0, Math.min(count, all.length));
        setQuestions(picked);
        setPhase("ready");
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pool.join("|"), count]);

  if (phase === "loading") {
    return (
      <Card className={className}>
        <Header title={title} subtitle="Loading…" />
        <div className="px-5 py-6 text-sm text-muted-foreground">
          <Loader2 className="inline h-4 w-4 animate-spin" />
        </div>
      </Card>
    );
  }
  if (phase === "error") {
    return (
      <Card className={className}>
        <Header title={title} subtitle="Pool unavailable" />
        <p className="px-5 py-4 text-sm text-muted-foreground">
          Couldn't load recall questions: {error}
        </p>
      </Card>
    );
  }
  if (phase === "ready") {
    return (
      <Card className={className}>
        <Header
          title={title}
          subtitle={`${questions.length} from earlier lessons`}
        />
        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground">
            A quick check on what you've already seen, before today's lesson.
            Wrong answers explain themselves; nothing is scored.
          </p>
          <div className="mt-3 flex justify-end">
            <Button onClick={() => setPhase("running")}>Start →</Button>
          </div>
        </div>
      </Card>
    );
  }
  if (phase === "done") {
    return (
      <Card className={className}>
        <Header title={title} subtitle="Done" />
        <p className="px-5 py-4 text-sm text-muted-foreground">
          Carrying on with the new lesson. ↓
        </p>
      </Card>
    );
  }
  // running
  const current = questions[idx];
  return (
    <Card className={className}>
      <Header
        title={title}
        subtitle={`Q ${idx + 1} of ${questions.length}`}
      />
      <div className="px-5 py-4">
        <RecallQuestion
          key={current.id}
          question={current}
          onAdvance={() => {
            if (idx + 1 >= questions.length) setPhase("done");
            else setIdx((i) => i + 1);
          }}
          isLast={idx + 1 >= questions.length}
        />
      </div>
    </Card>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={cn(
        "my-6 overflow-hidden rounded-lg border border-primary/30 bg-primary/[0.03]",
        className,
      )}
      aria-label="Spaced-repetition recall"
    >
      {children}
    </aside>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center gap-2 border-b border-border/60 bg-primary/[0.04] px-5 py-2 text-xs">
      <Brain className="h-4 w-4 text-primary" />
      <span className="font-semibold tracking-tight text-foreground">
        {title}
      </span>
      {subtitle && (
        <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">
          {subtitle}
        </span>
      )}
    </header>
  );
}

function RecallQuestion({
  question,
  onAdvance,
  isLast,
}: {
  question: Question;
  onAdvance: () => void;
  isLast: boolean;
}) {
  // Reuse QuestionRenderer but ignore the scored callback; we don't persist.
  return (
    <QuestionRenderer
      question={question}
      questionIndex={0}
      total={1}
      onSubmitted={() => {}}
      onAdvance={onAdvance}
      isLast={isLast}
    />
  );
}

export default Recall;
