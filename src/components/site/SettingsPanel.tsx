import * as React from "react";
import { Download, Upload, Trash2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  exportProgress,
  importProgress,
  clearProgress,
  readProgress,
} from "@/lib/progress";

export function SettingsPanel() {
  const [hydrated, setHydrated] = React.useState(false);
  const [stats, setStats] = React.useState({
    lessons: 0,
    quizzes: 0,
    updated: "",
  });
  const [importMsg, setImportMsg] = React.useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  const refresh = React.useCallback(() => {
    const p = readProgress();
    setStats({
      lessons: Object.keys(p.completedLessons).length,
      quizzes: Object.keys(p.quizScores).length,
      updated: p.updated,
    });
  }, []);

  React.useEffect(() => {
    refresh();
    setHydrated(true);
    const onChange = () => refresh();
    window.addEventListener("learnmsp:progress-changed", onChange);
    return () =>
      window.removeEventListener("learnmsp:progress-changed", onChange);
  }, [refresh]);

  const onExport = () => {
    const json = exportProgress();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `learnmsp-progress-${today}.json`;
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
      const r = importProgress(String(reader.result));
      setImportMsg(
        r.ok
          ? { ok: true, msg: "Progress imported." }
          : { ok: false, msg: r.error ?? "import failed" },
      );
      refresh();
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const onClear = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Wipe all local progress? This deletes lesson completion ticks and quiz scores. Cannot be undone unless you import a previously-exported snapshot.",
      )
    ) {
      clearProgress();
      refresh();
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold tracking-tight">Your data, locally</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Progress lives only in this browser's localStorage. Nothing is
              sent to any server.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Lessons completed" value={hydrated ? stats.lessons : "—"} />
          <Stat label="Quizzes attempted" value={hydrated ? stats.quizzes : "—"} />
          <Stat
            label="Last updated"
            value={
              hydrated && stats.updated
                ? new Date(stats.updated).toLocaleString()
                : "—"
            }
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold tracking-tight">Export & import</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Move between devices by exporting a JSON snapshot here and importing
          it on the other browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onExport}>
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
        {importMsg && (
          <p
            className={
              importMsg.ok
                ? "mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-500"
                : "mt-3 inline-flex items-center gap-1.5 text-xs text-rose-500"
            }
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {importMsg.msg}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
        <h2 className="font-semibold tracking-tight">Reset</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Clear all local progress for this site. Your browser cache and theme
          preference are not touched.
        </p>
        <div className="mt-4">
          <Button variant="destructive" onClick={onClear}>
            <Trash2 className="h-4 w-4" /> Wipe local progress
          </Button>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-base tabular-nums">{value}</div>
    </div>
  );
}

export default SettingsPanel;
