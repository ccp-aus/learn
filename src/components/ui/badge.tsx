import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        success:
          "border-transparent bg-success/15 text-success-foreground [color:var(--success)]",
        warning:
          "border-transparent bg-warning/15 [color:var(--warning)]",
        info: "border-transparent bg-info/15 [color:var(--info)]",
        l1: "border-transparent bg-emerald-500/15 text-emerald-400",
        l2: "border-transparent bg-amber-500/15 text-amber-400",
        l3: "border-transparent bg-rose-500/15 text-rose-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
