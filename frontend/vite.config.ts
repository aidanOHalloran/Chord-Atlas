import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access
    port: 5173,
    proxy: {
      "/api": {
        target: "http://backend:5000", // docker service name
        changeOrigin: true,
      },
    },
    hmr:{
      overlay: false
    }
  },
});
