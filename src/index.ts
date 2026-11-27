/**
 * @fileoverview Tailscale Funnel Vite plugin
 */

import type { Plugin, ViteDevServer } from "vite";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";

const VIRTUAL_MODULE_ID = "virtual:vite-plugin-tailscale-funnel";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
const TAILSCALE_SETUP_MESSAGE =
  "Install Tailscale, ensure the `tailscale` CLI is on your PATH, and authenticate with `tailscale up`.";

export interface TailscaleFunnelOptions {
  /** Override the local Vite server port forwarded by Funnel. */
  port?: number;
  /** Disable Funnel while keeping the virtual module available. */
  enabled?: boolean;
  /** Print additional plugin diagnostics. */
  debug?: boolean;
}

interface TailscaleStatus {
  Self?: {
    MagicDNSSuffix?: unknown;
    HostName?: unknown;
    Hostname?: unknown;
  } | null;
}

function getTailscaleEnvironment(): NodeJS.ProcessEnv {
  return { ...process.env, TAILSCALE_BE_CLI: "1" };
}

function getFunnelUrl(): string {
  const result = spawnSync("tailscale", ["status", "--json"], {
    encoding: "utf8",
    env: getTailscaleEnvironment(),
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error && "code" in result.error && result.error.code === "ENOENT") {
    throw new Error(
      `[tailscale-funnel] Tailscale CLI was not found on PATH. ${TAILSCALE_SETUP_MESSAGE}`,
    );
  }
  if (result.error) {
    throw new Error(
      `[tailscale-funnel] Could not run the Tailscale CLI: ${result.error.message}. ${TAILSCALE_SETUP_MESSAGE}`,
    );
  }
  if (result.status !== 0) {
    const details = result.stderr.trim() || result.stdout.trim();
    throw new Error(
      `[tailscale-funnel] Could not read Tailscale status. Make sure Tailscale is running and authenticated. ${details} ${TAILSCALE_SETUP_MESSAGE}`,
    );
  }

  let status: TailscaleStatus;
  try {
    status = JSON.parse(result.stdout) as TailscaleStatus;
  } catch {
    throw new Error("[tailscale-funnel] Tailscale returned invalid JSON from `tailscale status --json`.");
  }

  const hostname = status.Self?.Hostname ?? status.Self?.HostName;
  const suffix = status.Self?.MagicDNSSuffix;
  if (typeof hostname !== "string" || typeof suffix !== "string" || !hostname.trim() || !suffix.trim()) {
    throw new Error(
      `[tailscale-funnel] Tailscale is not connected or its device DNS name is unavailable. ${TAILSCALE_SETUP_MESSAGE}`,
    );
  }

  const normalizedHostname = hostname.trim().replace(/\.+$/, "");
  const normalizedSuffix = suffix.trim().replace(/^\.+|\.+$/g, "");
  if (!normalizedHostname || !normalizedSuffix) {
    throw new Error(
      `[tailscale-funnel] Tailscale is not connected or its device DNS name is unavailable. ${TAILSCALE_SETUP_MESSAGE}`,
    );
  }
  return `https://${normalizedHostname}.${normalizedSuffix}`;
}

function getListeningPort(server: ViteDevServer, options: TailscaleFunnelOptions): number {
  if (options.port !== undefined) return options.port;

  const address = server.httpServer?.address();
  if (address && typeof address === "object") return address.port;
  return server.config.server.port ?? 5173;
}

function tailscaleFunnel(options: TailscaleFunnelOptions = {}): Plugin {
  const { enabled = true, debug = false } = options;
  if (options.port !== undefined && (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535)) {
    throw new Error("[tailscale-funnel] port must be an integer between 1 and 65535.");
  }

  let funnelUrl = "";
  let funnelProcess: ChildProcess | undefined;
  let stopping = false;

  const stopFunnel = () => {
    stopping = true;
    funnelProcess?.kill("SIGINT");
    funnelProcess = undefined;
  };

  return {
    name: "vite-plugin-tailscale-funnel",
    apply: "serve",

    config(config) {
      if (!enabled) return;

      funnelUrl = getFunnelUrl();
      const hostname = new URL(funnelUrl).hostname;
      config.server ??= {};

      if (config.server.allowedHosts === undefined) {
        config.server.allowedHosts = [hostname];
      } else if (Array.isArray(config.server.allowedHosts) && !config.server.allowedHosts.includes(hostname)) {
        config.server.allowedHosts.push(hostname);
      }
    },

    configureServer(server) {
      if (!enabled) return;

      const startFunnel = () => {
        const port = getListeningPort(server, options);
        const cliProcess = spawn("tailscale", ["funnel", String(port)], {
          env: getTailscaleEnvironment(),
          stdio: "inherit",
        });
        funnelProcess = cliProcess;

        cliProcess.once("error", (error) => {
          if ("code" in error && error.code === "ENOENT") {
            console.error(
              `[tailscale-funnel] Tailscale CLI was not found on PATH. ${TAILSCALE_SETUP_MESSAGE}`,
            );
          } else {
            console.error(`[tailscale-funnel] Could not start Tailscale Funnel: ${error.message}`);
          }
        });

        cliProcess.once("exit", (code, signal) => {
          if (!stopping && (code !== 0 || signal)) {
            console.error(
              `[tailscale-funnel] Funnel exited${code === null ? "" : ` with code ${code}`}${signal ? ` (${signal})` : ""}.`,
            );
          }
          if (funnelProcess === cliProcess) funnelProcess = undefined;
        });

        if (debug) {
          console.log(`[tailscale-funnel:debug] Forwarding local port ${port} to ${funnelUrl}`);
        }
        console.log(`[tailscale-funnel] Starting Funnel for ${funnelUrl}`);
      };

      if (server.httpServer?.listening) {
        startFunnel();
      } else {
        server.httpServer?.once("listening", startFunnel);
      }
      server.httpServer?.once("close", stopFunnel);
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
      return undefined;
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export function getTunnelUrl() { return ${JSON.stringify(funnelUrl)}; }`;
      }
      return undefined;
    },

    closeBundle: stopFunnel,
  };
}

export { tailscaleFunnel };
export default tailscaleFunnel;
