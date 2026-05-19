import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";

type Status = "idle" | "loading" | "playing" | "paused";

interface Props {
  /** CSS selector for the element whose text should be read. Defaults to article. */
  rootSelector?: string;
  /** Optional className passed to the wrapper. */
  className?: string;
}

/**
 * Browser-based TTS button using the Web Speech API. Reads the prose of a lesson
 * skipping interactive cards (DecisionTree, Checkpoint, StepThrough), code blocks,
 * Mermaid SVGs, and navigation/UI chrome.
 *
 * No network, no model — uses whatever voice the user's browser/OS provides.
 */
export default function ListenButton({
  rootSelector = "[data-tts-root]",
  className = "",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    };
  }, []);

  const collectText = (): string => {
    const root =
      (document.querySelector(rootSelector) as HTMLElement | null) ??
      (document.querySelector("article") as HTMLElement | null);
    if (!root) return "";

    // Work on a clone so we don't mutate the live DOM.
    const clone = root.cloneNode(true) as HTMLElement;

    // Skip these subtrees entirely:
    // - Interactive islands (DecisionTree, Checkpoint, StepThrough, AnnotatedCode,
    //   AnnotatedScreenshot, Hotspot, LessonProgress, MermaidLoader)
    // - Pre-formatted code blocks and inline code
    // - SVG (mermaid diagrams, icons)
    // - Navigation, header chrome, buttons, draft banners
    // - Anything explicitly opted-out with data-tts="skip"
    const skipSelectors = [
      '[data-tts="skip"]',
      'astro-island[component-export="DecisionTree"]',
      'astro-island[component-export="Checkpoint"]',
      'astro-island[component-export="StepThrough"]',
      'astro-island[component-export="AnnotatedCode"]',
      'astro-island[component-export="AnnotatedScreenshot"]',
      'astro-island[component-export="Hotspot"]',
      'astro-island[component-export="LessonProgress"]',
      'astro-island[component-export="MermaidLoader"]',
      "pre",
      "code",
      "svg",
      "nav",
      "button",
      "script",
      "style",
      "noscript",
      "template",
      "[role=tablist]",
    ];
    skipSelectors.forEach((sel) => {
      clone.querySelectorAll(sel).forEach((el) => el.remove());
    });

    // Normalise whitespace so the speech engine doesn't pause on every newline.
    return clone.innerText.replace(/\s+/g, " ").trim();
  };

  const start = () => {
    if (typeof window === "undefined") return;
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }
    const text = collectText();
    if (!text) return;

    window.speechSynthesis.cancel(); // clear any queue from a previous attempt
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    // Prefer an English voice if available; otherwise let the OS pick.
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
    if (preferred) u.voice = preferred;

    u.onend = () => setStatus("idle");
    u.onerror = () => setStatus("idle");
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setStatus("playing");
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus("paused");
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setStatus("idle");
  };

  if (!supported) return null;

  const base =
    "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent";

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {status === "idle" && (
        <button
          type="button"
          onClick={start}
          className={`${base} text-muted-foreground hover:text-foreground`}
          aria-label="Listen to this lesson"
          title="Read the lesson aloud using your browser's text-to-speech"
        >
          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          Listen
        </button>
      )}
      {status === "playing" && (
        <>
          <button
            type="button"
            onClick={pause}
            className={`${base} text-foreground`}
            aria-label="Pause reading"
          >
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            Pause
          </button>
          <button
            type="button"
            onClick={stop}
            className={`${base} text-muted-foreground hover:text-foreground`}
            aria-label="Stop reading"
            title="Stop"
          >
            <Square className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </>
      )}
      {status === "paused" && (
        <>
          <button
            type="button"
            onClick={start}
            className={`${base} text-foreground`}
            aria-label="Resume reading"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Resume
          </button>
          <button
            type="button"
            onClick={stop}
            className={`${base} text-muted-foreground hover:text-foreground`}
            aria-label="Stop reading"
            title="Stop"
          >
            <Square className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
