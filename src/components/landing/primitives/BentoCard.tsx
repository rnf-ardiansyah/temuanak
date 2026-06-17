import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BentoCard({
  children,
  className,
  tone = "card",
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "soft" | "primary";
  interactive?: boolean;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground border-primary"
      : tone === "soft"
        ? "bg-surface-soft border-transparent"
        : "bg-card text-card-foreground border-border";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border p-7 md:p-8",
        "shadow-[var(--shadow-card)]",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
        toneClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
