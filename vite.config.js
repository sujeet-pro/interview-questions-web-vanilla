// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import fs from "node:fs";

const inputs = fs
  .readdirSync(resolve(__dirname, "src"))
  .map((fileOrFolderName) => [
    fileOrFolderName,
    resolve(__dirname, `src/${fileOrFolderName}/index.html`),
  ])
  .filter(([k, v]) => fs.existsSync(v));

export default defineConfig({
  base: "/ui-challenges-vanilla/",
  root: "./src", // Setting the root to be src

  build: {
    outDir: "../dist", // Relative to project root
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        ...Object.fromEntries(inputs),
      },
    },
  },
});
