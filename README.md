# Tailscale Funnel Vite Plugin

A Vite plugin that starts a [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel) for your local development server and exposes its public HTTPS URL to your app.

## Requirements

- Node.js 16 or newer
- The Tailscale CLI installed and available on `PATH`
- Tailscale running and authenticated (`tailscale up`)
- Funnel enabled for your tailnet, with MagicDNS and HTTPS certificates configured

The plugin does not install Tailscale or authenticate on your behalf. If the CLI is missing, it reports an installation and setup hint. On macOS, make sure the Tailscale CLI integration is enabled and its executable is on `PATH`.

## Install

```sh
npm install vite-plugin-tailscale-funnel --save-dev
```

## Usage

```ts
import { defineConfig } from "vite";
import { tailscaleFunnel } from "vite-plugin-tailscale-funnel";

export default defineConfig({
  plugins: [tailscaleFunnel()],
});
```

Start Vite as usual:

```sh
npm run dev
```

The plugin reads the machine hostname and MagicDNS suffix from `tailscale status --json`, then runs `tailscale funnel <port>`. Funnel prints the public HTTPS address when it is ready. Tailscale Funnel only supports HTTPS on ports 443, 8443, and 10000 and requires the tailnet's Funnel policy to permit the device.

The plugin stops the foreground Funnel process when the Vite server shuts down.

## Configuration

```ts
tailscaleFunnel({
  port: 5173, // Optional; defaults to the port Vite actually listens on
  enabled: true, // Optional; false disables Funnel, default true
  debug: false, // Optional; print additional plugin diagnostics
});
```

If Vite chooses another port because the configured port is occupied, the plugin forwards the actual listening port unless `port` was explicitly set.

## Access the URL in application code

```ts
import { getTunnelUrl } from "virtual:vite-plugin-tailscale-funnel";

console.log("Public development URL:", getTunnelUrl());
```

Add the provided types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client", "vite-plugin-tailscale-funnel/virtual"]
  }
}
```

When `enabled: false`, `getTunnelUrl()` returns an empty string. The virtual module is intended for development and is not included in production builds.

## Troubleshooting

- **Tailscale CLI not found:** Install Tailscale and ensure `tailscale` is on `PATH`. On macOS, enable the CLI integration in Tailscale settings, or follow [Tailscale's CLI instructions](https://tailscale.com/docs/reference/tailscale-cli).
- **Not connected or authenticated:** Run `tailscale up` and check `tailscale status`.
- **Funnel command fails:** Confirm Funnel is enabled for your tailnet and that your device is allowed by its Funnel node attributes. See [Funnel requirements](https://tailscale.com/docs/features/tailscale-funnel).
- **Vite blocks Funnel requests:** The plugin adds the Funnel hostname to Vite's `server.allowedHosts` list unless you explicitly configured that option.

## Development

```sh
npm install
npm run typecheck
npm run lint
npm run build
```
