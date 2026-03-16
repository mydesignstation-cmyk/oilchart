import * as React from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-700",
    secondary: "bg-slate-50 text-slate-600",
    destructive: "bg-rose-50 text-rose-700",
    outline: "border border-slate-200 bg-white text-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant] ?? variants.default,
        className,
      )}
      {...props}
    />
  );
}
