import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  LineChart, Line, Legend,
} from "recharts";
import { Droplets, Thermometer, Wind, CloudRain, MapPin, RefreshCw, Info, CheckCircle2 } from "lucide-react";
import {
  getCurrentMongso, MONGSO_LIST, PREDICTED_WEATHER,
  calculateIKM, calculateIKMDetails, getIKMCategory,
  type WeatherProfile,
} from "@/lib/mongso";
import { CITIES } from "@/lib/cities";
import { useCityId } from "@/lib/cityStore";
import { fetchWeather, type WeatherResult } from "@/lib/weather.functions";
import { MongsoCard } from "@/components/MongsoCard";
import { IKMGauge } from "@/components/IKMGauge";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PranataCalc" },
      { name: "description", content: "Dashboard validasi cuaca dan IKM score per Mongso." },
      { property: "og:title", content: "Dashboard — PranataCalc" },
      { property: "og:description", content: "Visualisasi IKM berbasis data simulasi historis BMKG dan perbandingan prediksi vs aktual." },
    ],
  }),
  component: DashboardPage,
});

const scoreColor = (score: number) => score >= 70 ? "var(--leaf)" : score >= 50 ? "var(--warn)" : "var(--alert)";
const scoreBg = (score: number) => score >= 70
  ? "color-mix(in oklab, var(--leaf) 12%, transparent)"
  : score >= 50
    ? "color-mix(in oklab, var(--warn) 18%, transparent)"
    : "color-mix(in oklab, var(--alert) 10%, transparent)";

