import { headers } from "xmcp/headers"

/**
 * Reads the `x-config` header from the incoming MCP request and parses it
 * as a JSON object. Think of it as a `.env` file sent per-request.
 *
 * - Missing header → `{}`  (tools that don't need config still work)
 * - Malformed JSON → throws a descriptive Error
 *
 * Usage inside any tool:
 *   import { getConfig } from "../lib/config";
 *   const config = getConfig();
 *   const apiKey = config.API_KEY;
 */
export function getConfig(): Record<string, string> {
  const h = headers()

  const raw = Array.isArray(h["x-config"]) ? h["x-config"][0] : h["x-config"]

  if (!raw) return {}

  try {
    return JSON.parse(raw)
  } catch {
    throw new Error(
      `x-config header contains malformed JSON: ${raw.slice(0, 120)}`,
    )
  }
}
