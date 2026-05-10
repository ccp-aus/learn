import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Lightbulb, GripVertical, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type Question,
  type Answer,
  emptyAnswer,
  isCorrect,
  shuffle,
} from "@/lib/quiz";

interface Props {
  question: Question;
  questionIndex: number;
  total: number;
  /** Called once the user has submitted AND viewed the explanation; receives whether their answer was correct. */
  onSubmitted: (wasCorrect: boolean) => void;
  /** Called when the user clicks "Continue" after seeing the result. */
  onAdvance: () => void;
  isLast?: boolean;
}

export function QuestionRenderer({
  question,
  questionIndex,
  total,
  onSubmitted,
  onAdvance,
  isLast,
}: Props) {
  const [answer, setAnswer] = React.useState<Answer>(() =>
    emptyAnswer(question),
  );
  const [submitted, setSubmitted] = React.useState(false);
  const correct = submitted ? isCorrect(question, answer) : false;

  // Reset when question changes
  React.useEffect(() => {
    setAnswer(emptyAnswer(question));
    setSubmitted(false);
  }, [question.id]);

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    onSubmitted(isCorrect(question, answer));
  };

  const canSubmit = !submitted && !isAnswerEmpty(answer);

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          Question {questionIndex + 1} of {total}
        </span>
        {question.topic && (
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {question.topic}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold leading-snug tracking-tight">
        {question.prompt}
      </h3>

      <Body
        question={question}
        answer={answer}
        setAnswer={setAnswer}
        submitted={submitted}
      />

      <AnimatePresence initial={false}>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "mt-2 rounded-md border-l-2 px-4 py-3",
                correct
                  ? "border-emerald-500/60 bg-emerald-500/5"
                  : "border-amber-500/60 bg-amber-500/5",
              )}
            >
              <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                {correct ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500">Correct</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500">
                      Not quite — here's the why
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm leading-relaxed text-foreground/85">
                {question.explanation}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-2 pt-2">
        {!submitted && (
          <Button onClick={submit} disabled={!canSubmit}>
            Check answer
          </Button>
        )}
        {submitted && (
          <Button onClick={onAdvance} variant="default">
            {isLast ? "See results" : "Continue"} →
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------- per-type bodies ---------- */

function isAnswerEmpty(a: Answer): boolean {
  switch (a.type) {
    case "mcq":
      return a.pick === null;
    case "multi":
      return a.picks.length === 0;
    case "tf":
      return a.pick === null;
    case "hotspot":
      return a.pick === null;
    case "order":
      return a.arrangement.length === 0;
  }
}

function Body({
  question,
  answer,
  setAnswer,
  submitted,
}: {
  question: Question;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  switch (question.type) {
    case "mcq":
      return (
        <MCQBody
          q={question}
          answer={answer as Extract<Answer, { type: "mcq" }>}
          setAnswer={setAnswer}
          submitted={submitted}
        />
      );
    case "multi":
      return (
        <MultiBody
          q={question}
          answer={answer as Extract<Answer, { type: "multi" }>}
          setAnswer={setAnswer}
          submitted={submitted}
        />
      );
    case "tf":
      return (
        <TFBody
          q={question}
          answer={answer as Extract<Answer, { type: "tf" }>}
          setAnswer={setAnswer}
          submitted={submitted}
        />
      );
    case "hotspot":
      return (
        <HotspotBody
          q={question}
          answer={answer as Extract<Answer, { type: "hotspot" }>}
          setAnswer={setAnswer}
          submitted={submitted}
        />
      );
    case "order":
      return (
        <OrderBody
          q={question}
          answer={answer as Extract<Answer, { type: "order" }>}
          setAnswer={setAnswer}
          submitted={submitted}
        />
      );
  }
}

function MCQBody({
  q,
  answer,
  setAnswer,
  submitted,
}: {
  q: Extract<Question, { type: "mcq" }>;
  answer: Extract<Answer, { type: "mcq" }>;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  return (
    <div className="grid gap-2">
      {q.choices.map((c, i) => {
        const selected = answer.pick === i;
        const isAnswer = i === q.correct;
        return (
          <button
            key={i}
            type="button"
            disabled={submitted}
            onClick={() => setAnswer({ type: "mcq", pick: i })}
            className={cn(
              "group flex items-center gap-3 rounded-md border bg-background px-4 py-3 text-left text-sm transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              "disabled:cursor-not-allowed",
              !submitted && selected && "border-primary bg-primary/10",
              !submitted && !selected && "border-border",
              submitted &&
                isAnswer &&
                "border-emerald-500/60 bg-emerald-500/10",
              submitted &&
                !isAnswer &&
                selected &&
                "border-rose-500/60 bg-rose-500/10",
              submitted && !isAnswer && !selected && "border-border opacity-60",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-mono",
                !submitted && selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-muted-foreground",
                submitted &&
                  isAnswer &&
                  "border-emerald-500 bg-emerald-500 text-white",
                submitted &&
                  !isAnswer &&
                  selected &&
                  "border-rose-500 bg-rose-500 text-white",
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span>{c}</span>
            {submitted && isAnswer && (
              <Check className="ml-auto h-4 w-4 text-emerald-500" />
            )}
            {submitted && !isAnswer && selected && (
              <X className="ml-auto h-4 w-4 text-rose-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function MultiBody({
  q,
  answer,
  setAnswer,
  submitted,
}: {
  q: Extract<Question, { type: "multi" }>;
  answer: Extract<Answer, { type: "multi" }>;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  const toggle = (i: number) => {
    const set = new Set(answer.picks);
    if (set.has(i)) set.delete(i);
    else set.add(i);
    setAnswer({ type: "multi", picks: [...set].sort() });
  };
  const correct = new Set(q.correct);
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Select all that apply
      </p>
      {q.choices.map((c, i) => {
        const selected = answer.picks.includes(i);
        const isAnswer = correct.has(i);
        return (
          <button
            key={i}
            type="button"
            disabled={submitted}
            onClick={() => toggle(i)}
            className={cn(
              "group flex items-center gap-3 rounded-md border bg-background px-4 py-3 text-left text-sm transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              "disabled:cursor-not-allowed",
              !submitted && selected && "border-primary bg-primary/10",
              !submitted && !selected && "border-border",
              submitted &&
                isAnswer &&
                "border-emerald-500/60 bg-emerald-500/10",
              submitted &&
                !isAnswer &&
                selected &&
                "border-rose-500/60 bg-rose-500/10",
              submitted && !isAnswer && !selected && "border-border opacity-60",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border",
                selected ? "border-primary bg-primary" : "border-border",
                submitted && isAnswer && "border-emerald-500 bg-emerald-500",
                submitted &&
                  !isAnswer &&
                  selected &&
                  "border-rose-500 bg-rose-500",
              )}
            >
              {selected && <Check className="h-3 w-3 text-primary-foreground" />}
            </span>
            <span>{c}</span>
            {submitted && isAnswer && !selected && (
              <span className="ml-auto text-[11px] uppercase tracking-wider text-emerald-500">
                Should pick
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function TFBody({
  q,
  answer,
  setAnswer,
  submitted,
}: {
  q: Extract<Question, { type: "tf" }>;
  answer: Extract<Answer, { type: "tf" }>;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  const Choice = (label: string, value: boolean) => {
    const selected = answer.pick === value;
    const isAnswer = q.correct === value;
    return (
      <button
        key={label}
        type="button"
        disabled={submitted}
        onClick={() => setAnswer({ type: "tf", pick: value })}
        className={cn(
          "rounded-md border bg-background px-5 py-3 text-sm font-medium transition-all",
          "hover:border-primary/50 hover:bg-primary/5",
          !submitted && selected && "border-primary bg-primary/10",
          !submitted && !selected && "border-border",
          submitted &&
            isAnswer &&
            "border-emerald-500/60 bg-emerald-500/10 text-emerald-500",
          submitted &&
            !isAnswer &&
            selected &&
            "border-rose-500/60 bg-rose-500/10 text-rose-500",
          submitted && !isAnswer && !selected && "border-border opacity-60",
        )}
      >
        {label}
      </button>
    );
  };
  return <div className="flex gap-3">{[Choice("True", true), Choice("False", false)]}</div>;
}

function HotspotBody({
  q,
  answer,
  setAnswer,
  submitted,
}: {
  q: Extract<Question, { type: "hotspot" }>;
  answer: Extract<Answer, { type: "hotspot" }>;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (submitted || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setAnswer({ type: "hotspot", pick: { x, y } });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MousePointerClick className="h-3.5 w-3.5" />
        Click on the screenshot where you'd take the action.
      </div>
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-muted",
          submitted ? "cursor-default" : "cursor-crosshair",
        )}
      >
        <img
          src={q.image}
          alt={q.imageAlt ?? q.prompt}
          loading="lazy"
          decoding="async"
          className="block w-full select-none"
          draggable={false}
        />
        {answer.pick && (
          <div
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full ring-4",
              submitted
                ? isCorrect(q, answer)
                  ? "bg-emerald-500 ring-emerald-500/30"
                  : "bg-rose-500 ring-rose-500/30"
                : "bg-primary ring-primary/30",
            )}
            style={{ left: `${answer.pick.x}%`, top: `${answer.pick.y}%` }}
            aria-hidden="true"
          />
        )}
        {submitted && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-500 ring-2 ring-emerald-500/40"
            style={{
              left: `${q.target.x}%`,
              top: `${q.target.y}%`,
              width: `${q.target.r * 2}%`,
              height: `${q.target.r * 2}%`,
            }}
            aria-label="Correct hotspot zone"
          />
        )}
      </div>
    </div>
  );
}

function OrderBody({
  q,
  answer,
  setAnswer,
  submitted,
}: {
  q: Extract<Question, { type: "order" }>;
  answer: Extract<Answer, { type: "order" }>;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  // Defensive backfill: shouldn't fire now that emptyAnswer pre-shuffles, but
  // guards against external state seeding empties.
  React.useEffect(() => {
    if (answer.arrangement.length === 0) {
      setAnswer({ type: "order", arrangement: shuffle(q.items) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  const [dragIdx, setDragIdx] = React.useState<number | null>(null);
  const [overIdx, setOverIdx] = React.useState<number | null>(null);

  const move = (idx: number, dir: -1 | 1) => {
    if (submitted) return;
    const next = [...answer.arrangement];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setAnswer({ type: "order", arrangement: next });
  };

  const moveTo = (from: number, to: number) => {
    if (submitted || from === to) return;
    const next = [...answer.arrangement];
    const [taken] = next.splice(from, 1);
    next.splice(to, 0, taken);
    setAnswer({ type: "order", arrangement: next });
  };

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Drag a row, or use the arrow buttons, to put items in the correct order.
      </p>
      <ol className="space-y-2">
        <AnimatePresence initial={false}>
          {answer.arrangement.map((item, i) => {
            const expected = q.items[i];
            const ok = submitted && expected === item;
            const wrong = submitted && expected !== item;
            const isDragging = dragIdx === i;
            const isDropTarget = overIdx === i && dragIdx !== null && dragIdx !== i;
            return (
              <motion.li
                key={item}
                layout
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 32,
                  mass: 0.6,
                }}
                draggable={!submitted}
                onDragStart={(e) => {
                  if (submitted) return;
                  // Required for Firefox.
                  (e as unknown as DragEvent).dataTransfer?.setData(
                    "text/plain",
                    String(i),
                  );
                  setDragIdx(i);
                }}
                onDragOver={(e) => {
                  if (submitted || dragIdx === null) return;
                  e.preventDefault();
                  if (overIdx !== i) setOverIdx(i);
                }}
                onDrop={(e) => {
                  if (submitted) return;
                  e.preventDefault();
                  if (dragIdx !== null) moveTo(dragIdx, i);
                  setDragIdx(null);
                  setOverIdx(null);
                }}
                onDragEnd={() => {
                  setDragIdx(null);
                  setOverIdx(null);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 text-sm select-none",
                  !submitted && "cursor-grab active:cursor-grabbing border-border",
                  isDragging && "opacity-50",
                  isDropTarget && "ring-2 ring-primary/50",
                  ok && "border-emerald-500/60 bg-emerald-500/10",
                  wrong && "border-rose-500/60 bg-rose-500/10",
                )}
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground w-5">
                  {i + 1}.
                </span>
                <span className="flex-1">{item}</span>
                {!submitted && (
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => move(i, 1)}
                      disabled={i === answer.arrangement.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </Button>
                  </div>
                )}
                {wrong && (
                  <span className="text-[11px] uppercase tracking-wider text-rose-500">
                    Should be: {expected}
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}

export default QuestionRenderer;
