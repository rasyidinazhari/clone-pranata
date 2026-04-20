import { useEffect, useState } from "react";

const KEY = "pranatacalc.cityId";
const DEFAULT_ID = "yogyakarta";

const listeners = new Set<(id: string) => void>();

export function getCityId(): string {
  if (typeof window === "undefined") return DEFAULT_ID;
  return localStorage.getItem(KEY) ?? DEFAULT_ID;
}

export function setCityId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, id);
  listeners.forEach((l) => l(id));
}

export function useCityId(): [string, (id: string) => void] {
  const [id, setId] = useState<string>(DEFAULT_ID);
  useEffect(() => {
    setId(getCityId());
    const cb = (newId: string) => setId(newId);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return [id, setCityId];
}
