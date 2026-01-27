import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 库构建模式（用于发布到 npm）
  if (mode === "lib") {
    return {
      plugins: [vue(), cssInjectedByJsPlugin()],
      build: {
        lib: {
          entry: resolve(__dirname, "./lib/index.ts"),
          name: "vue3-signature",
        },
        rollupOptions: {
          external: ["vue"],
          output: {
            globals: {
              vue: "vue",
            },
          },
        },
      },
    };
  }

  // 演示应用模式（用于 GitHub Pages）
  return {
    plugins: [vue()],
    base: process.env.NODE_ENV === "production" ? "/vue3-signature/" : "/",
    build: {
      outDir: "docs", // GitHub Pages 可以使用 docs 文件夹
      emptyOutDir: true,
    },
  };
});
