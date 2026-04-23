export type WeatherProfile = {
  rainfall: number; // mm/period
  temperature: number; // °C avg
  humidity: number; // %
  wind: number; // km/jam
};

export type IdealMongso = {
  ch: number;
  suhu: number;
  lembab: number;
  angin: number;
};

export type ToleransiMongso = {
  ch: number;
  suhu: number;
  lembab: number;
  angin: number;
};

export type Mongso = {
  number: number;
  id: number;
  name: string;
  nama: string;
  period: string;
  periode: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  days: number;
  durasi: number;
  characteristics: string;
  karakteristik: string;
  season: "Kemarau" | "Pancaroba" | "Hujan";
  emoji: string;
  ideal: IdealMongso;
  toleransi: ToleransiMongso;
  tanaman: { rekomen: string[]; hindari: string[] };
  kimiaTanah: { ph: string; catatan: string };
};

const seasonFor = (id: number): Mongso["season"] => {
  if ([1, 2, 3, 11, 12].includes(id)) return "Kemarau";
  if ([6, 7, 8].includes(id)) return "Hujan";
  return "Pancaroba";
};

const emojiFor = (id: number) => ["", "🍂", "🌵", "🌾", "🌦️", "🌧️", "🌧️", "⛈️", "🦋", "🌬️", "🍉", "🐦", "☀️"][id] ?? "🌱";

const toMongso = (m: Omit<Mongso, "number" | "nama" | "period" | "days" | "characteristics" | "season" | "emoji"> & { name: string; periode: string; durasi: number; karakteristik: string }): Mongso => ({
  ...m,
  number: m.id,
  nama: m.name,
  period: m.periode,
  days: m.durasi,
  characteristics: m.karakteristik,
  season: seasonFor(m.id),
  emoji: emojiFor(m.id),
});

