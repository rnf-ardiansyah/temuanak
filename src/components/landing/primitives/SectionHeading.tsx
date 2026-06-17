import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-block text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
