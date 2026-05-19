import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Lightbulb, GripVertical, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type Question,
  type Answer,
  type Choice,
  choiceLabel,
  choiceRationale,
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
    case "fill":
      return a.values.every((v) => v.trim() === "");
    case "label":
      return a.assignments.every((v) => v === null);
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
    case "fill":
      return (
        <FillBody
          q={question}
          answer={answer as Extract<Answer, { type: "fill" }>}
          setAnswer={setAnswer}
          submitted={submitted}
        />
      );
    case "label":
      return (
        <LabelBody
          q={question}
          answer={answer as Extract<Answer, { type: "label" }>}
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
  // Shuffle the displayed order so the correct answer isn't always in the
  // authored position. answer.pick stays as the source index; we map between
  // displayed and source.
  const order = React.useMemo(
    () => shuffle(q.choices.map((_, i) => i)),
    [q.id],
  );
  return (
    <div className="grid gap-2">
      {order.map((i, displayIdx) => {
        const c = q.choices[i];
        const selected = answer.pick === i;
        const isAnswer = i === q.correct;
        const rationale = choiceRationale(c);
        const showRationale =
          submitted && !isAnswer && selected && rationale;
        return (
          <div key={i}>
            <button
              type="button"
              disabled={submitted}
              onClick={() => setAnswer({ type: "mcq", pick: i })}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md border bg-background px-4 py-3 text-left text-sm transition-all",
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
                {String.fromCharCode(65 + displayIdx)}
              </span>
              <span>{choiceLabel(c)}</span>
              {submitted && isAnswer && (
                <Check className="ml-auto h-4 w-4 text-emerald-500" />
              )}
              {submitted && !isAnswer && selected && (
                <X className="ml-auto h-4 w-4 text-rose-500" />
              )}
            </button>
            {showRationale && (
              <p className="mt-1.5 ml-9 text-xs leading-relaxed text-rose-500/90">
                {rationale}
              </p>
            )}
          </div>
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
  const order = React.useMemo(
    () => shuffle(q.choices.map((_, i) => i)),
    [q.id],
  );
  return (
    <div className="grid gap-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Select all that apply
      </p>
      {order.map((i) => {
        const c = q.choices[i];
        const selected = answer.picks.includes(i);
        const isAnswer = correct.has(i);
        const rationale = choiceRationale(c);
        const showRationale =
          submitted && !isAnswer && selected && rationale;
        return (
          <div key={i}>
            <button
              type="button"
              disabled={submitted}
              onClick={() => toggle(i)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md border bg-background px-4 py-3 text-left text-sm transition-all",
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
              <span>{choiceLabel(c)}</span>
              {submitted && isAnswer && !selected && (
                <span className="ml-auto text-[11px] uppercase tracking-wider text-emerald-500">
                  Should pick
                </span>
              )}
            </button>
            {showRationale && (
              <p className="mt-1.5 ml-9 text-xs leading-relaxed text-rose-500/90">
                {rationale}
              </p>
            )}
          </div>
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

function FillBody({
  q,
  answer,
  setAnswer,
  submitted,
}: {
  q: Extract<Question, { type: "fill" }>;
  answer: Extract<Answer, { type: "fill" }>;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  const norm = (s: string) => s.trim().toLowerCase();
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Type each answer. Case and whitespace don't matter.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.blanks.map((blank, i) => {
          const value = answer.values[i] ?? "";
          const accepted = [blank.answer, ...(blank.alternatives ?? [])].map(norm);
          const wasCorrect = submitted && accepted.includes(norm(value));
          return (
            <label key={i} className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-foreground/80">
                {blank.label ?? `Blank ${i + 1}`}
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const next = [...answer.values];
                  next[i] = e.target.value;
                  setAnswer({ type: "fill", values: next });
                }}
                disabled={submitted}
                placeholder={blank.placeholder}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                className={cn(
                  "block w-full rounded-md border bg-background px-3 py-2 font-mono text-sm transition-colors",
                  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                  !submitted && "border-border",
                  submitted &&
                    wasCorrect &&
                    "border-emerald-500/60 bg-emerald-500/5",
                  submitted &&
                    !wasCorrect &&
                    "border-rose-500/60 bg-rose-500/5",
                )}
                aria-label={blank.label ?? `Blank ${i + 1}`}
              />
              {submitted && !wasCorrect && (
                <span className="mt-1 block text-[11px] text-rose-500">
                  Expected: <span className="font-mono">{blank.answer}</span>
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function LabelBody({
  q,
  answer,
  setAnswer,
  submitted,
}: {
  q: Extract<Question, { type: "label" }>;
  answer: Extract<Answer, { type: "label" }>;
  setAnswer: (a: Answer) => void;
  submitted: boolean;
}) {
  // Build the label pool: every zone's correct label + distractors, shuffled
  // ONCE per question id so the order doesn't churn on each render.
  const pool = React.useMemo(() => {
    const all = [
      ...q.zones.map((z) => z.label),
      ...(q.distractors ?? []),
    ];
    return shuffle(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);

  const usedLabels = new Set(answer.assignments.filter((a): a is string => a !== null));

  const handleZoneClick = (zoneIdx: number) => {
    if (submitted) return;
    const next = [...answer.assignments];
    if (selectedLabel === null) {
      // Click an already-assigned zone to clear it (handy for fixing mistakes).
      if (next[zoneIdx] !== null) {
        next[zoneIdx] = null;
        setAnswer({ type: "label", assignments: next });
      }
      return;
    }
    // Place the selected label on this zone. If it was already on another
    // zone, clear that one (one label can only live in one place).
    for (let i = 0; i < next.length; i++) {
      if (next[i] === selectedLabel) next[i] = null;
    }
    next[zoneIdx] = selectedLabel;
    setAnswer({ type: "label", assignments: next });
    setSelectedLabel(null);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Pick a label, then click a zone to place it. Click an assigned zone to clear it.
      </p>

      <div className="flex flex-wrap gap-2">
        {pool.map((lbl) => {
          const used = usedLabels.has(lbl);
          const sel = selectedLabel === lbl;
          return (
            <button
              key={lbl}
              type="button"
              onClick={() => {
                if (submitted) return;
                setSelectedLabel(sel ? null : lbl);
              }}
              disabled={submitted || used}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                sel
                  ? "border-primary bg-primary text-primary-foreground"
                  : used
                    ? "border-border opacity-30 line-through"
                    : "border-border bg-background hover:border-primary/40",
              )}
              aria-pressed={sel}
            >
              {lbl}
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={q.image}
          alt={q.imageAlt ?? q.prompt}
          loading="lazy"
          decoding="async"
          className="block w-full select-none"
          draggable={false}
        />
        {q.zones.map((zone, i) => {
          const assigned = answer.assignments[i];
          const correctLabel = zone.label;
          const ok = submitted && assigned === correctLabel;
          const wrong = submitted && assigned !== null && assigned !== correctLabel;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleZoneClick(i)}
              disabled={submitted}
              className={cn(
                "absolute flex items-center justify-center rounded-md border-2 text-xs font-semibold transition-colors",
                !submitted &&
                  selectedLabel !== null &&
                  "cursor-pointer border-dashed border-primary/60 bg-primary/10 hover:bg-primary/20",
                !submitted &&
                  selectedLabel === null &&
                  assigned !== null &&
                  "border-primary/60 bg-primary/10",
                !submitted &&
                  selectedLabel === null &&
                  assigned === null &&
                  "border-dashed border-border bg-background/40",
                submitted && ok && "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                submitted && wrong && "border-rose-500 bg-rose-500/10 text-rose-500",
                submitted &&
                  !assigned &&
                  "border-rose-500/60 bg-rose-500/5 text-rose-500",
              )}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
              }}
              aria-label={`Zone for ${zone.label}`}
            >
              {submitted ? (
                <span>
                  {assigned ?? "—"}
                  {wrong && (
                    <span className="ml-1 text-[10px] opacity-70">
                      (→ {correctLabel})
                    </span>
                  )}
                  {!assigned && (
                    <span className="ml-1 text-[10px]">
                      (→ {correctLabel})
                    </span>
                  )}
                </span>
              ) : (
                assigned ?? <span className="opacity-50">·</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionRenderer;
