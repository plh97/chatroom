import react from "@vitejs/plugin-react";
import path from "path";
import AutoImports from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

const PROT = Number(process.env.PORT ?? 9001);
const defaultConfig = {
  preview: {
    port: PROT,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    viteCompression(),
    VitePWA(),
    react(),
    AutoImports({
      include: [/\.*.$/],
      imports: [
        "react",
        "react-router-dom",
        {
          "@chakra-ui/react": [
            "createStandaloneToast",
            "extendTheme",
            "ChakraProvider",
            "Spinner",
            "Textarea",
            "Avatar",
            "Button",
            "FormControl",
            "FormLabel",
            "Input",
            "Stack",
            "useToast",
          ],
        },
        {
          axios: [["default", "Axios"]],
        },
      ],
      dirs: [
        "./src/views",
        "./src/interfaces",
        "./src/hooks",
        "./src/components",
      ],
      eslintrc: {
        enabled: true,
      },
    }),
  ],
};

export default defineConfig({
  ...defaultConfig,
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/socket.io": {
        target: "ws://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
      },
    },
    port: PROT,
  },
});
