import { defineConfig, type Plugin } from 'vite';
import tailscaleFunnel from 'vite-plugin-tailscale-funnel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // The local package and example can resolve different Vite/Rollup versions.
    tailscaleFunnel() as unknown as Plugin
  ],
  server: {
    port: 3000,
    host: '127.0.0.1'
  }
});