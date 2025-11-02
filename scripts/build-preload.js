#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const esbuild = require("esbuild");

const rootDir = path.resolve(__dirname, "..");
const srcEntry = path.join(rootDir, "src", "preload", "index.ts");
const outFile = path.join(rootDir, "src", "preload", "preload.dist.js");

const args = new Set(process.argv.slice(2));
const watch = args.has("--watch");
const isProd = args.has("--prod") || process.env.NODE_ENV === "production";

const build = async () => {
  await esbuild.build({
    entryPoints: [srcEntry],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs",
    outfile: outFile,
    sourcemap: !isProd,
    minify: isProd,
    define: {
      "process.env.NODE_ENV": JSON.stringify(isProd ? "production" : "development")
    },
    external: ["electron"],
    logLevel: "info"
  });
};

const ensureOutputDir = () => {
  const dir = path.dirname(outFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureOutputDir();

if (watch) {
  esbuild
    .context({
      entryPoints: [srcEntry],
      bundle: true,
      platform: "node",
      target: "node20",
      format: "cjs",
      outfile: outFile,
      sourcemap: true,
      define: {
        "process.env.NODE_ENV": JSON.stringify("development")
      },
      external: ["electron"],
      logLevel: "info"
    })
    .then((ctx) => ctx.watch())
    .catch((error) => {
      console.error("[preload] watch failed", error);
      process.exit(1);
    });
} else {
  build().catch((error) => {
    console.error("[preload] build failed", error);
    process.exit(1);
  });
}
