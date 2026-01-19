// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://noushad.live",
  trailingSlash: "always",
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Enable code splitting for better caching
      rollupOptions: {
        output: {
          // Split vendor code into separate chunks
          manualChunks: (id) => {
            // Split React and Motion into separate chunks
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            // Other node_modules go into vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 600,
    },
  },

  // Enable compression
  compressHTML: true,
  
  // Build optimizations
  build: {
    // Inline small assets
    inlineStylesheets: 'auto',
  },
});
