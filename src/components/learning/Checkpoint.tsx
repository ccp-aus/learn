import * as React from "react";
import { Quiz } from "@/components/learning/Quiz";

interface Props {
  /** Quiz slug — fetched from /quizzes/<slug>.json */
  slug: string;
  /** Optional title override */
  title?: string;
}

/**
 * Inline lesson checkpoint — a tiny 1-3 question quiz embedded mid-lesson.
 * Reuses the Quiz component but renders compactly and does NOT persist scores
 * (a checkpoint is for live recall, not assessment).
 */
export function Checkpoint({ slug }: Props) {
  return <Quiz slug={slug} compact persistScore={false} />;
}

export default Checkpoint;
