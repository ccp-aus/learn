import * as React from "react";
import { courseCompletion } from "@/lib/progress";
import { cn } from "@/lib/utils";

interface Props {
  lessonSlugs: string[];
  className?: string;
  showCount?: boolean;
}

export function CourseProgressBar({
  lessonSlugs,
  className,
  showCount = true,
}: Props) {
  const [pct, setPct] = React.useState(0);
  const [done, setDone] = React.useState(0);
  const [total, setTotal] = React.useState(lessonSlugs.length);
  const [hydrated, setHydrated] = React.useState(false);

  const refresh = React.useCallback(() => {
    const c = courseCompletion(lessonSlugs);
    setPct(c.pct);
    setDone(c.done);
    setTotal(c.total);
  }, [lessonSlugs]);

  React.useEffect(() => {
    refresh();
    setHydrated(true);
    const onChange = () => refresh();
    window.addEventListener("learnmsp:progress-changed", onChange);
    return () =>
      window.removeEventListener("learnmsp:progress-changed", onChange);
  }, [refresh]);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${Math.round(pct * 100)}%` }}
          aria-hidden="true"
        />
      </div>
      {showCount && (
        <span
          className="shrink-0 text-xs tabular-nums text-muted-foreground"
          aria-live="polite"
        >
          {hydrated ? `${done} / ${total}` : `${total} lessons`}
        </span>
      )}
    </div>
  );
}

export default CourseProgressBar;
