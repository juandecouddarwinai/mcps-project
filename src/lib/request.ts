import axios from "axios"
import { getConfig } from "./config"

/**
 * Creates an axios instance configured from the `x-config` request header.
 *
 * Config keys read:
 *   BASE_URL       → axios baseURL
 *   API_KEY        → forwarded as X-API-Key
 *   AUTHORIZATION  → forwarded as Authorization
 *
 * Usage inside any tool:
 *   import { getRequest } from "../lib/request";
 *   const request = getRequest();
 *   const res = await request.get("/endpoint");
 */
export function getRequest() {
  const config = getConfig()

  const forwardedHeaders: Record<string, string> = {}
  if (config.API_KEY) forwardedHeaders["X-API-Key"] = config.API_KEY
  if (config.AUTHORIZATION)
    forwardedHeaders["Authorization"] = config.AUTHORIZATION

  return axios.create({
    baseURL: config.BASE_URL,
    headers: forwardedHeaders,
  })
}
