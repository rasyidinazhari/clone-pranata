// vite.config.ts
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite"; // Pastikan ini ada

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro({
      preset: "vercel", // Paksa preset ke vercel
    }),
  ],
});
