/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import * as esbuild from "esbuild";
import { exit } from "process";

const PORT = 8001;
const HOST = "localhost";

// Development server configuration
const devConfig = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "esm",
    target: "es2022",
    outfile: "debug/kicanvas/kicanvas.js",
    sourcemap: true,
    minify: false,
    // Don't externalize React for development - bundle it
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
        DEBUG: "true",
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

async function startDevServer() {
    try {
        console.log("Starting development server...");
        console.log("Serving files from: debug/");
        console.log("Available demo pages:");
        console.log("  - http://localhost:8001/ (main KiCanvas app)");
        console.log("  - http://localhost:8001/board.html (PCB viewer)");
        console.log(
            "  - http://localhost:8001/schematic.html (schematic viewer)",
        );
        console.log(
            "  - http://localhost:8001/embedded.html (embedded example)",
        );

        const context = await esbuild.context(devConfig);

        // Start the development server
        const { host, port } = await context.serve({
            servedir: "debug",
            host: HOST,
            port: PORT,
        });

        console.log(
            `\n🚀 Development server running at http://${host}:${port}`,
        );
        console.log("📁 Serving static files from: debug/");
        console.log("🔄 Hot reload enabled - changes will auto-refresh");
        console.log("⏹️  Press Ctrl+C to stop the server\n");

        // Enable watch mode
        await context.watch();
    } catch (error) {
        console.error("Failed to start development server:", error);
        exit(1);
    }
}

// Start the development server
startDevServer();
