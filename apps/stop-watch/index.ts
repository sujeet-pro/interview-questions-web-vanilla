/**
 *   Auto Generated, DO NOT UPDATE
 */

import "./index.css";
import "./app.css";
import "@/shared/theme-controller";
import { init } from "./app";


// Start App
const rootElem = document.querySelector<HTMLDivElement>("#root");

if (!rootElem) {
  throw new Error("App element not found");
}

init(rootElem);