export const MONGSO_LIST: Mongso[] = [
  toMongso({ id: 1, name: "Kasa", periode: "22 Jun – 1 Agt", startMonth: 6, startDay: 22, endMonth: 8, endDay: 1, durasi: 41, ideal: { ch: 20, suhu: 32, lembab: 60, angin: 25 }, toleransi: { ch: 30, suhu: 3, lembab: 10, angin: 10 }, karakteristik: "Puncak kemarau, daun gugur, tanah kering", tanaman: { rekomen: ["Singkong", "Tembakau", "Tebu", "Jati"], hindari: ["Padi sawah", "Kangkung", "Bayam"] }, kimiaTanah: { ph: "5.5–6.0", catatan: "Tanah kering, hindari pupuk N cepat larut, prioritas pupuk K" } }),
  toMongso({ id: 2, name: "Karo", periode: "2 – 24 Agt", startMonth: 8, startDay: 2, endMonth: 8, endDay: 24, durasi: 23, ideal: { ch: 25, suhu: 31, lembab: 62, angin: 22 }, toleransi: { ch: 30, suhu: 3, lembab: 10, angin: 10 }, karakteristik: "Kemarau, angin mulai berhembus, belalang muncul", tanaman: { rekomen: ["Singkong", "Tembakau", "Wijen"], hindari: ["Padi", "Sayuran daun"] }, kimiaTanah: { ph: "5.5–6.0", catatan: "Kandungan air tanah sangat rendah, irigasi tambahan diperlukan" } }),
  toMongso({ id: 3, name: "Katelu", periode: "25 Agt – 17 Sep", startMonth: 8, startDay: 25, endMonth: 9, endDay: 17, durasi: 24, ideal: { ch: 40, suhu: 30, lembab: 65, angin: 18 }, toleransi: { ch: 50, suhu: 3, lembab: 12, angin: 10 }, karakteristik: "Peralihan kemarau–hujan, udara mulai lembab, ulat daun muncul", tanaman: { rekomen: ["Jagung", "Kacang tanah", "Singkong"], hindari: ["Padi sawah"] }, kimiaTanah: { ph: "5.8–6.2", catatan: "Mulai olah tanah, tambah bahan organik untuk persiapan musim tanam" } }),
  toMongso({ id: 4, name: "Kapat", periode: "18 Sep – 12 Okt", startMonth: 9, startDay: 18, endMonth: 10, endDay: 12, durasi: 25, ideal: { ch: 80, suhu: 28, lembab: 72, angin: 15 }, toleransi: { ch: 80, suhu: 3, lembab: 12, angin: 10 }, karakteristik: "Awal hujan, kodok mulai berbunyi, tanah mulai basah", tanaman: { rekomen: ["Padi gogo", "Jagung", "Kacang tanah", "Kedelai"], hindari: ["Tembakau"] }, kimiaTanah: { ph: "6.0–6.5", catatan: "Waktu ideal pemupukan dasar, pH mulai optimal untuk padi" } }),
  toMongso({ id: 5, name: "Kalima", periode: "13 Okt – 8 Nov", startMonth: 10, startDay: 13, endMonth: 11, endDay: 8, durasi: 27, ideal: { ch: 150, suhu: 27, lembab: 78, angin: 12 }, toleransi: { ch: 100, suhu: 4, lembab: 15, angin: 10 }, karakteristik: "Hujan rutin, burung migran datang, musim tanam utama padi", tanaman: { rekomen: ["Padi sawah", "Jagung", "Kacang tanah", "Cabai"], hindari: ["Tembakau", "Wijen"] }, kimiaTanah: { ph: "6.0–6.8", catatan: "Kondisi optimal untuk padi, pupuk urea dan TSP pada 2 MST" } }),
  toMongso({ id: 6, name: "Kanem", periode: "9 Nov – 21 Des", startMonth: 11, startDay: 9, endMonth: 12, endDay: 21, durasi: 43, ideal: { ch: 250, suhu: 26, lembab: 83, angin: 10 }, toleransi: { ch: 150, suhu: 4, lembab: 15, angin: 10 }, karakteristik: "Puncak hujan awal, banyak hama wereng, ikan di sungai banyak", tanaman: { rekomen: ["Padi sawah", "Kangkung", "Bayam"], hindari: ["Kedelai", "Kacang tanah", "Cabai"] }, kimiaTanah: { ph: "5.8–6.5", catatan: "Leaching tinggi, tambah KCl dan pupuk P, waspada penyakit blast" } }),
  toMongso({ id: 7, name: "Kapitu", periode: "22 Des – 3 Feb", startMonth: 12, startDay: 22, endMonth: 2, endDay: 3, durasi: 43, ideal: { ch: 300, suhu: 24, lembab: 85, angin: 15 }, toleransi: { ch: 150, suhu: 4, lembab: 15, angin: 10 }, karakteristik: "Puncak hujan, potensi banjir, petir sering, angin kencang", tanaman: { rekomen: ["Padi sawah (fase vegetatif)", "Kangkung air"], hindari: ["Semua tanaman kering", "Kedelai", "Jagung"] }, kimiaTanah: { ph: "5.5–6.2", catatan: "Leaching maksimal, pH turun, perlu pengapuran jika pH < 5.5" } }),
  toMongso({ id: 8, name: "Kawolu", periode: "4 Feb – 1 Mar", startMonth: 2, startDay: 4, endMonth: 3, endDay: 1, durasi: 26, ideal: { ch: 200, suhu: 25, lembab: 82, angin: 13 }, toleransi: { ch: 120, suhu: 4, lembab: 15, angin: 10 }, karakteristik: "Hujan berkurang, bunga bermekaran, banyak kupu-kupu", tanaman: { rekomen: ["Padi sawah (fase generatif)", "Palawija", "Sayuran"], hindari: ["Tanaman rentan banjir"] }, kimiaTanah: { ph: "6.0–6.8", catatan: "Kondisi mulai stabil, pupuk K untuk pengisian bulir padi" } }),
  toMongso({ id: 9, name: "Kasanga", periode: "2 – 26 Mar", startMonth: 3, startDay: 2, endMonth: 3, endDay: 26, durasi: 25, ideal: { ch: 120, suhu: 26, lembab: 78, angin: 20 }, toleransi: { ch: 80, suhu: 4, lembab: 12, angin: 12 }, karakteristik: "Angin kencang, musim bunga, banyak lebah, awal kemarau", tanaman: { rekomen: ["Jagung", "Kedelai", "Sayuran buah", "Semangka"], hindari: ["Padi sawah baru"] }, kimiaTanah: { ph: "6.0–6.8", catatan: "Kondisi ideal untuk palawija, pupuk NPK seimbang" } }),
  toMongso({ id: 10, name: "Kasepuluh", periode: "27 Mar – 19 Apr", startMonth: 3, startDay: 27, endMonth: 4, endDay: 19, durasi: 24, ideal: { ch: 70, suhu: 28, lembab: 72, angin: 18 }, toleransi: { ch: 60, suhu: 3, lembab: 12, angin: 10 }, karakteristik: "Panas meningkat, buah-buahan masak, musim panen", tanaman: { rekomen: ["Kedelai", "Kacang tanah", "Melon", "Semangka"], hindari: ["Padi sawah", "Sayuran daun"] }, kimiaTanah: { ph: "6.0–7.0", catatan: "pH optimal untuk kedelai, inokulasi Rhizobium dianjurkan" } }),
  toMongso({ id: 11, name: "Desta", periode: "20 Apr – 12 Mei", startMonth: 4, startDay: 20, endMonth: 5, endDay: 12, durasi: 23, ideal: { ch: 40, suhu: 30, lembab: 67, angin: 20 }, toleransi: { ch: 50, suhu: 3, lembab: 12, angin: 10 }, karakteristik: "Kemarau awal, banyak buah matang, burung pipit banyak", tanaman: { rekomen: ["Singkong", "Tembakau", "Kacang hijau"], hindari: ["Padi sawah", "Sayuran butuh air banyak"] }, kimiaTanah: { ph: "5.8–6.5", catatan: "Mulai kurangi frekuensi irigasi, perbanyak mulsa organik" } }),
  toMongso({ id: 12, name: "Sada", periode: "13 Mei – 21 Jun", startMonth: 5, startDay: 13, endMonth: 6, endDay: 21, durasi: 41, ideal: { ch: 25, suhu: 31, lembab: 63, angin: 24 }, toleransi: { ch: 30, suhu: 3, lembab: 10, angin: 10 }, karakteristik: "Kemarau panjang, angin panas, daun ilalang mengering", tanaman: { rekomen: ["Singkong", "Tebu", "Tembakau", "Jati"], hindari: ["Semua tanaman butuh air tinggi"] }, kimiaTanah: { ph: "5.5–6.0", catatan: "Stres air tinggi, fokus tanaman C4 toleran kering, mulsa wajib" } }),
];

