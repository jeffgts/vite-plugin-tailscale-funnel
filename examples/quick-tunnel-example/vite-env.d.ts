/// <reference types="vite/client" />

// Virtual module type for vite-plugin-tailscale-funnel
declare module 'virtual:vite-plugin-tailscale-funnel' {
  /**
   * Get the current tunnel URL.
   * In quick tunnel mode, returns a random trycloudflare.com URL.
   */
  export function getTunnelUrl(): string;
}