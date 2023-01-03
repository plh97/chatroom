import react from "@vitejs/plugin-react";
import path from "path";
import AutoImports from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

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
    // DirResolverHelper(),
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
      // resolvers: [
      //   dirResolver({
      //     target: "src/views",
      //   }),
      //   dirResolver({
      //     target: "src/interfaces",
      //   }),
      //   dirResolver({
      //     target: "src/hooks",
      //   }),
      //   dirResolver({
      //     target: "src/components",
      //   }),
      // ],
      eslintrc: {
        enabled: true, // <-- this
      },
    }),
  ],
});
