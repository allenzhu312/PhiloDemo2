import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键：告诉 Vite 你的站点部署在 /PhiloDemo2/ 子路径下
  base: "/PhiloDemo2/",
  // 关键：build 输出到 docs 文件夹，给 GitHub Pages 用
  build: {
    outDir: "docs",
  },
});