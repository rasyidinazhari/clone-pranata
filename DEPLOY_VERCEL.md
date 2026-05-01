# Deploy ke Vercel

Project ini adalah **TanStack Start** (full-stack React dengan SSR). Default-nya di-build untuk Cloudflare Workers (lihat `wrangler.jsonc`). Untuk deploy ke Vercel, ikuti langkah berikut.

> ⚠️ **Rekomendasi**: Cara paling mudah & gratis adalah pakai tombol **Publish** di Lovable (sudah teroptimasi untuk TanStack Start, custom domain didukung). Vercel butuh konfigurasi tambahan di bawah.

---

## Penyebab error `404: NOT_FOUND` di Vercel

Vercel default-nya treat repo ini sebagai static site (Vite SPA), padahal TanStack Start butuh:
1. **Server runtime** untuk SSR (render HTML di server pada setiap request).
2. **Catch-all routing** agar semua URL diteruskan ke handler SSR (bukan dicari sebagai file statis).

Tanpa konfigurasi, Vercel hanya melayani `index.html` build statis → semua route lain → **404**.

---

## Langkah 1 — Tambah preset Vercel di `vite.config.ts`

Override target Lovable preset (default: `cloudflare-module`) ke `vercel`:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    target: "vercel",
  },
});
```

Setelah build (`vite build`), output akan masuk ke folder `.vercel/output/` dengan format Vercel Build Output API v3 — siap di-deploy.

---

## Langkah 2 — Tambah `vercel.json` di root project

```json
{
  "buildCommand": "vite build",
  "framework": null,
  "outputDirectory": ".vercel/output"
}
```

`framework: null` mencegah Vercel auto-detect sebagai Vite SPA. `outputDirectory` mengarahkan ke build output TanStack Start.

---

## Langkah 3 — Set Environment Variables di Vercel

Di **Vercel Dashboard → Project → Settings → Environment Variables**, tambahkan semua variable yang dipakai project (Lovable Cloud / Supabase / dll):

| Variable | Keterangan |
|---|---|
| `VITE_SUPABASE_URL` | URL Lovable Cloud (jika dipakai) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public key |
| `SUPABASE_SERVICE_ROLE_KEY` | (opsional, server-only) |

> Variable berawalan `VITE_` di-bundle ke client. Tanpa prefix = server-only.

---

## Langkah 4 — Push ke GitHub & Connect ke Vercel

1. Pastikan perubahan di atas (`vite.config.ts` + `vercel.json`) sudah ter-commit ke GitHub.
2. Di Vercel: **Add New Project → Import Git Repository → pilih repo**.
3. Vercel akan auto-detect `vercel.json`, tidak perlu ubah build settings.
4. Klik **Deploy**.

---

## Troubleshooting

- **Masih 404 setelah konfigurasi**: pastikan `outputDirectory` di `vercel.json` cocok dengan output `vite build` (cek isi folder `.vercel/output/` lokal setelah build).
- **Build gagal "Cannot find preset 'vercel'"**: update `@tanstack/react-start` ke versi terbaru (`bun add @tanstack/react-start@latest`).
- **Function timeout / 500**: cek **Vercel → Project → Logs** untuk error runtime dari server function.
- **Lovable Cloud (Supabase) tidak connect**: pastikan env vars `VITE_SUPABASE_*` sudah di-set di Vercel dan **redeploy** setelah menambah env.

---

## Alternatif: tetap pakai Cloudflare Workers

Jika tidak butuh Vercel spesifik, hapus perubahan di atas dan deploy via Wrangler CLI:

```bash
bun run build
bunx wrangler deploy
```

Konfigurasi Cloudflare sudah ada di `wrangler.jsonc`.
