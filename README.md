# MCP Node.js Template

A minimalist [MCP](https://modelcontextprotocol.io/) server template built with [xmcp](https://xmcp.dev/) and TypeScript. Designed to make it easy to wrap any REST API into MCP tools.

The key idea: the client passes a single `x-config` header containing a JSON object (like a `.env` in JSON form). Inside any tool, call `getConfig()` to read it or `getRequest()` to get a ready-to-use [axios](https://axios-http.com/) instance — no env vars, no config files.

## Quick Start

```bash
npm install
npm run dev
```

The server starts on **http://localhost:8080/mcp**.

## How It Works

The MCP client sends an `x-config` header with a JSON object. Your tools read it via two helpers:

### `getConfig()` — raw key-value access

```typescript
import { getConfig } from "../lib/config"

const config = getConfig()
const apiKey = config.API_KEY // any key you put in x-config
```

Missing header returns `{}`, so tools that don't need config still work. Malformed JSON throws a descriptive error.

### `getRequest()` — pre-configured axios instance

```typescript
import { getRequest } from "../lib/request"

const request = getRequest()
const { data } = await request.get("/posts/1")
```

`getRequest()` reads these keys from `x-config`:

| Config key      | Effect                              |
| --------------- | ----------------------------------- |
| `BASE_URL`      | Sets axios `baseURL`                |
| `API_KEY`       | Forwarded as `X-API-Key` header     |
| `AUTHORIZATION` | Forwarded as `Authorization` header |

## Adding a New Tool

Create a file in `src/tools/`. The filename becomes the tool name. Each tool exports up to three things:

```typescript
// src/tools/my-tool.ts
import { z } from "zod"
import { type InferSchema } from "xmcp"
import { getConfig } from "../lib/config"
import { getRequest } from "../lib/request"

// 1. Schema — defines the tool's input parameters
export const schema = {
  userId: z.string().describe("The user ID to look up"),
}

// 2. Metadata — describes the tool to the LLM
export const metadata = {
  description: "Fetches a user by ID from the target API.",
}

// 3. Default export — the handler
export default async function myTool({ userId }: InferSchema<typeof schema>) {
  const request = getRequest()
  const { data } = await request.get(`/users/${userId}`)
  return JSON.stringify(data, null, 2)
}
```

Save the file and `xmcp dev` picks it up automatically (hot reload).

## Connecting from an MCP Client

Pass the `x-config` header with a JSON string containing your config keys. Example for wrapping the JSONPlaceholder API:

```json
{
  "mcpServers": {
    "my-api": {
      "url": "http://localhost:8080/mcp",
      "headers": {
        "x-config": "{\"BASE_URL\":\"https://jsonplaceholder.typicode.com\"}"
      }
    }
  }
}
```

Then call the `example-api-call` tool with `endpoint: "/posts/1"` to verify it works.

For APIs that require authentication, add the relevant keys:

```json
{
  "headers": {
    "x-config": "{\"BASE_URL\":\"https://api.example.com\",\"API_KEY\":\"sk-...\",\"AUTHORIZATION\":\"Bearer tok-...\"}"
  }
}
```

## Project Structure

```
src/
├── lib/
│   ├── config.ts            ← getConfig() — parses x-config header
│   └── request.ts           ← getRequest() — axios instance from config
├── tools/                    ← one file per MCP tool
└── middleware.ts              ← request logging
```

## Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start dev server with hot reload |
| `npm run build` | Build for production             |
| `npm start`     | Run production build             |
