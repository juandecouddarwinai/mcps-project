import { type XmcpConfig } from "xmcp"

const config: XmcpConfig = {
  paths: {
    prompts: false,
    resources: false,
  },
  http: {
    port: Number(process.env.PORT) || 8080,
    cors: {
      origin: "*",
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "mcp-session-id",
        "mcp-protocol-version",
        "x-config",
      ],
    },
  },
}

export default config
