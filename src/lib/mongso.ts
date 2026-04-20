export type Mongso = {
  number: number;
  name: string;
  period: string;
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number;
  endDay: number;
  days: number;
  characteristics: string;
  season: "Kemarau" | "Pancaroba" | "Hujan";
  emoji: string;
};

export const MONGSO_LIST: Mongso[] = [
  { number: 1, name: "Kasa", period: "22 Juni – 1 Agustus", startMonth: 6, startDay: 22, endMonth: 8, endDay: 1, days: 41, characteristics: "Awal kemarau, daun berguguran, tanah mulai mengering.", season: "Kemarau", emoji: "🍂" },
  { number: 2, name: "Karo", period: "2 Agustus – 24 Agustus", startMonth: 8, startDay: 2, endMonth: 8, endDay: 24, days: 23, characteristics: "Tanah retak-retak, pohon randu & mangga berbuah.", season: "Kemarau", emoji: "🌵" },
  { number: 3, name: "Katelu", period: "25 Agustus – 17 September", startMonth: 8, startDay: 25, endMonth: 9, endDay: 17, days: 24, characteristics: "Puncak kemarau, umbi-umbian tumbuh, panen palawija.", season: "Kemarau", emoji: "🌾" },
  { number: 4, name: "Kapat", period: "18 September – 12 Oktober", startMonth: 9, startDay: 18, endMonth: 10, endDay: 12, days: 25, characteristics: "Hujan pertama mulai turun, sumur mulai berair.", season: "Pancaroba", emoji: "🌦️" },
  { number: 5, name: "Kalima", period: "13 Oktober – 8 November", startMonth: 10, startDay: 13, endMonth: 11, endDay: 8, days: 27, characteristics: "Hujan meningkat, angin kencang, pelangi muncul.", season: "Pancaroba", emoji: "🌈" },
  { number: 6, name: "Kanem", period: "9 November – 21 Desember", startMonth: 11, startDay: 9, endMonth: 12, endDay: 21, days: 43, characteristics: "Musim buah-buahan, hujan deras, banyak hama.", season: "Hujan", emoji: "🌧️" },
  { number: 7, name: "Kapitu", period: "22 Desember – 3 Februari", startMonth: 12, startDay: 22, endMonth: 2, endDay: 3, days: 43, characteristics: "Puncak musim hujan, banjir, sungai meluap.", season: "Hujan", emoji: "⛈️" },
  { number: 8, name: "Kawolu", period: "4 Februari – 1 Maret", startMonth: 2, startDay: 4, endMonth: 3, endDay: 1, days: 26, characteristics: "Hujan mulai mereda, padi mulai berisi, kucing kawin.", season: "Hujan", emoji: "🌾" },
  { number: 9, name: "Kasanga", period: "2 Maret – 26 Maret", startMonth: 3, startDay: 2, endMonth: 3, endDay: 26, days: 25, characteristics: "Padi menguning, jangkrik bersuara, garengpung muncul.", season: "Pancaroba", emoji: "🦗" },
  { number: 10, name: "Kasepuluh", period: "27 Maret – 19 April", startMonth: 3, startDay: 27, endMonth: 4, endDay: 19, days: 24, characteristics: "Musim panen padi, burung bersarang.", season: "Pancaroba", emoji: "🌾" },
  { number: 11, name: "Desta", period: "20 April – 12 Mei", startMonth: 4, startDay: 20, endMonth: 5, endDay: 12, days: 23, characteristics: "Awal kemarau, burung memberi makan anak.", season: "Kemarau", emoji: "🐦" },
  { number: 12, name: "Sada", period: "13 Mei – 21 Juni", startMonth: 5, startDay: 13, endMonth: 6, endDay: 21, days: 41, characteristics: "Udara dingin di malam hari, kemarau menjelang.", season: "Kemarau", emoji: "❄️" },
];

export function getCurrentMongso(date: Date = new Date()): Mongso {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const inRange = (mo: Mongso) => {
    const start = mo.startMonth * 100 + mo.startDay;
    const end = mo.endMonth * 100 + mo.endDay;
    const cur = m * 100 + d;
    if (start <= end) return cur >= start && cur <= end;
    return cur >= start || cur <= end; // wraps year
  };
  return MONGSO_LIST.find(inRange) ?? MONGSO_LIST[0];
}

