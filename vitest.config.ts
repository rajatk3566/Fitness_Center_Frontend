import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts", // Ensure this points to your setup file
  },
  resolve: {
    alias: {
      "@components": "/src/components",
      "@src": "/src",
    },
  },
});
