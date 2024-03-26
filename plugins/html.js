import fs from "node:fs";
import { resolve } from "node:path";

export function htmlPlugin(PUBLIC_BASE_PATH) {
  return {
    name: "html-transform",
    enforce: "pre",
    transformIndexHtml: {
      order: "pre",
      handler(_, ctx) {
        const updates = [];
        updates.push({
          // <meta charset="UTF-8" />
          tag: "meta",
          injectTo: "head-prepend",
          attrs: {
            charset: "UTF-8",
          },
        });
        updates.push({
          // <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          tag: "meta",
          injectTo: "head-prepend",
          attrs: {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        });
        updates.push({
          // <link rel="icon" type="image/jpeg" href="/author.jpg" />
          tag: "link",
          injectTo: "head-prepend",
          attrs: {
            type: "image/jpeg",
            href: "/author.jpg",
          },
        });
        if (ctx.path !== "/index.html") {
          updates.push({
            tag: "link",
            injectTo: "head",
            attrs: {
              rel: "stylesheet",
              href: "./index.css",
            },
          });
          updates.push({
            tag: "script",
            injectTo: "head",
            attrs: {
              type: "module",
              src: "./index.ts",
            },
          });
        }

        updates.push({
          tag: "div",
          injectTo: "body-prepend",
          children: fs
            .readFileSync(resolve(__dirname, "../partials/header.html"))
            .toString()
            .replace("{{public_base_path}}", PUBLIC_BASE_PATH),
        });
        return updates;
      },
    },
  };
}