function DashboardPage() {
  const [cityId, setCityId] = useCityId();
  const mongso = getCurrentMongso();
  const predicted = PREDICTED_WEATHER[mongso.number];

  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetchWeather({ data: { cityId: id } });
      setWeather(res);
    } catch {
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(cityId); }, [cityId]);

  const simulated = weather?.averages;
  const actual: WeatherProfile = simulated
    ? {
        rainfall: simulated.rainfall,
        temperature: simulated.temperature,
        humidity: simulated.humidity,
        wind: simulated.wind,
      }
    : predicted;
  const ikmDetails = calculateIKMDetails(predicted, actual, mongso);
  const ikm = ikmDetails.ikm;
  const category = getIKMCategory(ikm);

  const allIKM = MONGSO_LIST.map((m) => ({
    name: m.name,
    num: m.number,
    ikm: m.number === mongso.number ? ikm : calculateIKM(PREDICTED_WEATHER[m.number], PREDICTED_WEATHER[m.number], m),
  }));

  const comparisonRows = [
    { parameter: "Curah Hujan", ideal: `${mongso.ideal.ch} mm`, actual: `${actual.rainfall} mm`, score: ikmDetails.skorCH, weight: "40%", icon: CloudRain },
    { parameter: "Suhu Udara", ideal: `${mongso.ideal.suhu} °C`, actual: `${actual.temperature} °C`, score: ikmDetails.skorSuhu, weight: "30%", icon: Thermometer },
    { parameter: "Kelembaban", ideal: `${mongso.ideal.lembab}%`, actual: `${actual.humidity}%`, score: ikmDetails.skorLembab, weight: "20%", icon: Droplets },
    { parameter: "Kec. Angin", ideal: `${mongso.ideal.angin} km/jam`, actual: `${actual.wind} km/jam`, score: ikmDetails.skorAngin, weight: "10%", icon: Wind },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-muted-foreground tracking-wider">DASHBOARD</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">Validasi Mongso & Cuaca</h1>
          <p className="text-muted-foreground mt-2">Data simulasi historis BMKG divalidasi terhadap Pranata Mongso.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="pl-9 pr-3 py-2.5 rounded-lg border border-input bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => load(cityId)}
            disabled={loading}
            className="p-2.5 rounded-lg border border-input bg-card hover:bg-secondary transition disabled:opacity-50"
            title="Refresh data simulasi"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ background: "color-mix(in oklab, var(--sky) 12%, transparent)", color: "var(--primary)" }}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span><b>Data simulasi berbasis rata-rata historis BMKG</b>{weather ? ` · ${weather.city}, ${weather.province}` : ""}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><MongsoCard mongso={mongso} current /></div>
        <div className="rounded-2xl bg-card border border-border shadow-soft p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-primary mb-2">Indeks Kesesuaian Mongso</h3>
          <IKMGauge score={ikm} />
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
          <h2 className="font-display text-xl font-bold text-primary">Breakdown Skor IKM</h2>
          <div className="mt-5 space-y-3">
            {comparisonRows.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.parameter} className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary"><Icon className="w-4 h-4" />{row.parameter}</div>
                  <div className="text-sm font-semibold tabular-nums" style={{ color: scoreColor(row.score) }}>{row.score}/100 <span className="text-xs text-muted-foreground">(bobot {row.weight})</span></div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl p-4" style={{ background: category.bg }}>
            <div className="text-sm text-muted-foreground">IKM Total</div>
            <div className="text-2xl font-display font-bold tabular-nums" style={{ color: category.color }}>{ikm} → {category.label}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border shadow-soft p-6">
          <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2"><Info className="w-5 h-5" style={{ color: "var(--sky)" }} /> Metodologi</h2>
          <p className="text-sm text-foreground/75 mt-3 leading-relaxed">
            IKM dihitung menggunakan fungsi keanggotaan segitiga (triangular membership function). Setiap parameter iklim dinormalisasi ke skor 0–100 berdasarkan jarak dari nilai ideal Pranata Mongso, lalu digabungkan dengan bobot: Curah Hujan 40%, Suhu 30%, Kelembaban 20%, Angin 10%.
          </p>
        </div>
      </div>

      {weather && weather.daily.length > 0 && (
        <div className="mt-8 rounded-2xl bg-gradient-card border border-border shadow-soft p-6">
          <h2 className="font-display text-xl font-bold text-primary">Cuaca Simulasi 3 Hari ke Depan</h2>
          <p className="text-sm text-muted-foreground mt-1">Proyeksi 3 jam berbasis rata-rata historis untuk {weather.city}</p>
          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            {weather.daily.slice(0, 3).map((d) => (
              <div key={d.date} className="rounded-xl bg-card border border-border p-4">
                <div className="text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}</div>
                <div className="mt-2 font-semibold text-primary">{d.desc}</div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-2xl font-display font-bold tabular-nums" style={{ color: "var(--sky)" }}>{d.tempMax}°</span>
                  <span className="text-sm text-muted-foreground tabular-nums">/ {d.tempMin}°</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><CloudRain className="w-3.5 h-3.5" /> {d.rainfall} mm</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {weather && weather.forecast.length > 0 && (() => {
        const points = weather.forecast.slice(0, 8).map((p) => {
          const d = new Date(p.datetime);
          return { time: `${String(d.getHours()).padStart(2, "0")}:00`, rainfall: p.rainfall, temperature: p.temperature, humidity: p.humidity, wind: p.wind };
        });
        const tooltipStyle = { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 13 };
        const axisTick = { fontSize: 12, fill: "var(--color-muted-foreground)" };
        return (
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
              <h2 className="font-display text-xl font-bold text-primary">Tren 24 Jam — Hujan & Suhu</h2>
              <p className="text-sm text-muted-foreground mt-1">Titik simulasi per 3 jam untuk {weather.city}.</p>
              <div className="h-72 mt-6">
                <ResponsiveContainer>
                  <LineChart data={points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="time" tick={axisTick} />
                    <YAxis yAxisId="left" tick={axisTick} />
                    <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line yAxisId="left" type="monotone" dataKey="rainfall" name="Hujan (mm)" stroke="var(--sky)" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" name="Suhu (°C)" stroke="var(--alert)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
              <h2 className="font-display text-xl font-bold text-primary">Tren 24 Jam — Kelembapan & Angin</h2>
              <p className="text-sm text-muted-foreground mt-1">Titik simulasi per 3 jam untuk {weather.city}.</p>
              <div className="h-72 mt-6">
                <ResponsiveContainer>
                  <LineChart data={points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="time" tick={axisTick} />
                    <YAxis yAxisId="left" domain={[0, 100]} tick={axisTick} />
                    <YAxis yAxisId="right" orientation="right" tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line yAxisId="left" type="monotone" dataKey="humidity" name="Kelembapan (%)" stroke="var(--leaf)" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="wind" name="Angin (km/jam)" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="mt-8 rounded-2xl bg-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary">Perbandingan IKM</h2>
        <p className="text-sm text-muted-foreground mt-1">Mongso {mongso.name} · prediksi Pranata Mongso dibandingkan data simulasi BMKG aktual.</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Parameter</th>
                <th className="py-3 px-4 font-medium">Prediksi Pranata Mongso</th>
                <th className="py-3 px-4 font-medium">Data BMKG Aktual</th>
                <th className="py-3 px-4 font-medium">Skor</th>
                <th className="py-3 pl-4 font-medium">Bobot</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.parameter} className="border-b border-border/70" style={{ background: scoreBg(row.score) }}>
                  <td className="py-3 pr-4 font-semibold text-primary">{row.parameter}</td>
                  <td className="py-3 px-4 tabular-nums">{row.ideal}</td>
                  <td className="py-3 px-4 tabular-nums">{row.actual}</td>
                  <td className="py-3 px-4 font-semibold tabular-nums" style={{ color: scoreColor(row.score) }}>{row.score}/100</td>
                  <td className="py-3 pl-4 tabular-nums">{row.weight}</td>
                </tr>
              ))}
              <tr className="font-bold text-primary">
                <td className="py-3 pr-4">IKM Total</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4 tabular-nums" style={{ color: category.color }}>{ikm}</td>
                <td className="py-3 pl-4">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary">IKM Score — 12 Mongso (Tahun Ini)</h2>
        <p className="text-sm text-muted-foreground mt-1">Mongso saat ini ({mongso.name}) menggunakan data simulasi BMKG; lainnya memakai nilai ideal sebagai pembanding.</p>
        <div className="h-80 mt-6">
          <ResponsiveContainer>
            <BarChart data={allIKM} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="ikm" radius={[8, 8, 0, 0]}>
                {allIKM.map((d) => <Cell key={d.num} fill={getIKMCategory(d.ikm).color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
