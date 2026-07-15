// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
// Resolve the package's own package.json, then locate the fake-entries file relative to it.
// This works regardless of node_modules layout (hoisted, nested, pnpm, Netlify, etc.).
const startClientCoreDir = path.dirname(
  require.resolve("@tanstack/start-client-core/package.json"),
);
const pluginAdaptersPath = path.join(
  startClientCoreDir,
  "dist/esm/empty-plugin-adapters.js",
);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Force Netlify preset. Nitro auto-detects on Netlify CI, but pinning
  // this makes local `bun run build` produce the same output layout.
  nitro: { preset: "netlify" },
  vite: {
    resolve: {
      alias: {
        "#tanstack-start-plugin-adapters": pluginAdaptersPath,
      },
    },
  },
});
