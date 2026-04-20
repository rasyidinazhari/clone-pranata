import { getIKMCategory } from "@/lib/mongso";

export function IKMGauge({ score }: { score: number }) {
  const cat = getIKMCategory(score);
  const radius = 80;
  const circ = Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path
          d="M 20 110 A 80 80 0 0 1 180 110"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 110 A 80 80 0 0 1 180 110"
          fill="none"
          stroke={cat.color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="-mt-8 text-center">
        <div className="text-5xl font-display font-bold text-primary tabular-nums">{score}</div>
        <div className="text-xs text-muted-foreground tracking-wide">IKM SCORE</div>
        <div
          className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold"
          style={{ color: cat.color, background: cat.bg }}
        >
          {cat.label}
        </div>
      </div>
    </div>
  );
}
