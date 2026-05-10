import * as React from "react";
import { Search, FileText, BookOpen, Layers, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CURATION_EVENT, isActive, readCuration, type Curation } from "@/lib/curation";
import { urlVisible } from "@/lib/curation-filter";

interface PagefindResult {
  id: string;
  url: string;
  meta: { title?: string; image?: string };
  excerpt: string;
  content: string;
  filters?: Record<string, string[]>;
  sub_results?: { title: string; url: string; excerpt: string }[];
}

interface PagefindAPI {
  search: (q: string) => Promise<{
    results: { id: string; data: () => Promise<PagefindResult> }[];
  }>;
  options: (opts: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    pagefind?: PagefindAPI;
  }
}

let pagefindLoadPromise: Promise<PagefindAPI | null> | null = null;

async function loadPagefind(): Promise<PagefindAPI | null> {
  if (pagefindLoadPromise) return pagefindLoadPromise;
  pagefindLoadPromise = (async () => {
    if (typeof window === "undefined") return null;
    if (window.pagefind) return window.pagefind;
    try {
      // Stash in a variable so the bundler can't statically resolve the path.
      const pagefindUrl = "/pagefind/pagefind.js";
      const mod = await import(/* @vite-ignore */ pagefindUrl);
      const api = mod as PagefindAPI;
      api.options({ excerptLength: 28 });
      window.pagefind = api;
      return api;
    } catch {
      return null;
    }
  })();
  return pagefindLoadPromise;
}

function categoriseResult(url: string): {
  group: "Lessons" | "Glossary" | "Courses" | "Pages";
  Icon: React.ComponentType<{ className?: string }>;
} {
  if (url.startsWith("/glossary/")) return { group: "Glossary", Icon: Hash };
  if (/^\/vendors\/[^/]+\/[lL][123]\/[^/]+/.test(url))
    return { group: "Lessons", Icon: FileText };
  if (/^\/vendors\/[^/]+\/[lL][123]\/?$/.test(url))
    return { group: "Courses", Icon: Layers };
  return { group: "Pages", Icon: BookOpen };
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<PagefindResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [unavailable, setUnavailable] = React.useState(false);
  const [curation, setCuration] = React.useState<Curation | null>(null);

  React.useEffect(() => {
    setCuration(readCuration());
    const onChange = () => setCuration(readCuration());
    window.addEventListener(CURATION_EVENT, onChange);
    return () => window.removeEventListener(CURATION_EVENT, onChange);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    let cancel = false;
    setLoading(true);
    (async () => {
      const pagefind = await loadPagefind();
      if (cancel) return;
      if (!pagefind) {
        setUnavailable(true);
        setLoading(false);
        return;
      }
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      const r = await pagefind.search(query);
      const data = await Promise.all(r.results.slice(0, 10).map((x) => x.data()));
      if (!cancel) {
        setResults(data);
        setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [query, open]);

  const filteredResults = React.useMemo(() => {
    if (!curation || !isActive(curation)) return results;
    return results.filter((r) => urlVisible(r.url, curation));
  }, [results, curation]);

  const hiddenByCuration = results.length - filteredResults.length;

  const grouped = React.useMemo(() => {
    const g: Record<string, { result: PagefindResult; Icon: React.ComponentType<{ className?: string }> }[]> = {};
    for (const r of filteredResults) {
      const { group, Icon } = categoriseResult(r.url);
      if (!g[group]) g[group] = [];
      g[group].push({ result: r, Icon });
    }
    return g;
  }, [filteredResults]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search…</span>
        <CommandShortcut className="hidden sm:inline">⌘K</CommandShortcut>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search lessons, courses, glossary…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {unavailable && (
            <div className="p-4 text-xs text-muted-foreground">
              Search index isn't available on this build (likely dev mode).
              Run <code>npm run build</code> to generate the Pagefind index, or
              browse via the navigation above.
            </div>
          )}
          {!unavailable && loading && (
            <div className="p-4 text-xs text-muted-foreground">Searching…</div>
          )}
          {!unavailable && !loading && query && results.length === 0 && (
            <CommandEmpty>No matches for "{query}".</CommandEmpty>
          )}
          {!unavailable && !loading && query && results.length > 0 && filteredResults.length === 0 && (
            <CommandEmpty>
              No matches in your stack. <a className="text-primary hover:underline" href="/curate/">Manage curation</a>.
            </CommandEmpty>
          )}
          {!unavailable && !loading && !query && (
            <div className="p-4 text-xs text-muted-foreground">
              Type to search across lessons, courses, and the glossary.
            </div>
          )}
          {hiddenByCuration > 0 && (
            <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
              {hiddenByCuration} more {hiddenByCuration === 1 ? "result" : "results"} hidden by your stack curation.{" "}
              <a className="text-primary hover:underline" href="/curate/">
                Manage
              </a>
            </div>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map(({ result, Icon }) => (
                <CommandItem
                  key={result.id}
                  value={result.url}
                  onSelect={() => {
                    window.location.href = result.url;
                  }}
                >
                  <Icon className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="truncate text-sm">
                      {result.meta.title ?? result.url}
                    </div>
                    <div
                      className={cn(
                        "truncate text-xs text-muted-foreground",
                        "[&_mark]:bg-primary/20 [&_mark]:text-primary [&_mark]:rounded-sm [&_mark]:px-0.5",
                      )}
                      // Pagefind returns an excerpt with <mark> spans
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandPalette;
