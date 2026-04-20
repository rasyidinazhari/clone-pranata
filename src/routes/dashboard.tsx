import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";
import { Droplets, Thermometer, Wind, CloudRain } from "lucide-react";
import {
  getCurrentMongso, MONGSO_LIST, PREDICTED_WEATHER, ACTUAL_WEATHER,
  calculateIKM, getIKMCategory,
} from "@/lib/mongso";
import { MongsoCard } from "@/components/MongsoCard";
import { IKMGauge } from "@/components/IKMGauge";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PranataCalc" },
      { name: "description", content: "Dashboard validasi cuaca & IKM score per Mongso." },
      { property: "og:title", content: "Dashboard — PranataCalc" },
      { property: "og:description", content: "Visualisasi IKM dan perbandingan prediksi vs aktual." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const mongso = getCurrentMongso();
  const predicted = PREDICTED_WEATHER[mongso.number];
  const actual = ACTUAL_WEATHER[mongso.number];
  const ikm = calculateIKM(predicted, actual);

  const allIKM = MONGSO_LIST.map((m) => ({
    name: m.name,
    num: m.number,
    ikm: calculateIKM(PREDICTED_WEATHER[m.number], ACTUAL_WEATHER[m.number]),
  }));

  const compareData = [
    { metric: "Curah Hujan (mm)", prediksi: predicted.rainfall, aktual: actual.rainfall, icon: CloudRain },
    { metric: "Suhu (°C)", prediksi: predicted.temperature, aktual: actual.temperature, icon: Thermometer },
    { metric: "Kelembapan (%)", prediksi: predicted.humidity, aktual: actual.humidity, icon: Droplets },
    { metric: "Angin (km/h)", prediksi: predicted.wind, aktual: actual.wind, icon: Wind },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-mono text-muted-foreground tracking-wider">DASHBOARD</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">Validasi Mongso & Cuaca</h1>
        <p className="text-muted-foreground mt-2">Pemantauan akurasi prediksi Pranata Mongso terhadap data cuaca aktual.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><MongsoCard mongso={mongso} current /></div>
        <div className="rounded-2xl bg-card border border-border shadow-soft p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-primary mb-2">Indeks Kesesuaian Mongso</h3>
          <IKMGauge score={ikm} />
        </div>
      </div>

      {/* Compare */}
      <div className="mt-8 rounded-2xl bg-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary">Prediksi Pranata Mongso vs Cuaca Aktual</h2>
        <p className="text-sm text-muted-foreground mt-1">Mongso {mongso.name} — perbandingan 4 parameter utama.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {compareData.map((c) => {
            const Icon = c.icon;
            const diff = (((c.aktual - c.prediksi) / c.prediksi) * 100).toFixed(1);
            const positive = Number(diff) >= 0;
            return (
              <div key={c.metric} className="rounded-xl bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Icon className="w-3.5 h-3.5" /> {c.metric}
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Prediksi</span>
                    <span className="font-semibold tabular-nums text-primary">{c.prediksi}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Aktual</span>
                    <span className="font-semibold tabular-nums" style={{ color: "var(--sky)" }}>{c.aktual}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs font-medium" style={{ color: positive ? "var(--leaf)" : "var(--alert)" }}>
                  {positive ? "+" : ""}{diff}% selisih
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar chart */}
      <div className="mt-8 rounded-2xl bg-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary">IKM Score — 12 Mongso (Tahun Ini)</h2>
        <p className="text-sm text-muted-foreground mt-1">Hijau ≥70 sangat sesuai • Kuning 50–69 • Oranye 30–49 • Merah &lt;30</p>
        <div className="h-80 mt-6">
          <ResponsiveContainer>
            <BarChart data={allIKM} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="ikm" radius={[8, 8, 0, 0]}>
                {allIKM.map((d) => (
                  <Cell key={d.num} fill={getIKMCategory(d.ikm).color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
