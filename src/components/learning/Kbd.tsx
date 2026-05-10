import * as React from "react";
import { cn } from "@/lib/utils";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5",
        "font-mono text-[0.78em] leading-none text-foreground/80 shadow-[0_1px_0_0_var(--border)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export default Kbd;
