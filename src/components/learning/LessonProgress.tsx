import * as React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isLessonComplete,
  setLessonComplete,
  setResumeMarker,
} from "@/lib/progress";

interface Props {
  lessonSlug: string;
  vendor: string;
  level: string;
  /** If provided, after marking complete the user is offered "Next →" */
  nextHref?: string | null;
  nextLabel?: string | null;
}

export function LessonProgress({
  lessonSlug,
  vendor,
  level,
  nextHref,
  nextLabel,
}: Props) {
  const [done, setDone] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setDone(isLessonComplete(lessonSlug));
    setHydrated(true);
    setResumeMarker(vendor, level, lessonSlug);
  }, [lessonSlug, vendor, level]);

  const toggle = () => {
    const next = !done;
    setLessonComplete(lessonSlug, next);
    setDone(next);
  };

  return (
    <div className="mt-12 flex flex-col gap-3 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <Button
        variant={done ? "secondary" : "default"}
        onClick={toggle}
        aria-pressed={done}
        disabled={!hydrated}
      >
        {done ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Marked complete
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" /> Mark this lesson complete
          </>
        )}
      </Button>
      {nextHref && (
        <a
          href={nextHref}
          className="text-sm text-primary hover:underline"
          data-astro-prefetch
        >
          {nextLabel ?? "Next lesson"} →
        </a>
      )}
    </div>
  );
}

export default LessonProgress;
