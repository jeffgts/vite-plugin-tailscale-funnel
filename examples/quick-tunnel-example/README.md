# Tailscale Funnel Example

This example shows the default setup for `vite-plugin-tailscale-funnel`.

```sh
npm install
npm run dev
```

Tailscale must be installed with its CLI on `PATH`, running, and authenticated with `tailscale up`. Funnel must also be enabled for the device in your tailnet policy.

The app can access its public URL through the virtual module:

```js
import { getTunnelUrl } from "virtual:vite-plugin-tailscale-funnel";

console.log(getTunnelUrl());
```

See the [plugin documentation](../../README.md) for configuration and troubleshooting.
