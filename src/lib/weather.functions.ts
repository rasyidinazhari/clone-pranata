import { createServerFn } from "@tanstack/react-start";
import { findCity } from "@/lib/cities";

export type ForecastPoint = {
  datetime: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  wind: number;
  weatherDesc: string;
  weatherIcon?: string;
};

export type WeatherResult = {
  city: string;
  province: string;
  fetchedAt: string;
  forecast: ForecastPoint[];
  averages: {
    rainfall: number;
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
  source: "simulasi";
  error: string | null;
};

type MonthWeather = { ch: number; suhu: number; lembab: number; angin: number };

type CityWeather = Record<number, MonthWeather>;

const YOGYAKARTA: CityWeather = {
  1: { ch: 310, suhu: 26, lembab: 86, angin: 14 },
  2: { ch: 280, suhu: 26, lembab: 85, angin: 13 },
  3: { ch: 230, suhu: 27, lembab: 84, angin: 14 },
  4: { ch: 120, suhu: 28, lembab: 81, angin: 15 },
  5: { ch: 60, suhu: 28, lembab: 78, angin: 16 },
  6: { ch: 20, suhu: 27, lembab: 73, angin: 18 },
  7: { ch: 10, suhu: 26, lembab: 70, angin: 22 },
  8: { ch: 15, suhu: 27, lembab: 68, angin: 24 },
  9: { ch: 30, suhu: 28, lembab: 70, angin: 20 },
  10: { ch: 80, suhu: 28, lembab: 75, angin: 17 },
  11: { ch: 160, suhu: 27, lembab: 80, angin: 15 },
  12: { ch: 270, suhu: 26, lembab: 84, angin: 14 },
};

const vary = (base: CityWeather, chMul: number, suhuAdd: number, lembabAdd: number, anginAdd: number): CityWeather =>
  Object.fromEntries(Object.entries(base).map(([month, v]) => [Number(month), {
    ch: Math.max(0, Math.round(v.ch * chMul)),
    suhu: Math.round((v.suhu + suhuAdd) * 10) / 10,
    lembab: Math.max(45, Math.min(95, Math.round(v.lembab + lembabAdd))),
    angin: Math.max(5, Math.round(v.angin + anginAdd)),
  }])) as CityWeather;

export const MOCK_BMKG: Record<string, CityWeather> = {
  Yogyakarta: YOGYAKARTA,
  Klaten: vary(YOGYAKARTA, 0.95, 1, -1, -1),
  Sleman: vary(YOGYAKARTA, 1.08, -0.5, 2, 0),
  Bantul: vary(YOGYAKARTA, 0.98, 0.6, 0, 2),
  Surakarta: vary(YOGYAKARTA, 0.9, 1.2, -2, -1),
  Magelang: vary(YOGYAKARTA, 1.12, -1.2, 3, 0),
  Wonosari: vary(YOGYAKARTA, 0.72, 0.8, -4, 2),
  Wates: vary(YOGYAKARTA, 1.05, 0.4, 1, 3),
};

const weatherDesc = (rainfall: number) => {
  if (rainfall >= 8) return "Hujan sedang";
  if (rainfall >= 3) return "Hujan ringan";
  if (rainfall > 0) return "Gerimis";
  return "Berawan";
};

function buildForecast(monthly: MonthWeather): ForecastPoint[] {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const dayRain = monthly.ch / 30;
  const weights = [0.06, 0.04, 0.02, 0.03, 0.09, 0.16, 0.24, 0.36];
  return Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const slot = i % 8;
    const tempWave = slot >= 3 && slot <= 5 ? 1.4 : slot <= 1 ? -1.1 : 0;
    const rain = Math.round(dayRain * weights[slot] * 10) / 10;
    return {
      datetime: hour.toISOString(),
      rainfall: rain,
      temperature: Math.round((monthly.suhu + tempWave) * 10) / 10,
      humidity: Math.max(45, Math.min(96, Math.round(monthly.lembab + (rain > 0 ? 2 : -1)))),
      wind: Math.max(4, Math.round(monthly.angin + (slot >= 4 ? 1 : -1))),
      weatherDesc: weatherDesc(rain),
    };
  });
}

export const fetchWeather = createServerFn({ method: "GET" })
  .inputValidator((data: { cityId: string }) => {
    const id = String(data?.cityId ?? "").slice(0, 50);
    if (!/^[a-z0-9_-]+$/i.test(id)) throw new Error("Invalid cityId");
    return { cityId: id };
  })
  .handler(async ({ data }): Promise<WeatherResult> => {
    const city = findCity(data.cityId);
    const month = new Date().getMonth() + 1;
    const monthly = MOCK_BMKG[city.name]?.[month] ?? MOCK_BMKG.Yogyakarta[month];
    const forecast = buildForecast(monthly);
    const byDate = new Map<string, ForecastPoint[]>();
    forecast.forEach((p) => {
      const date = p.datetime.slice(0, 10);
      if (!byDate.has(date)) byDate.set(date, []);
      byDate.get(date)!.push(p);
    });
    const daily = Array.from(byDate.entries()).map(([date, pts]) => {
      const temps = pts.map((p) => p.temperature);
      return {
        date,
        rainfall: Math.round(pts.reduce((sum, p) => sum + p.rainfall, 0) * 10) / 10,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        desc: pts[Math.floor(pts.length / 2)]?.weatherDesc ?? "Berawan",
      };
    });

    return {
      city: city.name,
      province: city.province,
      fetchedAt: new Date().toISOString(),
      forecast,
      averages: {
        rainfall: monthly.ch,
        temperature: monthly.suhu,
        humidity: monthly.lembab,
        wind: monthly.angin,
      },
      daily,
      source: "simulasi",
      error: null,
    };
  });