export function getCurrentMongso(date: Date = new Date()): Mongso {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const cur = m * 100 + d;
  return MONGSO_LIST.find((mo) => {
    const start = mo.startMonth * 100 + mo.startDay;
    const end = mo.endMonth * 100 + mo.endDay;
    return start <= end ? cur >= start && cur <= end : cur >= start || cur <= end;
  }) ?? MONGSO_LIST[0];
}

export const DATABASE_MONGSO = MONGSO_LIST;

export const PREDICTED_WEATHER: Record<number, WeatherProfile> = Object.fromEntries(
  MONGSO_LIST.map((m) => [m.number, { rainfall: m.ideal.ch, temperature: m.ideal.suhu, humidity: m.ideal.lembab, wind: m.ideal.angin }]),
) as Record<number, WeatherProfile>;

export const ACTUAL_WEATHER: Record<number, WeatherProfile> = PREDICTED_WEATHER;

export type IKMDetails = {
  ikm: number;
  skorCH: number;
  skorSuhu: number;
  skorLembab: number;
  skorAngin: number;
};

export function hitungSkor(aktual: number, ideal: number, toleransi: number) {
  return Math.max(0, 100 - (Math.abs(aktual - ideal) / toleransi) * 100);
}

export function hitungIKM(dataBMKG: { curahHujan: number; suhu: number; kelembaban: number; angin: number }, idealMongso: { ideal: IdealMongso; toleransi: ToleransiMongso }): IKMDetails {
  const skorCH = hitungSkor(dataBMKG.curahHujan, idealMongso.ideal.ch, idealMongso.toleransi.ch);
  const skorSuhu = hitungSkor(dataBMKG.suhu, idealMongso.ideal.suhu, idealMongso.toleransi.suhu);
  const skorLembab = hitungSkor(dataBMKG.kelembaban, idealMongso.ideal.lembab, idealMongso.toleransi.lembab);
  const skorAngin = hitungSkor(dataBMKG.angin, idealMongso.ideal.angin, idealMongso.toleransi.angin);
  const ikm = (0.4 * skorCH) + (0.3 * skorSuhu) + (0.2 * skorLembab) + (0.1 * skorAngin);
  return { ikm, skorCH, skorSuhu, skorLembab, skorAngin };
}

export function calculateIKMDetails(predicted: WeatherProfile, actual: WeatherProfile, mongso?: Mongso): IKMDetails {
  const basis = mongso ?? MONGSO_LIST.find((m) => m.ideal.ch === predicted.rainfall) ?? MONGSO_LIST[0];
  const details = hitungIKM(
    { curahHujan: actual.rainfall, suhu: actual.temperature, kelembaban: actual.humidity, angin: actual.wind },
    basis,
  );
  return {
    ikm: Math.round(details.ikm),
    skorCH: Math.round(details.skorCH),
    skorSuhu: Math.round(details.skorSuhu),
    skorLembab: Math.round(details.skorLembab),
    skorAngin: Math.round(details.skorAngin),
  };
}

export function calculateIKM(predicted: WeatherProfile, actual: WeatherProfile, mongso?: Mongso): number {
  return calculateIKMDetails(predicted, actual, mongso).ikm;
}

export function getIKMCategory(score: number) {
  if (score >= 70) return { label: "Sangat Sesuai", color: "var(--leaf)", bg: "oklch(0.65 0.17 145 / 0.15)" };
  if (score >= 50) return { label: "Sesuai", color: "oklch(0.78 0.15 85)", bg: "oklch(0.78 0.15 85 / 0.15)" };
  if (score >= 30) return { label: "Kurang Sesuai", color: "oklch(0.7 0.18 50)", bg: "oklch(0.7 0.18 50 / 0.15)" };
  return { label: "Tidak Sesuai", color: "var(--alert)", bg: "oklch(0.65 0.22 30 / 0.15)" };
}

export const PROVINCES = ["Yogyakarta", "Klaten", "Sleman", "Bantul", "Surakarta", "Magelang", "Wonosari", "Wates"];
