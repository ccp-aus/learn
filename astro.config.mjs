// Astro validates this object via Zod at startup — TS checks add noise here without value.
import { readFileSync } from "node:fs";
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import remarkSmartypants from "remark-smartypants";

import { remarkGlossaryAutolink } from "./src/lib/remark-glossary.mjs";
import { remarkMermaidPre } from "./src/lib/remark-mermaid-pre.mjs";
import { viteLessonImports } from "./src/lib/vite-lesson-imports.mjs";

// Single source of truth: public/CNAME — the file GitHub Pages reads to bind
// the custom domain. Forks just edit CNAME and the build follows. No `base`
// is set anywhere; the site is served at the root of whatever domain CNAME
// declares.
const SITE_URL = `https://${readFileSync("./public/CNAME", "utf8").trim()}`;

export default defineConfig({
  site: SITE_URL,
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Geist",
      cssVariable: "--font-geist",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
    },
  ],
  // Default ("ignore") — needed so JSON endpoints like /quizzes/foo.json work
  // in both dev and the static build. With "always", the dev server requires
  // /foo.json/ but the built file lives at /foo.json (no directory).
  trailingSlash: "ignore",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  vite: {
    // viteLessonImports MUST run before @astrojs/mdx's transform — `enforce: "pre"` does that.
    plugins: [viteLessonImports(), tailwindcss()],
    // Belt-and-braces React dedup. @astrojs/react adds dedupe for "react" and
    // "react-dom" at the package level, but newer Radix sub-packages can pull
    // jsx-runtime through paths that bypass that dedup and end up with two
    // React instances at hydration time (manifests as "Invalid hook call").
    resolve: {
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    // Vite dev's lazy-loading races the module graph for any island that
    // pulls heavy deps. The visible failure modes are
    //   - mermaid: "Syntax error in text" on flowcharts (lazy diagram chunks)
    //   - Checkpoint / Quiz: stuck on "Loading quiz…" (failed dynamic import
    //     of the React island module itself)
    // Forcing Vite to pre-bundle these resolves both. Production builds bundle
    // all of this anyway; this only matters for the dev preview.
    optimizeDeps: {
      include: [
        "mermaid",
        "mermaid/dist/mermaid.core.mjs",
        "motion/react",
        "lucide-react",
      ],
    },
    build: {
      rollupOptions: {
        // Pagefind generates /pagefind/pagefind.js at postbuild (not build time).
        // Mark as external so Rollup doesn't try to resolve the dynamic import.
        external: [/^\/pagefind\//],
      },
    },
  },
  integrations: [
    react(),
    mdx({
      remarkPlugins: [
        remarkSmartypants,
        remarkGlossaryAutolink,
        remarkMermaidPre,
      ],
    }),
    sitemap(),
    pagefind(),
  ],
  markdown: {
    remarkPlugins: [
      remarkSmartypants,
      remarkGlossaryAutolink,
      remarkMermaidPre,
    ],
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark-default",
      },
      wrap: true,
    },
  },
});
