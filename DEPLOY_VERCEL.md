# Deploy ke Vercel

Project ini adalah **TanStack Start** (full-stack React dengan SSR). Untuk deploy ke Vercel, gunakan integrasi **Nitro** sesuai dokumentasi Vercel untuk TanStack Start.

> ⚠️ **Rekomendasi**: Cara paling mudah & gratis adalah pakai tombol **Publish** di Lovable (sudah teroptimasi untuk TanStack Start, custom domain didukung). Vercel butuh konfigurasi tambahan di bawah.

---

## Penyebab error `404: NOT_FOUND` di Vercel

Vercel default-nya treat repo ini sebagai static site (Vite SPA), padahal TanStack Start butuh:
1. **Server runtime** untuk SSR (render HTML di server pada setiap request).
2. **Catch-all routing** agar semua URL diteruskan ke handler SSR (bukan dicari sebagai file statis).

Tanpa konfigurasi, Vercel hanya melayani `index.html` build statis → semua route lain → **404**.

---

## Langkah 1 — Gunakan `tanstackStart()` + `nitro()` di `vite.config.ts`

Vercel saat ini merekomendasikan TanStack Start dipasangkan dengan Nitro:

```ts
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackStart(), nitro(), react()],
});
```

Jangan andalkan `.output/`. Pada setup ini, Vercel akan memakai output Nitro/TanStack yang cocok untuk SSR.

---

## Langkah 2 — Install dependency Nitro

```bash
npm install
```

Pastikan package `nitro` ikut ter-install dari `package.json`.

---

## Langkah 3 — Set Build Settings di Vercel

- Build Command: `npm run build`
- Install Command: `npm install`
- Framework Preset: `Other`

Jangan isi Output Directory ke `.output`. Jangan pakai `.vercel/output` kecuali build lokal benar-benar menghasilkan folder itu.

---

## Langkah 4 — Set Environment Variables di Vercel

Di **Vercel Dashboard → Project → Settings → Environment Variables**, tambahkan semua variable yang dipakai project (Lovable Cloud / Supabase / dll):

| Variable | Keterangan |
|---|---|
| `VITE_SUPABASE_URL` | URL Lovable Cloud (jika dipakai) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public key |
| `SUPABASE_SERVICE_ROLE_KEY` | (opsional, server-only) |

> Variable berawalan `VITE_` di-bundle ke client. Tanpa prefix = server-only.

---

## Langkah 5 — Push ke GitHub & Connect ke Vercel

1. Pastikan perubahan di atas sudah ter-commit ke GitHub.
2. Di Vercel: **Add New Project → Import Git Repository → pilih repo**.
3. Klik **Deploy**.

---

## Troubleshooting

- **Masih 404 setelah deploy**: biasanya berarti Vercel masih memperlakukan hasil build sebagai static site, bukan SSR function. Pastikan `nitro` sudah ter-install dan `vite.config.ts` benar-benar memakai `nitro()`.
- **Build gagal karena `nitro` tidak ditemukan**: jalankan install dependency lagi lalu redeploy.
- **Function timeout / 500**: cek **Vercel → Project → Logs** untuk error runtime dari server function.
- **Lovable Cloud (Supabase) tidak connect**: pastikan env vars `VITE_SUPABASE_*` sudah di-set di Vercel dan **redeploy** setelah menambah env.
