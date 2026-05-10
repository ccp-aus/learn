import * as React from "react";
import { Info, AlertTriangle, Lightbulb, ShieldAlert, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "tip" | "info" | "warn" | "danger" | "success";

const variantConfig: Record<
  Variant,
  { icon: React.ComponentType<{ className?: string }>; cls: string; label: string }
> = {
  tip: {
    icon: Lightbulb,
    cls: "bg-info/10 border-info/40 text-foreground [&_[data-icon]]:text-info",
    label: "Tip",
  },
  info: {
    icon: Info,
    cls: "bg-primary/10 border-primary/40 text-foreground [&_[data-icon]]:text-primary",
    label: "Info",
  },
  warn: {
    icon: AlertTriangle,
    cls: "bg-warning/10 border-warning/40 text-foreground [&_[data-icon]]:text-warning",
    label: "Heads up",
  },
  danger: {
    icon: ShieldAlert,
    cls: "bg-destructive/10 border-destructive/40 text-foreground [&_[data-icon]]:text-destructive",
    label: "Danger",
  },
  success: {
    icon: Check,
    cls: "bg-success/10 border-success/40 text-foreground [&_[data-icon]]:text-success",
    label: "Done right",
  },
};

interface CalloutProps {
  type?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const cfg = variantConfig[type];
  const Icon = cfg.icon;
  const heading = title ?? cfg.label;
  return (
    <div
      role="note"
      className={cn(
        "my-6 rounded-lg border-l-2 border-y border-r border-border bg-card/40 px-4 py-3.5",
        cfg.cls,
        className,
      )}
    >
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <Icon data-icon className="h-4 w-4 shrink-0" />
        <span>{heading}</span>
      </div>
      <div className="text-sm leading-relaxed [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export default Callout;
