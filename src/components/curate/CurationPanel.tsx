import * as React from "react";
import {
  Check,
  Copy,
  Download,
  Trash2,
  Upload,
  Link2,
  Lock,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  buildShareUrl,
  clearCuration,
  defaultCuration,
  isActive,
  readCuration,
  writeCuration,
  type Curation,
  type Level,
} from "@/lib/curation";

export interface VendorOption {
  slug: string;
  name: string;
  tagline: string;
  status: "live" | "planned" | "draft";
  /** Levels that have any (non-draft) lessons authored. Empty means none yet. */
  liveLevels: Level[];
}

interface Props {
  vendors: VendorOption[];
}

const ALL_LEVELS: Level[] = ["l1", "l2", "l3"];

const levelLabel: Record<Level, string> = {
  l1: "Beginner",
  l2: "Intermediate",
  l3: "Advanced",
};

export function CurationPanel({ vendors }: Props) {
  const [curation, setCuration] = React.useState<Curation>(defaultCuration);
  const [hydrated, setHydrated] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState<string>("");
  const [copyState, setCopyState] = React.useState<"idle" | "copied">("idle");
  const [importMsg, setImportMsg] = React.useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  React.useEffect(() => {
    const c = readCuration();
    setCuration(c);
    setHydrated(true);
  }, []);

  const update = (next: Curation) => {
    setCuration(next);
    writeCuration(next);
  };

  const toggleVendor = (slug: string) => {
    const explicit = curation.vendors ?? [];
    const isSelected = explicit.includes(slug);
    let nextVendors: string[] | null;
    if (isSelected) {
      nextVendors = explicit.filter((v) => v !== slug);
    } else {
      nextVendors = [...explicit, slug];
    }
    // null vendors = "show all"; once user starts curating, lock to a list.
    if (curation.vendors === null) nextVendors = [slug];
    update({ ...curation, vendors: nextVendors });
  };

  const isVendorSelected = (slug: string): boolean => {
    if (curation.vendors === null) return true;
    return curation.vendors.includes(slug);
  };

  const toggleLevel = (slug: string, level: Level) => {
    const current = curation.levels[slug] ?? [];
    let next: Level[];
    if (current.includes(level)) {
      next = current.filter((l) => l !== level);
    } else {
      next = [...current, level];
    }
    const newLevels = { ...curation.levels };
    if (next.length === 0) {
      delete newLevels[slug];
    } else {
      newLevels[slug] = next;
    }
    update({ ...curation, levels: newLevels });
  };

  const isLevelSelected = (slug: string, level: Level): boolean => {
    const explicit = curation.levels[slug];
    if (!explicit || explicit.length === 0) return true;
    return explicit.includes(level);
  };

  const setAutoNewVendors = (v: boolean) =>
    update({ ...curation, autoIncludeNewVendors: v });
  const setAutoNewLevels = (v: boolean) =>
    update({ ...curation, autoIncludeNewLevels: v });

  const onClear = () => {
    clearCuration();
    setCuration(defaultCuration());
    setShareUrl("");
  };

  const onCopyShareUrl = async () => {
    if (typeof window === "undefined") return;
    const url = buildShareUrl(curation, window.location.origin);
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      // browser blocked clipboard — leave the input for the user to copy manually
    }
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(curation, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnmsp-stack-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || parsed.v !== 1) throw new Error("not a v1 stack file");
        update(parsed as Curation);
        setImportMsg({ ok: true, msg: "Imported." });
      } catch (err) {
        setImportMsg({
          ok: false,
          msg: err instanceof Error ? err.message : "invalid file",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const active = isActive(curation);
  const selectedCount =
    curation.vendors === null ? vendors.length : curation.vendors.length;

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h2 className="font-semibold tracking-tight">Pick your stack</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select the products your MSP actually uses. The site filters to
              just those vendors and levels — share the resulting URL so your
              techs only see what's on their stack.
            </p>
          </div>
          {hydrated && active && (
            <Badge variant="default" className="font-mono">
              {selectedCount} of {vendors.length} vendors
            </Badge>
          )}
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {vendors.map((v) => {
            const selected = isVendorSelected(v.slug);
            return (
              <li key={v.slug}>
                <div
                  className={cn(
                    "rounded-lg border bg-background p-3 transition-colors",
                    selected
                      ? "border-primary/40 bg-primary/5"
                      : "border-border opacity-70",
                  )}
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-primary"
                      checked={selected}
                      onChange={() => toggleVendor(v.slug)}
                      aria-label={`Include ${v.name}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium tracking-tight">
                          {v.name}
                        </span>
                        {v.status !== "live" && (
                          <Badge
                            variant="outline"
                            className="text-[9px] uppercase tracking-widest"
                          >
                            Planned
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {v.tagline}
                      </p>
                      {selected && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {ALL_LEVELS.map((lvl) => {
                            const lvlSelected = isLevelSelected(v.slug, lvl);
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => toggleLevel(v.slug, lvl)}
                                className={cn(
                                  "rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors",
                                  lvlSelected
                                    ? "border-primary bg-primary/15 text-primary"
                                    : "border-border text-muted-foreground hover:border-border/80",
                                )}
                                aria-pressed={lvlSelected}
                              >
                                {levelLabel[lvl]}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 text-primary" />
          <div className="flex-1">
            <h2 className="font-semibold tracking-tight">Future content</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              When new vendors or levels launch, do you want them to appear
              automatically, or stay hidden until you opt in?
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <ToggleRow
            label="Auto-include new vendors"
            help="When a new vendor (e.g. Datto, Auvik) is added to the site, it shows up for you automatically. Turn off to lock to your current list."
            checked={curation.autoIncludeNewVendors}
            onChange={setAutoNewVendors}
          />
          <ToggleRow
            label="Auto-include new levels"
            help="If a vendor in your stack adds a new level later (e.g. an Advanced course you didn't pick), include it automatically."
            checked={curation.autoIncludeNewLevels}
            onChange={setAutoNewLevels}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold tracking-tight">Share & save</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a URL or download a JSON file. Send it to your techs — when
          they open the URL, the site asks for permission to apply your stack.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onCopyShareUrl} disabled={!hydrated}>
            {copyState === "copied" ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" /> Copy share URL
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onExport} disabled={!hydrated}>
            <Download className="h-4 w-4" /> Export JSON
          </Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4" /> Import JSON
              <input
                type="file"
                accept="application/json"
                className="sr-only"
                onChange={onImport}
              />
            </label>
          </Button>
        </div>

        {shareUrl && (
          <input
            type="text"
            value={shareUrl}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
            className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs"
          />
        )}

        {importMsg && (
          <p
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 text-xs",
              importMsg.ok ? "text-emerald-500" : "text-rose-500",
            )}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {importMsg.msg}
          </p>
        )}
      </section>

      {hydrated && active && (
        <section className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
          <h2 className="font-semibold tracking-tight">Reset</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Remove all curation. Every vendor and level becomes visible again.
          </p>
          <div className="mt-4">
            <Button variant="destructive" onClick={onClear}>
              <Trash2 className="h-4 w-4" /> Clear curation
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 transition-colors hover:border-primary/30">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="min-w-0">
        <div className="text-sm font-medium tracking-tight">{label}</div>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
          {help}
        </p>
      </div>
    </label>
  );
}

export default CurationPanel;
