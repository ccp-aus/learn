import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
}

interface GlossaryEntry {
  term: string;
  short: string;
}

type GlossaryMap = Record<string, GlossaryEntry>;

let cachedMap: GlossaryMap | null = null;

function readGlossaryFromDOM(): GlossaryMap {
  if (cachedMap) return cachedMap;
  if (typeof document === "undefined") return {};
  const el = document.getElementById("glossary-data");
  if (!el?.textContent) return {};
  try {
    cachedMap = JSON.parse(el.textContent) as GlossaryMap;
    return cachedMap;
  } catch {
    return {};
  }
}

export function Term({ slug, children, className }: TermProps) {
  const [entry, setEntry] = React.useState<GlossaryEntry | null>(null);

  React.useEffect(() => {
    const map = readGlossaryFromDOM();
    setEntry(map[slug] ?? null);
  }, [slug]);

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <a
          href={`/glossary/${slug}/`}
          className={cn(
            "underline decoration-dotted decoration-primary/60 underline-offset-4 hover:decoration-primary",
            "cursor-help transition-colors",
            className,
          )}
          data-glossary-term={slug}
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-sm font-semibold tracking-tight">
              {entry?.term ?? children}
            </div>
            <a
              href={`/glossary/${slug}/`}
              className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-0.5"
            >
              Open <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {entry?.short ??
              "Definition unavailable in this build — open the glossary entry for full detail."}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default Term;
