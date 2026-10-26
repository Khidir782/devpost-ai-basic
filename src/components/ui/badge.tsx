import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-primary text-primary-foreground shadow-sm",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "border-border text-muted-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
