import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Calculator, Microscope } from "lucide-react";
import { MONGSO_LIST } from "@/lib/mongso";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang — PranataCalc" },
      { name: "description", content: "Tentang Pranata Mongso, metodologi IKM, dan riset di balik PranataCalc." },
      { property: "og:title", content: "Tentang PranataCalc" },
      { property: "og:description", content: "Pelajari Pranata Mongso & metodologi ilmiah PranataCalc." },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="text-xs font-mono text-muted-foreground tracking-wider">TENTANG</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">Apa itu Pranata Mongso?</h1>
        <p className="text-foreground/80 mt-3 leading-relaxed max-w-3xl">
          Pranata Mongso adalah sistem penanggalan tradisional Jawa untuk pertanian, dirumuskan pada masa Sri Susuhunan Pakubuwono VII di tahun 1855.
          Sistem ini membagi tahun menjadi 12 mongso berdasarkan tanda-tanda alam — perilaku tumbuhan, hewan, angin, dan curah hujan.
          PranataCalc memvalidasi kearifan ini dengan data cuaca modern.
        </p>
      </div>

      {/* 12 Mongso Table */}
      <section className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-primary">12 Mongso & Karakteristik</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">No</th>
                <th className="text-left px-4 py-3">Nama</th>
                <th className="text-left px-4 py-3">Periode</th>
                <th className="text-left px-4 py-3">Hari</th>
                <th className="text-left px-4 py-3">Musim</th>
                <th className="text-left px-4 py-3">Karakter Alam</th>
              </tr>
            </thead>
            <tbody>
              {MONGSO_LIST.map((m) => (
                <tr key={m.number} className="border-t border-border hover:bg-secondary/50 transition">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{m.number}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{m.emoji} {m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.period}</td>
                  <td className="px-4 py-3 tabular-nums">{m.days}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: m.season === "Hujan" ? "color-mix(in oklab, var(--sky) 15%, transparent)" : m.season === "Kemarau" ? "color-mix(in oklab, var(--warn) 18%, transparent)" : "color-mix(in oklab, var(--leaf) 15%, transparent)",
                      color: m.season === "Hujan" ? "var(--sky)" : m.season === "Kemarau" ? "oklch(0.55 0.15 70)" : "var(--leaf)",
                    }}>{m.season}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground/75 max-w-md">{m.characteristics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl bg-gradient-card border border-border shadow-soft p-6">
          <Calculator className="w-6 h-6 text-primary" />
          <h3 className="font-display text-xl font-bold text-primary mt-3">Formula IKM</h3>
          <p className="text-sm text-foreground/80 mt-2">Indeks Kesesuaian Mongso mengukur seberapa cocok prediksi tradisional dengan kondisi cuaca aktual.</p>
          <div className="mt-4 p-4 rounded-xl bg-primary text-primary-foreground font-mono text-sm leading-relaxed">
            IKM = 0.4·R + 0.3·T + 0.2·H + 0.1·W
          </div>
          <ul className="mt-4 text-sm text-foreground/75 space-y-1.5">
            <li><b className="text-primary">R</b> — skor kesesuaian Curah Hujan (40%)</li>
            <li><b className="text-primary">T</b> — skor kesesuaian Suhu (30%)</li>
            <li><b className="text-primary">H</b> — skor kesesuaian Kelembapan (20%)</li>
            <li><b className="text-primary">W</b> — skor kesesuaian Angin (10%)</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border shadow-soft p-6">
          <Microscope className="w-6 h-6 text-primary" />
          <h3 className="font-display text-xl font-bold text-primary mt-3">Tentang Riset</h3>
          <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
            PranataCalc dikembangkan sebagai jembatan antara <b>kearifan lokal</b> Nusantara dan <b>data sains</b> modern.
            Tujuannya: membantu petani Indonesia membuat keputusan tanam yang lebih presisi tanpa kehilangan akar budaya.
          </p>
          <p className="text-sm text-foreground/80 mt-3">
            Sumber data cuaca: BMKG (mock dataset untuk demo). Validasi dilakukan dengan rekonsiliasi parameter prediksi-vs-aktual per mongso, lokasi, dan tahun.
          </p>
          <div className="mt-4 inline-block px-3 py-1 rounded-full bg-accent/15 text-xs font-semibold" style={{ color: "var(--leaf)" }}>
            🌱 Open Science Initiative
          </div>
        </div>
      </section>
    </div>
  );
}
