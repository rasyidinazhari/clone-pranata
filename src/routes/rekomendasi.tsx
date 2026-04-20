import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Droplets, Calendar, Leaf, FlaskConical } from "lucide-react";
import { getCurrentMongso } from "@/lib/mongso";
import { getCropsForMongso, SOIL_NOTES, CROPS } from "@/lib/crops";

export const Route = createFileRoute("/rekomendasi")({
  head: () => ({
    meta: [
      { title: "Rekomendasi Tanam — PranataCalc" },
      { name: "description", content: "Rekomendasi tanaman per Mongso berbasis data cuaca dan kearifan lokal." },
      { property: "og:title", content: "Rekomendasi Tanam — PranataCalc" },
      { property: "og:description", content: "Tanaman tepat untuk mongso saat ini." },
    ],
  }),
  component: RekomPage,
});

function RekomPage() {
  const mongso = getCurrentMongso();
  const { recommended } = getCropsForMongso(mongso.number);
  // Avoid: high-water crops for dry mongso, vice versa
  const isDry = mongso.season === "Kemarau";
  const avoid = CROPS.filter((c) =>
    isDry ? c.water === "Tinggi" : c.water === "Rendah" && [6, 7].includes(mongso.number)
  ).slice(0, 4);
  const soil = SOIL_NOTES[mongso.number];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-mono text-muted-foreground tracking-wider">REKOMENDASI TANAM</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">
          Tanaman untuk Mongso {mongso.name} {mongso.emoji}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          {mongso.characteristics} Berikut tanaman yang direkomendasikan ditanam pada periode ini.
        </p>
      </div>

      {/* Recommended grid */}
      <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-4">
        <Leaf className="w-5 h-5" style={{ color: "var(--leaf)" }} /> Direkomendasikan
      </h2>
      {recommended.length === 0 ? (
        <p className="text-muted-foreground">Mongso ini bukan periode utama tanam. Fokus pada perawatan lahan.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((c) => (
            <div key={c.name} className="rounded-2xl bg-card border border-border shadow-soft p-5 hover:shadow-elevated hover:-translate-y-0.5 transition">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{c.emoji}</div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                  background: c.water === "Tinggi" ? "color-mix(in oklab, var(--sky) 15%, transparent)" : c.water === "Sedang" ? "color-mix(in oklab, var(--leaf) 15%, transparent)" : "var(--secondary)",
                  color: c.water === "Tinggi" ? "var(--sky)" : c.water === "Sedang" ? "var(--leaf)" : "var(--muted-foreground)",
                }}>
                  Air {c.water}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-primary mt-3">{c.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <Calendar className="w-3.5 h-3.5" /> {c.duration}
              </div>
              <p className="text-sm text-foreground/75 mt-3 leading-relaxed">{c.notes}</p>
            </div>
          ))}
        </div>
      )}

      {/* Avoid */}
      {avoid.length > 0 && (
        <div className="mt-10 rounded-2xl border-2 p-6" style={{ borderColor: "color-mix(in oklab, var(--alert) 30%, transparent)", background: "color-mix(in oklab, var(--alert) 5%, transparent)" }}>
          <h2 className="font-display text-xl font-bold flex items-center gap-2" style={{ color: "var(--alert)" }}>
            <AlertTriangle className="w-5 h-5" /> Hindari Tanam
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tanaman berikut berisiko gagal pada Mongso {mongso.name} karena ketidaksesuaian kebutuhan air.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {avoid.map((c) => (
              <div key={c.name} className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                <div className="text-3xl">{c.emoji}</div>
                <div>
                  <div className="font-semibold text-primary">{c.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Droplets className="w-3 h-3" />Air {c.water}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Soil */}
      <div className="mt-10 rounded-2xl bg-gradient-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
          <FlaskConical className="w-5 h-5" style={{ color: "var(--sky)" }} /> Catatan Kimia Tanah
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-xl bg-secondary p-4">
            <div className="text-xs text-muted-foreground">pH Optimal</div>
            <div className="text-2xl font-display font-bold text-primary mt-1">{soil.ph}</div>
          </div>
          <div className="rounded-xl bg-secondary p-4">
            <div className="text-xs text-muted-foreground">Rekomendasi Nutrisi</div>
            <div className="text-sm text-foreground/80 mt-1">{soil.nutrients}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
