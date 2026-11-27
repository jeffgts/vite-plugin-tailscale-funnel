# Cursor Background Agents Example

This example demonstrates how to integrate **Cursor Background Agents** with **Cloudflare Workers**, Vite, and Tailscale Funnel. This setup allows you to create a web service that can interact with Cursor's background agent system, providing a bridge between your local development environment and cloud-based AI assistance.

This example shows how to set up webhooks and API endpoints that can communicate with Cursor's agent system.

## ✨ Features

- 🤖 **Cursor Background Agent Integration** - Connect with Cursor's AI agent system
- ⚡ **Cloudflare Workers backend** - serverless, scalable, and fast
- 🔐 **Secure API endpoints** with proper authentication
- 🌐 **Public HTTPS endpoint** via Tailscale Funnel
- 📊 **Real-time agent interaction dashboard** showing AI requests and responses
- 🚀 **Easy setup** with step-by-step instructions
- 🔧 **Handles multiple agent interactions**: code analysis, suggestions, automation
- 🔄 **Auto-refreshing UI** to see agent activity in real-time
- 🛠️ **Local development** with Wrangler and Vite
- 🎯 **Full TypeScript support** with proper types and interfaces
- 🌐 **Virtual module integration** for runtime tunnel URL access
- ✅ **Type-safe API responses** and error handling

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd examples/cursor-background-agents-example
npm install
```

### 2. Configure Environment

```bash
cp env.example .env
# Edit .env with the credentials required by the example
```

### 3. Start the Development Servers

```bash
npm run dev
```

This will start both:
- **Wrangler dev server** (port 8787) - Your Cloudflare Worker
- **Vite dev server** (port 3000) - Your frontend exposed through Tailscale Funnel

Tailscale Funnel will:
- Expose your device's Tailscale HTTPS URL
- Proxy requests to your local Cloudflare Worker
- Serve the web interface for agent interaction monitoring

### 4. Configure Cursor Background Agents

1. **Open the web interface** at your tunnel URL
2. **Follow the setup steps** shown in the UI:
   - Configure your Cursor editor to connect to the background agent service
   - Set up API keys and authentication tokens
   - Configure agent interaction endpoints

## 📋 Cursor Background Agents Setup Guide

### Step 1: Configure API Keys

Set up your API keys and tokens as Wrangler secrets:

```bash
wrangler secret put CURSOR_API_KEY
wrangler secret put OPENAI_API_KEY  # or other AI provider keys
```

This securely stores your API keys in Cloudflare Workers.

### Step 2: Configure Agent Endpoints

1. In your Cursor editor settings, configure the background agent service endpoint
2. Set the webhook URL to: `https://your-tunnel-domain.com/api/agent-webhook`
3. Configure authentication tokens and request headers

### Step 3: Set Up Agent Interactions

Configure the types of interactions your background agents will handle:

- **Code Analysis**: Real-time code review and suggestions
- **Auto-completion**: Enhanced AI-powered completions
- **Documentation**: Automatic documentation generation
- **Refactoring**: AI-assisted code refactoring
- **Testing**: Automated test generation

### Step 4: Test Agent Connection

Use the web interface to test your agent connection and verify that:

1. API keys are properly configured
2. Webhook endpoints are reachable
3. Agent responses are being received and processed

## 🔧 How It Works

### Agent Interaction Flow

1. **Cursor editor triggers agent** (e.g., code completion, analysis request)
2. **Agent sends HTTP request** to your webhook endpoint
3. **Cloudflare Tunnel** routes the request to your local Cloudflare Worker
4. **Worker authenticates request** using API keys and tokens
5. **Worker processes agent request** and integrates with AI services
6. **Response sent back** to Cursor with suggestions/analysis
7. **UI updates** showing the agent interaction history

### Interaction Types Handled

- **CODE_ANALYSIS** - Real-time code review and suggestions
- **COMPLETION** - AI-powered code completions
- **REFACTOR** - Code refactoring suggestions
- **DOCUMENTATION** - Auto-generated documentation
- **TEST_GENERATION** - Automated test creation
- **ERROR_ANALYSIS** - Code error detection and fixes