// Mock realistic weather + IKM per Mongso
export type WeatherProfile = {
  rainfall: number; // mm/period
  temperature: number; // °C avg
  humidity: number; // %
  wind: number; // km/h
};

export const PREDICTED_WEATHER: Record<number, WeatherProfile> = {
  1: { rainfall: 30, temperature: 28, humidity: 70, wind: 12 },
  2: { rainfall: 15, temperature: 29, humidity: 65, wind: 14 },
  3: { rainfall: 10, temperature: 30, humidity: 60, wind: 16 },
  4: { rainfall: 80, temperature: 28, humidity: 75, wind: 12 },
  5: { rainfall: 180, temperature: 27, humidity: 82, wind: 18 },
  6: { rainfall: 320, temperature: 26, humidity: 86, wind: 14 },
  7: { rainfall: 380, temperature: 25, humidity: 88, wind: 12 },
  8: { rainfall: 220, temperature: 26, humidity: 84, wind: 11 },
  9: { rainfall: 150, temperature: 27, humidity: 80, wind: 12 },
  10: { rainfall: 90, temperature: 28, humidity: 76, wind: 13 },
  11: { rainfall: 50, temperature: 28, humidity: 72, wind: 14 },
  12: { rainfall: 35, temperature: 27, humidity: 68, wind: 13 },
};

export const ACTUAL_WEATHER: Record<number, WeatherProfile> = {
  1: { rainfall: 42, temperature: 28.5, humidity: 71, wind: 13 },
  2: { rainfall: 22, temperature: 29.4, humidity: 64, wind: 15 },
  3: { rainfall: 18, temperature: 30.2, humidity: 62, wind: 17 },
  4: { rainfall: 65, temperature: 28.7, humidity: 73, wind: 13 },
  5: { rainfall: 165, temperature: 27.3, humidity: 80, wind: 17 },
  6: { rainfall: 290, temperature: 26.5, humidity: 84, wind: 15 },
  7: { rainfall: 410, temperature: 25.2, humidity: 89, wind: 13 },
  8: { rainfall: 240, temperature: 26.4, humidity: 85, wind: 12 },
  9: { rainfall: 120, temperature: 27.5, humidity: 78, wind: 13 },
  10: { rainfall: 75, temperature: 28.4, humidity: 74, wind: 14 },
  11: { rainfall: 38, temperature: 28.8, humidity: 70, wind: 15 },
  12: { rainfall: 28, temperature: 27.6, humidity: 67, wind: 14 },
};

const score = (actual: number, predicted: number) => {
  const diff = Math.abs(actual - predicted);
  const ratio = diff / Math.max(predicted, 1);
  return Math.max(0, Math.min(100, 100 - ratio * 100));
};

export function calculateIKM(predicted: WeatherProfile, actual: WeatherProfile): number {
  const r = score(actual.rainfall, predicted.rainfall);
  const t = score(actual.temperature, predicted.temperature);
  const h = score(actual.humidity, predicted.humidity);
  const w = score(actual.wind, predicted.wind);
  return Math.round(0.4 * r + 0.3 * t + 0.2 * h + 0.1 * w);
}

export function getIKMCategory(score: number) {
  if (score >= 70) return { label: "Sangat Sesuai", color: "var(--leaf)", bg: "oklch(0.65 0.17 145 / 0.15)" };
  if (score >= 50) return { label: "Sesuai", color: "oklch(0.78 0.15 85)", bg: "oklch(0.78 0.15 85 / 0.15)" };
  if (score >= 30) return { label: "Kurang Sesuai", color: "oklch(0.7 0.18 50)", bg: "oklch(0.7 0.18 50 / 0.15)" };
  return { label: "Tidak Sesuai", color: "var(--alert)", bg: "oklch(0.65 0.22 30 / 0.15)" };
}

export const PROVINCES = [
  "DI Yogyakarta", "Jawa Tengah", "Jawa Timur", "Jawa Barat", "Banten",
  "DKI Jakarta", "Bali", "Lampung", "Sumatera Selatan", "Sumatera Utara",
  "Sulawesi Selatan", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
];
