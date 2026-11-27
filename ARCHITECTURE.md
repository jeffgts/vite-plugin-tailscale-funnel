# Tailscale Funnel Vite Plugin Architecture

The plugin in `src/index.ts` integrates Tailscale Funnel with Vite's development-server lifecycle.

## Startup

1. During Vite's `serve` configuration, the plugin runs `tailscale status --json`.
2. It reads `Self.Hostname` (or the CLI's `Self.HostName` spelling) and `Self.MagicDNSSuffix` to construct the device's HTTPS MagicDNS URL.
3. It adds that hostname to Vite's allowed hosts unless the user has explicitly configured `server.allowedHosts`.
4. Once Vite is listening, it runs `tailscale funnel <port>` in the foreground. An explicit plugin `port` overrides Vite's actual listening port.
5. The virtual module returns the derived URL to development application code.

The CLI must already be installed, on `PATH`, running, and authenticated. Funnel permissions, MagicDNS, and HTTPS certificates are managed by Tailscale; the plugin does not install binaries, change tailnet policy, or configure DNS.

## Shutdown

The foreground Funnel process receives `SIGINT` when the Vite HTTP server closes or the plugin's bundle hook runs. This mirrors stopping the documented `tailscale funnel` command with Ctrl+C.

## Package structure

- `src/index.ts`: Vite plugin, CLI status parsing, Funnel process lifecycle, and virtual module implementation.
- `src/virtual.d.ts`: Types for `virtual:vite-plugin-tailscale-funnel`.
- `package.json`: Package metadata, Vite peer dependency, and build scripts.
