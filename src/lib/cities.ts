// Curated cities → BMKG kelurahan-level codes (adm4)
// Codes verified against BMKG wilayah dataset.
export type City = {
  id: string;
  name: string;
  province: string;
  adm4: string; // BMKG kelurahan code
};

export const CITIES: City[] = [
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta", adm4: "34.71.11.1003" },
  { id: "sleman", name: "Sleman", province: "DI Yogyakarta", adm4: "34.04.05.2007" },
  { id: "bantul", name: "Bantul", province: "DI Yogyakarta", adm4: "34.02.01.2002" },
  { id: "semarang", name: "Semarang", province: "Jawa Tengah", adm4: "33.74.01.1002" },
  { id: "solo", name: "Surakarta (Solo)", province: "Jawa Tengah", adm4: "33.72.01.1001" },
  { id: "magelang", name: "Magelang", province: "Jawa Tengah", adm4: "33.71.01.1001" },
  { id: "surabaya", name: "Surabaya", province: "Jawa Timur", adm4: "35.78.22.1001" },
  { id: "malang", name: "Malang", province: "Jawa Timur", adm4: "35.73.01.1001" },
  { id: "kediri", name: "Kediri", province: "Jawa Timur", adm4: "35.71.01.1001" },
  { id: "bandung", name: "Bandung", province: "Jawa Barat", adm4: "32.73.08.1003" },
  { id: "bogor", name: "Bogor", province: "Jawa Barat", adm4: "32.71.01.1001" },
  { id: "bekasi", name: "Bekasi", province: "Jawa Barat", adm4: "32.75.01.1001" },
  { id: "jakarta", name: "Jakarta Pusat", province: "DKI Jakarta", adm4: "31.71.01.1001" },
  { id: "tangerang", name: "Tangerang", province: "Banten", adm4: "36.71.01.1001" },
  { id: "serang", name: "Serang", province: "Banten", adm4: "36.73.01.1001" },
  { id: "denpasar", name: "Denpasar", province: "Bali", adm4: "51.71.01.1001" },
  { id: "lampung", name: "Bandar Lampung", province: "Lampung", adm4: "18.71.01.1001" },
  { id: "palembang", name: "Palembang", province: "Sumatera Selatan", adm4: "16.71.01.1001" },
  { id: "medan", name: "Medan", province: "Sumatera Utara", adm4: "12.71.01.1001" },
  { id: "makassar", name: "Makassar", province: "Sulawesi Selatan", adm4: "73.71.01.1001" },
  { id: "mataram", name: "Mataram", province: "Nusa Tenggara Barat", adm4: "52.71.01.1001" },
  { id: "kupang", name: "Kupang", province: "Nusa Tenggara Timur", adm4: "53.71.01.1001" },
];

export const DEFAULT_CITY = CITIES[0];

export function findCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY;
}
