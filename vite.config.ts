/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getHtmlInputs(srcPath: string) {
  const entries = readdirSync(srcPath, { withFileTypes: true });
  const inputs: Record<string, string> = {};

  // Check for all the child folders and add index.html if exists
  for (const entry of entries) {
    const fullPath = resolve(srcPath, entry.name);
    if (entry.isDirectory()) {
      const indexPath = resolve(fullPath, "index.html");
      if (statSync(indexPath, { throwIfNoEntry: false })?.isFile()) {
        inputs[entry.name] = indexPath;
      }
    }
  }
  return inputs;
}

const htmlInputs = getHtmlInputs(resolve(__dirname, "apps"));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [tsconfigPaths(), tailwindcss()],
    base: env.VITE_SITE_BASE,
    appType: 'mpa',
    build: {
      outDir: "dist",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          ...htmlInputs,
        },
      },
    },
    test: {
      environment: "jsdom",
    },
  };
});
