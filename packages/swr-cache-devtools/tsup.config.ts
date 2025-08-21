import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "swr"],
  minify: false, // Disable minify to preserve "use client"
  treeshake: false, // Disable treeshake to preserve "use client"
  target: "es2018",
  outDir: "dist",
});
