import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Calendar, Leaf, FlaskConical, FileText } from "lucide-react";
import { getCurrentMongso } from "@/lib/mongso";

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

const warningFor = (catatan: string) => {
  const lower = catatan.toLowerCase();
  if (lower.includes("leaching")) return "Risiko pencucian unsur hara tinggi; pemupukan sebaiknya bertahap.";
  if (lower.includes("stres air")) return "Risiko kekeringan tinggi; gunakan mulsa dan pilih tanaman toleran kering.";
  if (lower.includes("pH < 5.5".toLowerCase())) return "Periksa pH tanah; lakukan pengapuran jika pH terlalu asam.";
  if (lower.includes("irigasi")) return "Pastikan ketersediaan air sebelum tanam.";
  return null;
};

function RekomPage() {
  const mongso = getCurrentMongso();
  const warning = warningFor(mongso.kimiaTanah.catatan);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-mono text-muted-foreground tracking-wider">REKOMENDASI TANAM</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">
          Tanaman untuk Mongso {mongso.name} {mongso.emoji}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          {mongso.characteristics}. Berikut tanaman yang direkomendasikan ditanam pada periode ini.
        </p>
      </div>

      <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-4">
        <Leaf className="w-5 h-5" style={{ color: "var(--leaf)" }} /> Direkomendasikan
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mongso.tanaman.rekomen.map((name) => (
          <div key={name} className="rounded-2xl bg-card border border-border shadow-soft p-5 hover:shadow-elevated hover:-translate-y-0.5 transition">
            <div className="text-4xl">🌱</div>
            <h3 className="font-display font-bold text-lg text-primary mt-3">{name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Calendar className="w-3.5 h-3.5" /> Cocok pada Mongso {mongso.name}
            </div>
            <p className="text-sm text-foreground/75 mt-3 leading-relaxed">Sesuai dengan karakter iklim dan kondisi lahan periode {mongso.period}.</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
          <FlaskConical className="w-5 h-5" style={{ color: "var(--sky)" }} /> Kondisi Tanah
        </h2>
        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="rounded-xl bg-secondary p-4">
            <div className="text-xs text-muted-foreground">🧪 pH Tanah</div>
            <div className="text-2xl font-display font-bold text-primary mt-1">{mongso.kimiaTanah.ph}</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 lg:col-span-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Catatan Pemupukan</div>
            <div className="text-sm text-foreground/80 mt-1">{mongso.kimiaTanah.catatan}</div>
          </div>
        </div>
        {warning && (
          <div className="mt-4 rounded-xl border p-4 text-sm flex gap-2" style={{ borderColor: "color-mix(in oklab, var(--alert) 25%, transparent)", background: "color-mix(in oklab, var(--alert) 7%, transparent)", color: "var(--alert)" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span><b>⚠️ Peringatan:</b> {warning}</span>
          </div>
        )}
      </div>

      {mongso.tanaman.hindari.length > 0 && (
        <div className="mt-10 rounded-2xl border-2 p-6" style={{ borderColor: "color-mix(in oklab, var(--alert) 30%, transparent)", background: "color-mix(in oklab, var(--alert) 5%, transparent)" }}>
          <h2 className="font-display text-xl font-bold flex items-center gap-2" style={{ color: "var(--alert)" }}>
            <AlertTriangle className="w-5 h-5" /> Hindari Tanam
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Tanaman berikut berisiko lebih tinggi pada Mongso {mongso.name}.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {mongso.tanaman.hindari.map((name) => (
              <div key={name} className="rounded-xl bg-card border border-border p-4">
                <div className="text-3xl">⚠️</div>
                <div className="font-semibold text-primary mt-2">{name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
