import { defineConfig } from 'vite';
import { cloudflare } from "@cloudflare/vite-plugin";
import { tailscaleFunnel } from 'vite-plugin-tailscale-funnel';

export default defineConfig({
  plugins: [
    tailscaleFunnel(),
    cloudflare(),
  ],
  server: {
    port: 3002
  }
});