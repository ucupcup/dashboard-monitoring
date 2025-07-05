import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  css: {
    postcss: "./postcss.config.js",
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@atoms": path.resolve(__dirname, "./src/components/atoms"),
      "@molecules": path.resolve(__dirname, "./src/components/molecules"),
      "@organisms": path.resolve(__dirname, "./src/components/organisms"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/app/hooks"),
      "@store": path.resolve(__dirname, "./src/app/store"),
      "@utils": path.resolve(__dirname, "./src/shared/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@presentation": path.resolve(__dirname, "./src/presentation"),
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,

    hmr: {
      overlay: true,
    },
  },
  build: {
    target: "es2020",

    sourcemap: true,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["clsx"],
          state: ["zustand"],
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  optimizeDeps: {
    include: ["react", "react-dom", "zustand", "clsx"],
  },

  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  },

  preview: {
    port: 3001,
    open: true,
  },
});
