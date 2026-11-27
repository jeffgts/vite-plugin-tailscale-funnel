import { defineConfig } from 'vite';
import tailscaleFunnel from 'vite-plugin-tailscale-funnel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailscaleFunnel()
  ],
  server: {
    port: 3000
  }
});