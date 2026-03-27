import { z } from "zod/v4"
import { type InferSchema } from "xmcp"
import { getRequest } from "../lib/request"

export const schema = {
  eventTypeId: z.number().describe("The Cal.com event type ID to check availability for"),
  startTime: z.string().describe("Start of the availability window in ISO 8601 format (e.g. 2024-06-15T00:00:00Z)"),
  endTime: z.string().describe("End of the availability window in ISO 8601 format (e.g. 2024-06-20T23:59:59Z)"),
  username: z.string().optional().describe("Cal.com username of the host (optional if inferred from the event type)"),
}

export const metadata = {
  name: "slots_get",
  description: "Returns available time slots for a given Cal.com event type within a date range.",
}

export default async function getAvailability({
  eventTypeId,
  startTime,
  endTime,
  username,
}: InferSchema<typeof schema>) {
  const request = getRequest()

  const params: Record<string, unknown> = {
    eventTypeId,
    startTime,
    endTime,
    ...(username ? { usernameList: username } : {}),
  }

  const { data } = await request.get("/slots/available", {
    params,
    headers: { "cal-api-version": "2024-08-13" },
  })

  return JSON.stringify(data, null, 2)
}
