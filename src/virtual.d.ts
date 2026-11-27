/**
 * Type definitions for virtual:vite-plugin-tailscale-funnel.
 */

declare module "virtual:vite-plugin-tailscale-funnel" {
  /** Return this development server's Tailscale Funnel URL. */
  export function getTunnelUrl(): string;
}
