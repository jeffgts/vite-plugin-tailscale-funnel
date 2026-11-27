import { defineConfig, type Plugin } from 'vite';
import { tailscaleFunnel } from 'vite-plugin-tailscale-funnel';

export default defineConfig({
  plugins: [
    tailscaleFunnel() as Plugin
  ],
  server: {
    port: 5176,
    host: '127.0.0.1'
  }
});