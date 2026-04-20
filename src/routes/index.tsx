import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { getCurrentMongso } from "@/lib/mongso";
import { CITIES, findCity } from "@/lib/cities";
import { useCityId } from "@/lib/cityStore";
import { MongsoCard } from "@/components/MongsoCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PranataCalc — Kearifan Lokal, Divalidasi Sains" },
      { name: "description", content: "Platform validasi ilmiah Pranata Mongso. Deteksi mongso otomatis, IKM score, & rekomendasi tanam berbasis data cuaca." },
      { property: "og:title", content: "PranataCalc — Kearifan Lokal, Divalidasi Sains" },
      { property: "og:description", content: "Platform validasi ilmiah kalender tani tradisional Jawa." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [cityId, setCityId] = useCityId();
  const city = findCity(cityId);
  const mongso = getCurrentMongso();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 60%, white 0, transparent 35%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Validasi Ilmiah Pranata Mongso
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-balance leading-[1.05]">
            Kearifan Lokal,<br />
            <span style={{ color: "var(--leaf)" }}>Divalidasi Sains</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-primary-foreground/85 max-w-2xl text-balance">
            Sistem validasi ilmiah kalender tani Pranata Mongso dengan data cuaca real-time. Membantu petani Indonesia memutuskan kapan menanam dengan presisi.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/rekomendasi" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 transition shadow-elevated">
              Lihat Rekomendasi Tanam <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 font-semibold hover:bg-white/15 transition">
              Buka Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Current Mongso + Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MongsoCard mongso={mongso} current />
          </div>
          <div className="rounded-2xl bg-card border border-border shadow-soft p-6 flex flex-col">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="w-4 h-4" />
              <h3 className="font-semibold">Lokasi Anda</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Pilih kota untuk data cuaca BMKG real-time.</p>
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.province}</option>)}
            </select>
            <div className="mt-4 p-4 rounded-xl bg-secondary text-sm">
              <div className="text-muted-foreground text-xs">Lokasi terpilih</div>
              <div className="font-semibold text-primary mt-0.5">{city.name}</div>
              <div className="text-xs text-muted-foreground">{city.province}</div>
            </div>
            <Link to="/dashboard" className="mt-auto pt-4 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "var(--sky)" }}>
              Validasi data cuaca <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { t: "12 Mongso Terdeteksi", d: "Deteksi otomatis berdasarkan tanggal hari ini.", e: "📅" },
            { t: "IKM Score Real-time", d: "Indeks Kesesuaian Mongso berbasis 4 parameter cuaca.", e: "📊" },
            { t: "Rekomendasi Tanam", d: "Tanaman tepat untuk mongso & lokasi Anda.", e: "🌱" },
          ].map((f) => (
            <div key={f.t} className="rounded-xl bg-card border border-border p-5 hover:shadow-soft transition">
              <div className="text-3xl">{f.e}</div>
              <div className="font-semibold text-primary mt-3">{f.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
