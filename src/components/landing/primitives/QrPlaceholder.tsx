import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Deterministic pseudo-QR pattern (purely decorative)
function buildPattern(size: number, seed = 7) {
  const cells: boolean[] = [];
  let s = seed;
  for (let i = 0; i < size * size; i++) {
    s = (s * 9301 + 49297) % 233280;
    cells.push(s / 233280 > 0.5);
  }
  return cells;
}

export function QrPlaceholder({ className, size = 21 }: { className?: string; size?: number }) {
  const cells = useMemo(() => buildPattern(size), [size]);

  const isFinder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) =>
      x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    return inBox(0, 0) || inBox(size - 7, 0) || inBox(0, size - 7);
  };

  const finderCell = (x: number, y: number, ox: number, oy: number) => {
    const lx = x - ox;
    const ly = y - oy;
    const outer = lx === 0 || lx === 6 || ly === 0 || ly === 6;
    const inner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
    return outer || inner;
  };

  return (
    <div
      className={cn(
        "grid aspect-square w-full rounded-2xl bg-white p-3",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gap: "2px" }}
      aria-hidden
    >
      {cells.map((on, idx) => {
        const x = idx % size;
        const y = Math.floor(idx / size);
        let filled = on;
        if (isFinder(x, y)) {
          if (x < 7 && y < 7) filled = finderCell(x, y, 0, 0);
          else if (x >= size - 7 && y < 7) filled = finderCell(x, y, size - 7, 0);
          else if (x < 7 && y >= size - 7) filled = finderCell(x, y, 0, size - 7);
        }
        return (
          <div
            key={idx}
            className="rounded-[2px]"
            style={{ background: filled ? "#111827" : "transparent" }}
          />
        );
      })}
    </div>
  );
}