### Security

The Cloudflare Worker implements secure agent communication by:
- Verifying API keys and authentication tokens (stored as secure Wrangler secrets)
- Preventing unauthorized agent calls
- Ensuring requests come from authenticated Cursor instances
- Rate limiting and request validation

## 📁 Project Structure

```
cursor-background-agents-example/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration with virtual module types
├── vite.config.ts        # Vite config with Cloudflare Tunnel
├── wrangler.toml         # Cloudflare Workers configuration
├── src/
│   ├── worker.ts         # TypeScript Cloudflare Worker with agent endpoints
│   ├── client.ts         # TypeScript client with virtual module usage
│   └── types.ts          # Shared type definitions
├── public/
│   ├── index.html        # Web interface for agent monitoring
│   └── styles.css        # UI styling
├── env.example           # Environment variables template
└── README.md             # This file
```

## 🎯 TypeScript Integration

This example demonstrates comprehensive TypeScript usage throughout the stack:

### Server-side (Cloudflare Worker)
- **Fully typed interfaces** for agent interactions, API responses, and environment variables
- **Type-safe error handling** with proper TypeScript error types
- **Virtual module integration** with `getTunnelUrl()` function
- **Cloudflare Workers types** for Request/Response objects

```typescript
// Example: Type-safe agent interaction handling
interface Env {
  CURSOR_API_KEY?: string;
  OPENAI_API_KEY?: string;
}

async function handleAgentRequest(request: Request, env: Env): Promise<Response> {
  // Fully typed agent interaction processing...
}
```

### Client-side TypeScript
- **Virtual module usage** for runtime tunnel URL access
- **Type-safe API calls** with proper response interfaces
- **DOM manipulation** with TypeScript safety
- **Error boundaries** with typed error handling

```typescript
// Example: Virtual module usage in client
import { getTunnelUrl } from 'virtual:vite-plugin-tailscale-funnel';

const tunnelUrl = getTunnelUrl(); // Fully typed!
```

### TypeScript Configuration
The `tsconfig.json` includes:
- **Virtual module types** from `vite-plugin-tailscale-funnel/virtual`
- **Strict TypeScript settings** for maximum type safety
- **Vite client types** for development features

## 🌐 Web Interface

The included web interface provides:

- **Setup Status** - Shows if your agent service is properly configured
- **Step-by-step Guide** - Instructions for Cursor background agent setup
- **Real-time Interactions** - Live feed of agent requests and responses
- **Debug Information** - Server status and configuration details with TypeScript features
- **Endpoint Testing** - Test agent endpoint connectivity

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CURSOR_API_KEY` | Cursor API key for agent authentication | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI services | ✅ Yes |

## 🐛 Troubleshooting

### "Authentication failed" errors
- Ensure `CURSOR_API_KEY` is set correctly in your Wrangler secrets
- Check that your Cursor editor is configured with the correct API keys
- Verify the webhook URL is properly configured in Cursor settings

### Agent endpoint not reachable
- Verify Tailscale is connected and Funnel is enabled for your tailnet
- Test the `/health` endpoint to ensure the server is responding

### No agent responses
- Make sure your AI service API keys (OpenAI, etc.) are properly configured
- Check the server logs for any API rate limiting or quota issues
- Verify your Cursor editor is configured to use the background agent service

### Agent requests timing out
- Check your network connection and proxy settings
- Ensure the agent service isn't overloaded with requests
- Consider implementing request queuing for high-volume scenarios

## 🚀 Next Steps

Once your agent service is running and connected, you can:

- **Add more agent interaction types** (code generation, debugging, etc.)
- **Implement advanced AI workflows** with multi-step processing
- **Store agent interaction history** in a database for analytics
- **Add authentication** and user management for the web interface
- **Deploy to production** using an appropriate production hosting setup
- **Scale horizontally** with multiple worker instances

## 📚 Resources

- [Cursor Editor Documentation](https://cursor.sh/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Tailscale Funnel Documentation](https://tailscale.com/docs/features/tailscale-funnel)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Need help?** Check the troubleshooting section above or refer to the Cursor and Tailscale documentation for more details.