import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths"; // Tambahkan ini

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Letakkan di atas tanstackStart
    tanstackStart(),
  ],
});
