import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  LineChart, Line, Legend,
} from "recharts";
import { Droplets, Thermometer, Wind, CloudRain, MapPin, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  getCurrentMongso, MONGSO_LIST, PREDICTED_WEATHER, ACTUAL_WEATHER,
  calculateIKM, getIKMCategory,
  type WeatherProfile,
} from "@/lib/mongso";
import { CITIES, findCity } from "@/lib/cities";
import { useCityId } from "@/lib/cityStore";
import { fetchWeather, type WeatherResult } from "@/lib/weather.functions";
import { MongsoCard } from "@/components/MongsoCard";
import { IKMGauge } from "@/components/IKMGauge";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PranataCalc" },
      { name: "description", content: "Dashboard validasi cuaca BMKG real-time & IKM score per Mongso." },
      { property: "og:title", content: "Dashboard — PranataCalc" },
      { property: "og:description", content: "Visualisasi IKM berbasis data BMKG live dan perbandingan prediksi vs aktual." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [cityId, setCityId] = useCityId();
  const city = findCity(cityId);
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

  // Build "actual" profile: prefer live BMKG data, scale rainfall from 3-day total to mongso period
  const live = weather?.source === "bmkg" ? weather.averages : null;
  const liveActual: WeatherProfile | null = live
    ? {
        // BMKG returns ~3-day accumulated rainfall; project to mongso period length
        rainfall: Math.round((live.rainfall / 3) * mongso.days),
        temperature: live.temperature,
        humidity: live.humidity,
        wind: live.wind,
      }
    : null;

  const actual = liveActual ?? ACTUAL_WEATHER[mongso.number];
  const ikm = calculateIKM(predicted, actual);

  const allIKM = MONGSO_LIST.map((m) => ({
    name: m.name,
    num: m.number,
    ikm: m.number === mongso.number
      ? ikm
      : calculateIKM(PREDICTED_WEATHER[m.number], ACTUAL_WEATHER[m.number]),
  }));

  const compareData = [
    { metric: "Curah Hujan (mm)", prediksi: predicted.rainfall, aktual: actual.rainfall, icon: CloudRain },
    { metric: "Suhu (°C)", prediksi: predicted.temperature, aktual: actual.temperature, icon: Thermometer },
    { metric: "Kelembapan (%)", prediksi: predicted.humidity, aktual: actual.humidity, icon: Droplets },
    { metric: "Angin (km/h)", prediksi: predicted.wind, aktual: actual.wind, icon: Wind },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-muted-foreground tracking-wider">DASHBOARD</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-1">Validasi Mongso & Cuaca</h1>
          <p className="text-muted-foreground mt-2">Data cuaca live dari BMKG, divalidasi terhadap prediksi Pranata Mongso.</p>
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
            title="Refresh data BMKG"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Source banner */}
      <div className="mb-6">
        {weather?.source === "bmkg" ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ background: "color-mix(in oklab, var(--leaf) 12%, transparent)", color: "var(--leaf)" }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span><b>Live BMKG</b> · {weather.city}, {weather.province} · diperbarui {new Date(weather.fetchedAt).toLocaleTimeString("id-ID")}</span>
          </div>
        ) : weather?.source === "fallback" ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ background: "color-mix(in oklab, var(--warn) 18%, transparent)", color: "oklch(0.5 0.15 70)" }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>BMKG tidak tersedia — menggunakan data estimasi historis. ({weather.error})</span>
          </div>
        ) : (
          <div className="px-4 py-2.5 rounded-lg text-sm bg-secondary text-muted-foreground">Memuat data BMKG…</div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><MongsoCard mongso={mongso} current /></div>
        <div className="rounded-2xl bg-card border border-border shadow-soft p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-primary mb-2">Indeks Kesesuaian Mongso</h3>
          <IKMGauge score={ikm} />
        </div>
      </div>

      {/* 3-Day Forecast */}
      {weather?.source === "bmkg" && weather.daily.length > 0 && (
        <div className="mt-8 rounded-2xl bg-gradient-card border border-border shadow-soft p-6">
          <h2 className="font-display text-xl font-bold text-primary">Cuaca 3 Hari ke Depan</h2>
          <p className="text-sm text-muted-foreground mt-1">Prakiraan BMKG untuk {weather.city}</p>
          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            {weather.daily.slice(0, 3).map((d) => (
              <div key={d.date} className="rounded-xl bg-card border border-border p-4">
                <div className="text-xs text-muted-foreground">
                  {new Date(d.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}
                </div>
                <div className="mt-2 font-semibold text-primary">{d.desc}</div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-2xl font-display font-bold tabular-nums" style={{ color: "var(--sky)" }}>{d.tempMax}°</span>
                  <span className="text-sm text-muted-foreground tabular-nums">/ {d.tempMin}°</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <CloudRain className="w-3.5 h-3.5" /> {d.rainfall} mm
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 24h Line Charts */}
      {weather?.source === "bmkg" && weather.forecast.length > 0 && (() => {
        const points = weather.forecast.slice(0, 8).map((p) => {
          const d = new Date(p.datetime);
          const hh = String(d.getHours()).padStart(2, "0");
          return {
            time: `${hh}:00`,
            rainfall: p.rainfall,
            temperature: p.temperature,
            humidity: p.humidity,
            wind: p.wind,
          };
        });
        const tooltipStyle = { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 13 };
        const axisTick = { fontSize: 12, fill: "var(--color-muted-foreground)" };
        return (
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
              <h2 className="font-display text-xl font-bold text-primary">Tren 24 Jam — Hujan & Suhu</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Prakiraan BMKG per 3 jam untuk {weather.city}.
              </p>
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
              <p className="text-sm text-muted-foreground mt-1">
                Prakiraan BMKG per 3 jam untuk {weather.city}.
              </p>
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
                    <Line yAxisId="right" type="monotone" dataKey="wind" name="Angin (km/h)" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Compare */}
      <div className="mt-8 rounded-2xl bg-card border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-bold text-primary">
          Prediksi Pranata Mongso vs {liveActual ? "Cuaca BMKG (Live)" : "Cuaca Aktual"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Mongso {mongso.name} · {liveActual ? "rainfall diproyeksikan dari prakiraan 3 hari" : "data estimasi historis"}.
        </p>
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
        <p className="text-sm text-muted-foreground mt-1">
          Mongso saat ini ({mongso.name}) menggunakan data BMKG live; lainnya adalah estimasi historis.
        </p>
        <div className="h-80 mt-6">
          <ResponsiveContainer>
            <BarChart data={allIKM} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 13 }} />
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
