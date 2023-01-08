import react from "@vitejs/plugin-react";
import path from "path";
import AutoImports from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    ...defaultConfig,
    server: {
      proxy: {
        "/api": {
          target: isDev ? "http://127.0.0.1:8080" : "http://api.plhh.xyz",
          changeOrigin: isDev,
          secure: !isDev,
          // rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
      port: PROT,
    },
  };
});
