// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// To deploy to Vercel instead of Cloudflare Workers, uncomment the block below.
// See DEPLOY_VERCEL.md for the full guide.
//
// export default defineConfig({
//   tanstackStart: {
//     target: "vercel",
//   },
// });

export default defineConfig();
