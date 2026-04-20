import type { Mongso } from "@/lib/mongso";

export function MongsoCard({ mongso, current = false }: { mongso: Mongso; current?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-card border border-border shadow-elevated p-6 sm:p-8">
      {current && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
          ● MONGSO SAAT INI
        </div>
      )}
      <div className="flex items-start gap-5">
        <div className="text-6xl sm:text-7xl">{mongso.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono text-muted-foreground tracking-wider">
            MONGSO {String(mongso.number).padStart(2, "0")} / 12
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">
            {mongso.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{mongso.period} • {mongso.days} hari</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 text-sky text-xs font-medium" style={{ color: "var(--sky)", background: "color-mix(in oklab, var(--sky) 12%, transparent)" }}>
            Musim {mongso.season}
          </div>
          <p className="text-sm sm:text-base text-foreground/80 mt-4 leading-relaxed">
            {mongso.characteristics}
          </p>
        </div>
      </div>
    </div>
  );
}
