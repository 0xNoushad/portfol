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
            // Split node_modules into vendor chunk
            if (id.includes('node_modules')) {
              // Group all React-related packages together
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              // Group motion/framer-motion together
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              // Everything else goes to vendor
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
