import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
// import tailwind from "vite-plugin-tailwind";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
});
