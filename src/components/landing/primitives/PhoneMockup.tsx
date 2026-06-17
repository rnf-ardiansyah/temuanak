import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PhoneMockup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[300px] rounded-[44px] border border-border bg-foreground p-3 shadow-[var(--shadow-elevated)]",
        "md:w-[340px]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-3 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-foreground" />
      <div className="relative h-[620px] overflow-hidden rounded-[34px] bg-surface-soft md:h-[680px]">
        {children}
      </div>
    </div>
  );
}
