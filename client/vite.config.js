// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,                    // Your frontend runs here
    open: true,                    // Auto-open browser on start
    host: true,                    // Allow access from network (optional)

    proxy: {
      // REST API proxy
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: false,                 // We handle WebSocket separately
      },

      // Socket.IO proxy (critical for real-time!)
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,                  // Enable WebSocket proxy
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Optional: Fix for some Windows path issues
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});