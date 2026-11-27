import { defineConfig } from 'vite';
import { cloudflare } from "@cloudflare/vite-plugin";
import { tailscaleFunnel } from 'vite-plugin-tailscale-funnel';

export default defineConfig({
  plugins: [
    tailscaleFunnel(),
    cloudflare(),
  ],
  server: {
    port: 3003
  },
  build: {
    rollupOptions: {
      input: {
        client: 'src/client.ts'
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'client') {
            return 'src/client.js'; // now you can reference `/client.js` in HTML
          }
          return 'assets/[name].[hash].js';
        }
      }
    }
  }
});