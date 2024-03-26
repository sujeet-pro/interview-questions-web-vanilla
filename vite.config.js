// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import fs from "node:fs";

const ignoredFolders = new Set(["dist", "node_modules", "public"]);
const files = fs.readdirSync(__dirname);
const folders = files.filter(
  (file) => fs.statSync(file).isDirectory() && !ignoredFolders.has(file)
);

console.log(`folder: ${folders.join(",")}`);
const inputs = folders
  .map((folderName) => [
    folderName,
    resolve(__dirname, `${folderName}/index.html`),
  ])
  .filter(([k, v]) => fs.existsSync(v));

console.log(inputs.map(([k, v]) => v).join(" - "));
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...Object.fromEntries(inputs),
      },
    },
  },
});
