import * as React from "react";

/**
 * Shell preference. Sticky per-visitor choice for which shell syntax
 * `Console` (and any future shell-aware component) should default to.
 * Stored in localStorage; broadcast within the page via a custom event
 * so all shell-aware islands on the same lesson stay in sync when the
 * learner toggles.
 *
 * Authors don't usually touch this — components consume it via
 * `useShellPreference()`. Authors expose the toggle by providing
 * per-shell `variants` on a Console step; the toggle UI appears in
 * the Console header automatically when variants are present.
 */

export type Shell = "bash" | "powershell" | "cmd";

const STORAGE_KEY = "shellPreference";
const EVENT_NAME = "shell-preference-changed";
const DEFAULT: Shell = "bash";

export const SHELL_LABELS: Record<Shell, string> = {
  bash: "bash",
  powershell: "PowerShell",
  cmd: "cmd",
};

export const SHELL_PROMPTS: Record<Shell, string> = {
  bash: "$ ",
  powershell: "PS C:\\> ",
  cmd: "C:\\> ",
};

function isShell(v: unknown): v is Shell {
  return v === "bash" || v === "powershell" || v === "cmd";
}

export function getShellPreference(): Shell {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return isShell(v) ? v : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function setShellPreference(shell: Shell): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, shell);
  } catch {
    // localStorage can be blocked (private mode, quota); fall through
    // so the in-page event still fires for any listeners on the page.
  }
  window.dispatchEvent(new CustomEvent<Shell>(EVENT_NAME, { detail: shell }));
}

/**
 * React hook. Initialises to DEFAULT on first render (SSR-safe), then
 * resolves from localStorage on mount and stays in sync with any
 * `setShellPreference` calls from anywhere on the page.
 */
export function useShellPreference(): readonly [Shell, (s: Shell) => void] {
  const [shell, setShell] = React.useState<Shell>(DEFAULT);

  React.useEffect(() => {
    setShell(getShellPreference());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Shell>).detail;
      if (isShell(detail)) setShell(detail);
    };
    window.addEventListener(EVENT_NAME, onChange);
    // Also pick up changes from other tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && isShell(e.newValue)) setShell(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const set = React.useCallback((s: Shell) => {
    setShellPreference(s);
  }, []);

  return [shell, set] as const;
}
