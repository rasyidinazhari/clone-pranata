// Curated cities → BMKG kelurahan-level codes (adm4)
// Codes verified against BMKG wilayah dataset.
export type City = {
  id: string;
  name: string;
  province: string;
  adm4: string; // BMKG kelurahan code
};

export const CITIES: City[] = [
  { id: "yogyakarta", name: "Yogyakarta (Kotabaru)", province: "DI Yogyakarta", adm4: "34.71.03.1002" },
  { id: "sleman", name: "Sleman (Caturtunggal)", province: "DI Yogyakarta", adm4: "34.04.07.2001" },
  { id: "bantul", name: "Bantul", province: "DI Yogyakarta", adm4: "34.02.08.2003" },
  { id: "semarang", name: "Semarang (Pekunden)", province: "Jawa Tengah", adm4: "33.74.01.1013" },
  { id: "solo", name: "Surakarta (Kemlayan)", province: "Jawa Tengah", adm4: "33.72.02.1007" },
  { id: "magelang", name: "Magelang", province: "Jawa Tengah", adm4: "33.71.03.1004" },
  { id: "surabaya", name: "Surabaya (Genteng)", province: "Jawa Timur", adm4: "35.78.07.1002" },
  { id: "malang", name: "Malang (Klojen)", province: "Jawa Timur", adm4: "35.73.02.1001" },
  { id: "kediri", name: "Kediri (Pocanan)", province: "Jawa Timur", adm4: "35.71.02.1016" },
  { id: "bandung", name: "Bandung (Braga)", province: "Jawa Barat", adm4: "32.73.19.1001" },
  { id: "bogor", name: "Bogor (Pabaton)", province: "Jawa Barat", adm4: "32.71.03.1003" },
  { id: "bekasi", name: "Bekasi (Bekasijaya)", province: "Jawa Barat", adm4: "32.75.01.1001" },
  { id: "jakarta", name: "Jakarta (Gambir)", province: "DKI Jakarta", adm4: "31.71.01.1001" },
  { id: "tangerang", name: "Tangerang (Sukasari)", province: "Banten", adm4: "36.71.01.1007" },
  { id: "serang", name: "Serang", province: "Banten", adm4: "36.73.01.1001" },
  { id: "denpasar", name: "Denpasar (Dauh Puri)", province: "Bali", adm4: "51.71.03.2003" },
  { id: "lampung", name: "Bandar Lampung (Enggal)", province: "Lampung", adm4: "18.71.17.1001" },
  { id: "palembang", name: "Palembang (Bukit Lama)", province: "Sumatera Selatan", adm4: "16.71.04.1001" },
  { id: "medan", name: "Medan (Mesjid)", province: "Sumatera Utara", adm4: "12.71.01.1004" },
  { id: "makassar", name: "Makassar (Maricaya)", province: "Sulawesi Selatan", adm4: "73.71.02.1005" },
  { id: "mataram", name: "Mataram", province: "Nusa Tenggara Barat", adm4: "52.71.02.1002" },
  { id: "kupang", name: "Kupang (Oebobo)", province: "Nusa Tenggara Timur", adm4: "53.71.04.1001" },
];

export const DEFAULT_CITY = CITIES[0];

export function findCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY;
}
