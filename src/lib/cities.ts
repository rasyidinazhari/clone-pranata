export type City = {
  id: string;
  name: string;
  province: string;
  adm4: string;
};

export const CITIES: City[] = [
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta", adm4: "34.71.03.1002" },
  { id: "klaten", name: "Klaten", province: "Jawa Tengah", adm4: "33.10.12.2008" },
  { id: "sleman", name: "Sleman", province: "DI Yogyakarta", adm4: "34.04.07.2001" },
  { id: "bantul", name: "Bantul", province: "DI Yogyakarta", adm4: "34.02.08.2003" },
  { id: "surakarta", name: "Surakarta", province: "Jawa Tengah", adm4: "33.72.02.1007" },
  { id: "magelang", name: "Magelang", province: "Jawa Tengah", adm4: "33.71.03.1004" },
  { id: "wonosari", name: "Wonosari", province: "DI Yogyakarta", adm4: "34.03.05.1001" },
  { id: "wates", name: "Wates", province: "DI Yogyakarta", adm4: "34.01.11.1001" },
];

export const DEFAULT_CITY = CITIES[0];

export function findCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY;
}
