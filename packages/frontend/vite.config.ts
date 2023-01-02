import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import AutoImports from "unplugin-auto-import/vite";
import { dirResolver, DirResolverHelper } from "vite-auto-import-resolvers";

export default defineConfig({
  server: {
    port: 9001,
  },
  preview: {
    port: 9001,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    DirResolverHelper(),
    AutoImports({
      include: [/\.*.$/],
      imports: [
        "react",
        "react-router-dom",
        {
          axios: [["default", "Axios"]],
        },
      ],
      resolvers: [
        dirResolver({
          target: "src/views",
        }),
        dirResolver({
          target: "src/interfaces",
        }),
        dirResolver({
          target: "src/hooks",
        }),
        dirResolver({
          target: "src/components",
        }),
      ],
    }),
  ],
});
