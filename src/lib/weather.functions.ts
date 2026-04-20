import { createServerFn } from "@tanstack/react-start";
import { findCity } from "@/lib/cities";

export type ForecastPoint = {
  datetime: string; // ISO
  rainfall: number; // mm
  temperature: number; // °C
  humidity: number; // %
  wind: number; // km/h
  weatherDesc: string;
  weatherIcon?: string;
};

export type WeatherResult = {
  city: string;
  province: string;
  fetchedAt: string;
  forecast: ForecastPoint[]; // 3-hour points, ~3 days
  averages: {
    rainfall: number; // total accumulated mm
    temperature: number;
    humidity: number;
    wind: number;
  };
  daily: Array<{
    date: string;
    rainfall: number;
    tempMin: number;
    tempMax: number;
    desc: string;
  }>;
  source: "bmkg" | "fallback";
  error: string | null;
};

type BMKGCuacaItem = {
  datetime?: string;
  local_datetime?: string;
  t?: number; // temp °C
  hu?: number; // humidity %
  ws?: number; // wind speed km/h
  tp?: number; // precipitation mm (per 3h)
  weather_desc?: string;
  image?: string;
};

type BMKGResponse = {
  data?: Array<{
    cuaca?: BMKGCuacaItem[][];
  }>;
};

function fallbackResult(cityId: string, error: string): WeatherResult {
  const c = findCity(cityId);
  return {
    city: c.name,
    province: c.province,
    fetchedAt: new Date().toISOString(),
    forecast: [],
    averages: { rainfall: 0, temperature: 0, humidity: 0, wind: 0 },
    daily: [],
    source: "fallback",
    error,
  };
}

export const fetchWeather = createServerFn({ method: "GET" })
  .inputValidator((data: { cityId: string }) => {
    const id = String(data?.cityId ?? "").slice(0, 50);
    if (!/^[a-z0-9_-]+$/i.test(id)) throw new Error("Invalid cityId");
    return { cityId: id };
  })
  .handler(async ({ data }): Promise<WeatherResult> => {
    const city = findCity(data.cityId);
    const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(city.adm4)}`;

    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        return fallbackResult(data.cityId, `BMKG API error ${res.status}`);
      }
      const json = (await res.json()) as BMKGResponse;
      const flat: BMKGCuacaItem[] = json?.data?.[0]?.cuaca?.flat() ?? [];
      if (flat.length === 0) {
        return fallbackResult(data.cityId, "No forecast data");
      }

      const forecast: ForecastPoint[] = flat.map((p) => ({
        datetime: p.local_datetime ?? p.datetime ?? "",
        rainfall: Number(p.tp ?? 0),
        temperature: Number(p.t ?? 0),
        humidity: Number(p.hu ?? 0),
        wind: Number(p.ws ?? 0),
        weatherDesc: p.weather_desc ?? "-",
        weatherIcon: p.image,
      }));

      const n = forecast.length;
      const sum = forecast.reduce(
        (a, p) => ({
          rainfall: a.rainfall + p.rainfall,
          temperature: a.temperature + p.temperature,
          humidity: a.humidity + p.humidity,
          wind: a.wind + p.wind,
        }),
        { rainfall: 0, temperature: 0, humidity: 0, wind: 0 },
      );

      // Group by date for daily summary
      const byDate = new Map<string, ForecastPoint[]>();
      forecast.forEach((p) => {
        const date = p.datetime.slice(0, 10);
        if (!byDate.has(date)) byDate.set(date, []);
        byDate.get(date)!.push(p);
      });
      const daily = Array.from(byDate.entries()).map(([date, pts]) => {
        const temps = pts.map((p) => p.temperature);
        const mid = pts[Math.floor(pts.length / 2)];
        return {
          date,
          rainfall: Math.round(pts.reduce((s, p) => s + p.rainfall, 0) * 10) / 10,
          tempMin: Math.round(Math.min(...temps)),
          tempMax: Math.round(Math.max(...temps)),
          desc: mid?.weatherDesc ?? "-",
        };
      });

      return {
        city: city.name,
        province: city.province,
        fetchedAt: new Date().toISOString(),
        forecast,
        averages: {
          rainfall: Math.round(sum.rainfall * 10) / 10, // 3-day total
          temperature: Math.round((sum.temperature / n) * 10) / 10,
          humidity: Math.round(sum.humidity / n),
          wind: Math.round((sum.wind / n) * 10) / 10,
        },
        daily,
        source: "bmkg",
        error: null,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return fallbackResult(data.cityId, msg);
    }
  });
