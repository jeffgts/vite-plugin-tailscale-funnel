# Basic Vite App Example

A minimal Vite application using `vite-plugin-tailscale-funnel`.

## Setup

Install the root package's dependencies and build it, then install this example:

```sh
cd ../..
npm install
npm run build
cd examples/basic-vite-app
npm install
npm run dev
```

Make sure the Tailscale CLI is available on `PATH`, you are authenticated with `tailscale up`, and Funnel is enabled for your tailnet. The plugin derives the public URL from `tailscale status --json`.

## Virtual module

The app reads the public URL with:

```ts
import { getTunnelUrl } from "virtual:vite-plugin-tailscale-funnel";

console.log(getTunnelUrl());
```

The virtual module types are included in `tsconfig.json`.
