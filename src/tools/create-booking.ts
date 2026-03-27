import { z } from "zod"
import { type InferSchema } from "xmcp"
import { getConfig } from "../lib/config"
import { getRequest } from "../lib/request"

export const schema = {
  eventTypeId: z.number().describe("The Cal.com event type ID to book"),
  start: z.string().describe("Start time in ISO 8601 format (e.g. 2024-06-15T10:00:00Z)"),
  attendeeName: z.string().describe("Full name of the attendee"),
  attendeeEmail: z.string().email().describe("Email address of the attendee"),
  attendeeTimezone: z.string().describe("IANA timezone of the attendee (e.g. America/New_York)"),
  attendeePhone: z.string().optional().describe("Phone number of the attendee. Falls back to PHONE_NUMBER from config if not provided."),
  notes: z.string().optional().describe("Optional notes or reason for the booking"),
}

export const metadata = {
  description:
    "Creates a new booking on Cal.com for a client. Requires the client's name, email, timezone, and the event type ID. Phone number can be passed per call or defaults to PHONE_NUMBER from config.",
}

export default async function createBooking({
  eventTypeId,
  start,
  attendeeName,
  attendeeEmail,
  attendeeTimezone,
  attendeePhone,
  notes,
}: InferSchema<typeof schema>) {
  const config = getConfig()
  const request = getRequest()

  const phoneNumber = attendeePhone ?? config.PHONE_NUMBER

  const body: Record<string, unknown> = {
    start,
    eventTypeId,
    attendee: {
      name: attendeeName,
      email: attendeeEmail,
      timeZone: attendeeTimezone,
      ...(phoneNumber ? { phoneNumber } : {}),
    },
    ...(notes ? { metadata: { notes } } : {}),
  }

  const { data } = await request.post("/bookings", body, {
    headers: { "cal-api-version": "2024-08-13" },
  })

  return JSON.stringify(data, null, 2)
}
