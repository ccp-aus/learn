import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface HotspotProps {
  /** percentage of image width (0..100) */
  x: number;
  /** percentage of image height (0..100) */
  y: number;
  /** label inside the marker — typically "1", "2", "3" */
  label: string | number;
  /** short heading shown in the popover card */
  title?: string;
  /** one-line reason a technician opens this surface */
  purpose?: string;
  children?: React.ReactNode;
  tone?: "primary" | "warning" | "success";
}

const toneColors: Record<NonNullable<HotspotProps["tone"]>, string> = {
  primary: "bg-primary text-primary-foreground ring-primary/30",
  warning: "bg-amber-500 text-white ring-amber-500/30",
  success: "bg-emerald-500 text-white ring-emerald-500/30",
};

export function Hotspot({
  x,
  y,
  label,
  title,
  purpose,
  tone = "primary",
  children,
}: HotspotProps) {
  const accessibleName = title ? `${title} hotspot ${label}` : `Hotspot ${label}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center",
            "rounded-full text-xs font-semibold ring-4 transition-transform",
            "hover:scale-110 focus-visible:outline-none focus-visible:scale-110",
            "animate-pulse motion-reduce:animate-none",
            toneColors[tone],
          )}
          style={{ left: `${x}%`, top: `${y}%` }}
          aria-label={accessibleName}
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(22rem,calc(100vw-2rem))] p-0 text-sm leading-relaxed"
      >
        <div className="rounded-md bg-card text-card-foreground">
          {(title || purpose) && (
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-2",
                    toneColors[tone],
                  )}
                >
                  {label}
                </span>
                {title && <h3 className="text-sm font-semibold">{title}</h3>}
              </div>
              {purpose && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {purpose}
                </p>
              )}
            </div>
          )}
          {children && (
            <div className="space-y-2 px-4 py-3 text-muted-foreground">
              {children}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface AnnotatedScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  /** Aspect-ratio hint for layout stability (e.g., "16/9", "4/3") */
  aspect?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AnnotatedScreenshot({
  src,
  alt,
  caption,
  aspect,
  children,
  className,
}: AnnotatedScreenshotProps) {
  return (
    <figure className={cn("my-8", className)}>
      <div
        className="relative overflow-hidden rounded-lg border border-border bg-muted"
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain"
        />
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default AnnotatedScreenshot;
