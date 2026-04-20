import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Award, Activity } from "lucide-react";
import { MONGSO_LIST, calculateIKM, PREDICTED_WEATHER, ACTUAL_WEATHER } from "@/lib/mongso";

export const Route = createFileRoute("/historis")({
  head: () => ({
    meta: [
      { title: "Analisis Historis — PranataCalc" },
      { name: "description", content: "Tren akurasi IKM Pranata Mongso 2014–2024." },
      { property: "og:title", content: "Analisis Historis — PranataCalc" },
      { property: "og:description", content: "Tren historis akurasi prediksi mongso 10 tahun terakhir." },
    ],
  }),
  component: HistorisPage,
});

// Deterministic pseudo-random per (mongso, year) for stable mock data
function seedScore(mongsoNum: number, year: number) {
  const base = calculateIKM(PREDICTED_WEATHER[mongsoNum], ACTUAL_WEATHER[mongsoNum]);
  const seed = Math.sin(mongsoNum * 12.9898 + year * 78.233) * 43758.5453;
  const noise = (seed - Math.floor(seed)) * 30 - 15; // ±15
  return Math.max(10, Math.min(100, Math.round(base + noise)));
}

const YEARS = Array.from({ length: 11 }, (_, i) => 2014 + i);

function HistorisPage() {
  const [selected, setSelected] = useState<number[]>([4, 7, 10]);

  const data = useMemo(
    () =>
      YEARS.map((year) => {
        const row: Record<string, number | string> = { year };
        MONGSO_LIST.forEach((m) => (row[m.name] = seedScore(m.number, year)));
        return row;
      }),
    []
  );

  // stats
  const allAvgs = MONGSO_LIST.map((m) => ({
    name: m.name,
    num: m.number,
    avg: Math.round(YEARS.reduce((s, y) => s + seedScore(m.number, y), 0) / YEARS.length),
  }));
  const overallAvg = Math.round(allAvgs.reduce((s, a) => s + a.avg, 0) / allAvgs.length);
  const best = [...allAvgs].sort((a, b) => b.avg - a.avg)[0];
  const recentTrend = (() => {
    const first = YEARS.slice(0, 3).reduce((s, y) => s + allAvgs.reduce((ss, m) => ss + seedScore(m.num, y), 0) / 12, 0) / 3;
    const last = YEARS.slice(-3).reduce((s, y) => s + allAvgs.reduce((ss, m) => ss + seedScore(m.num, y), 0) / 12, 0) / 3;
    return Math.round(last - first);
  })();

  const colors = ["var(--navy)", "var(--sky)", "var(--leaf)", "oklch(0.7 0.18 50)", "var(--alert)", "oklch(0.6 0.2 300)"];

  const toggle = (n: number) =>
    setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : s.length < 6 ? [...s, n] : s));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-mono text-muted-foreground tracking-wider">ANALISIS HISTORIS</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">Tren Akurasi 2014–2024</h1>
        <p className="text-muted-foreground mt-2">Bagaimana akurasi prediksi Pranata Mongso berubah dalam dekade terakhir.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><Activity className="w-3.5 h-3.5" /> RATA-RATA AKURASI</div>
          <div className="text-4xl font-display font-bold text-primary mt-2 tabular-nums">{overallAvg}<span className="text-lg text-muted-foreground">/100</span></div>
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><Award className="w-3.5 h-3.5" /> MONGSO PALING AKURAT</div>
          <div className="text-2xl font-display font-bold text-primary mt-2">{best.name}</div>
          <div className="text-sm" style={{ color: "var(--leaf)" }}>Rata-rata IKM {best.avg}</div>
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><TrendingUp className="w-3.5 h-3.5" /> TREN PERUBAHAN</div>
          <div className="text-3xl font-display font-bold mt-2 tabular-nums" style={{ color: recentTrend < 0 ? "var(--alert)" : "var(--leaf)" }}>
            {recentTrend > 0 ? "+" : ""}{recentTrend}
          </div>
          <div className="text-xs text-muted-foreground">poin (3 tahun awal vs akhir)</div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary">Tren IKM per Mongso</h2>
        <p className="text-sm text-muted-foreground mt-1">Klik nama mongso untuk membandingkan (maks 6).</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {MONGSO_LIST.map((m) => {
            const active = selected.includes(m.number);
            return (
              <button
                key={m.number}
                onClick={() => toggle(m.number)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                style={{
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "var(--primary-foreground)" : "var(--foreground)",
                  borderColor: active ? "var(--primary)" : "var(--border)",
                }}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        <div className="h-96 mt-6">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {selected.map((n, i) => {
                const m = MONGSO_LIST[n - 1];
                return (
                  <Line
                    key={n}
                    type="monotone"
                    dataKey={m.name}
                    stroke={colors[i % colors.length]}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
