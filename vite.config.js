import fs from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { htmlPlugin } from "./plugins/html";

const PUBLIC_BASE_PATH = "/ui-challenges-vanilla/";

export default defineConfig({
  base: PUBLIC_BASE_PATH,
  root: "./src", // Setting the root to be src
  publicDir: "../public",
  plugins: [htmlPlugin(PUBLIC_BASE_PATH)],
  build: {
    outDir: "../dist", // Relative to project root
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        ...getSubApps(),
      },
    },
  },
});

function getSubApps() {
  const supApps = fs
    .readdirSync(resolve(__dirname, "src"))
    .map(fileOrFolderName => [
      fileOrFolderName,
      resolve(__dirname, `src/${fileOrFolderName}/index.html`),
    ])
    .filter(([k, v]) => fs.existsSync(v));
  return Object.fromEntries(supApps);
}
