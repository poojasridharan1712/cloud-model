import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server proxies API and image requests to the Express backend on port 5000.
// This avoids CORS issues and lets image paths like /uploads/xxx.png work directly.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/posts": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});
