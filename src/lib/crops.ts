export type Crop = {
  name: string;
  emoji: string;
  duration: string;
  water: "Rendah" | "Sedang" | "Tinggi";
  notes: string;
  mongso: number[];
};

export const CROPS: Crop[] = [
  { name: "Padi Sawah", emoji: "🌾", duration: "110–120 hari", water: "Tinggi", notes: "Cocok puncak musim hujan, butuh genangan air stabil.", mongso: [4, 5, 6, 7, 8] },
  { name: "Jagung", emoji: "🌽", duration: "90–110 hari", water: "Sedang", notes: "Tanam awal hujan, panen sebelum kemarau penuh.", mongso: [4, 5, 9, 10] },
  { name: "Kedelai", emoji: "🫘", duration: "75–90 hari", water: "Rendah", notes: "Tahan kering, baik untuk akhir musim hujan.", mongso: [9, 10, 11, 12] },
  { name: "Kacang Tanah", emoji: "🥜", duration: "90–100 hari", water: "Sedang", notes: "Tanah gembur berpasir, drainase baik.", mongso: [4, 5, 9, 10] },
  { name: "Singkong", emoji: "🍠", duration: "8–12 bulan", water: "Rendah", notes: "Sangat tahan kering, cocok lahan marjinal.", mongso: [10, 11, 12, 1] },
  { name: "Ubi Jalar", emoji: "🍠", duration: "4–5 bulan", water: "Sedang", notes: "Toleran berbagai kondisi tanah.", mongso: [3, 4, 9, 10] },
  { name: "Cabai", emoji: "🌶️", duration: "90–120 hari", water: "Sedang", notes: "Hindari hujan deras saat berbunga.", mongso: [9, 10, 11] },
  { name: "Tomat", emoji: "🍅", duration: "70–90 hari", water: "Sedang", notes: "Butuh sinar matahari cukup, drainase baik.", mongso: [9, 10, 11] },
  { name: "Bawang Merah", emoji: "🧅", duration: "55–70 hari", water: "Rendah", notes: "Cocok musim kemarau, hindari hujan berlebih.", mongso: [1, 2, 11, 12] },
  { name: "Kacang Hijau", emoji: "🟢", duration: "55–65 hari", water: "Rendah", notes: "Cepat panen, baik untuk pergiliran tanam.", mongso: [9, 10, 11] },
];

export function getCropsForMongso(mongsoNum: number) {
  const recommended = CROPS.filter((c) => c.mongso.includes(mongsoNum));
  const avoid = CROPS.filter((c) => !c.mongso.includes(mongsoNum) && c.water === "Tinggi" && [1, 2, 3].includes(mongsoNum));
  return { recommended, avoid };
}

export const SOIL_NOTES: Record<number, { ph: string; nutrients: string }> = {
  1: { ph: "6.0–7.0", nutrients: "Tambah pupuk kandang, tanah cenderung kering — perbanyak bahan organik." },
  2: { ph: "6.0–7.0", nutrients: "Mulsa jerami untuk menahan kelembapan tanah." },
  3: { ph: "6.5–7.0", nutrients: "Aplikasi NPK rendah, fokus pemulihan struktur tanah." },
  4: { ph: "5.5–6.5", nutrients: "Pupuk dasar SP-36 + KCl, siap menyongsong hujan." },
  5: { ph: "5.5–6.5", nutrients: "Urea bertahap, awasi pencucian hara." },
  6: { ph: "5.5–6.5", nutrients: "Kapur dolomit jika pH < 5.5, hara N tinggi." },
  7: { ph: "5.5–6.5", nutrients: "Drainase ekstra penting, hindari pupuk N berlebih." },
  8: { ph: "6.0–6.5", nutrients: "Pupuk K untuk pengisian bulir padi." },
  9: { ph: "6.0–6.8", nutrients: "Pupuk PK untuk pematangan, kurangi N." },
  10: { ph: "6.0–7.0", nutrients: "Pasca panen — kembalikan jerami ke sawah." },
  11: { ph: "6.0–7.0", nutrients: "Pupuk organik untuk persiapan kemarau." },
  12: { ph: "6.0–7.0", nutrients: "Olah tanah ringan, siapkan irigasi tetes." },
};
