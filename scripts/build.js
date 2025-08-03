/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import * as esbuild from "esbuild";
import { resolve } from "path";

const isDev = process.env.NODE_ENV !== "production";

// Build configuration
const buildConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  target: "es2022",
  outfile: "build/kicanvas.js",
  sourcemap: isDev,
  minify: !isDev,
  // Only externalize React in production
  external: isDev ? [] : ["react", "react-dom"],
  loader: {
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
    ".css": "css",
    ".glsl": "text",
    ".svg": "text",
    ".kicad_wks": "text",
    ".kicad_pcb": "text",
    ".kicad_sch": "text",
    ".kicad_pro": "text",
  },
  define: {
    DEBUG: isDev ? "true" : "false",
  },
  plugins: [
    // Custom plugin to handle CSS imports
    {
      name: "css-handler",
      setup(build) {
        build.onLoad({ filter: /\.css$/ }, async (args) => {
          const fs = await import("fs");
          const css = fs.readFileSync(args.path, "utf8");

          return {
            contents: `
                            const style = document.createElement('style');
                            style.textContent = ${JSON.stringify(css)};
                            document.head.appendChild(style);
                        `,
            loader: "js",
          };
        });
      },
    },
  ],
};

// Development build configuration (without watch)
const devBuildConfig = {
  ...buildConfig,
  outfile: "debug/kicanvas/kicanvas.js",
  sourcemap: true,
  minify: false,
};

async function build() {
  try {
    const config = isDev ? devBuildConfig : buildConfig;
    console.log(`Building in ${isDev ? "development" : "production"} mode...`);

    await esbuild.build(config);

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

// Run build
build();
