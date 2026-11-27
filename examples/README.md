# Examples

Example Vite projects demonstrating the `vite-plugin-tailscale-funnel` package.

- [`basic-vite-app`](./basic-vite-app): Minimal Vite app using Funnel and the virtual URL module.
- [`quick-tunnel-example`](./quick-tunnel-example): A small development app with the same zero-option plugin setup.
- The Discord and Cursor examples demonstrate app integrations; their own Cloudflare Worker configuration is separate from the Tailscale Funnel plugin.

## Run an example

From an example directory:

```sh
npm install
npm run dev
```

The root plugin package must be built first when an example uses the local package:

```sh
cd ../..
npm install
npm run build
```

You must have Tailscale installed, authenticated, and Funnel enabled for your tailnet. See the [main README](../README.md) for requirements and setup.
