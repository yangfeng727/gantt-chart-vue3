import { fileURLToPath, URL } from "node:url";
import path from 'node:path'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "../dist", //输出文件名称
    lib: {
      entry: path.resolve(__dirname, "../packages/index.js"), //指定组件编译入口文件
      name: "gantt-chart-vue3", // 暴露的全局变量
      fileName: "gantt-chart-vue3", // fileName 是输出的包文件名，默认 fileName 是 package.json 的 name 选项
    }, //库编译模式配置
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "vue", 
        "element-plus"
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
        globals: {
          elementPlus: "elementPlus",
        },
      },
    }, // rollup打包配置
  },
});
