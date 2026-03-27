import { z } from "zod/v4"
import { type InferSchema } from "xmcp"
import { getRequest } from "../lib/request"

export const schema = {
  bookingUid: z.string().describe("The unique identifier (UID) of the booking to reschedule"),
  newStart: z.string().describe("New start time in ISO 8601 format (e.g. 2024-06-20T14:00:00Z)"),
  rescheduleReason: z.string().optional().describe("Optional reason for rescheduling"),
}

export const metadata = {
  name: "bookings_reschedule",
  description: "Reschedules an existing Cal.com booking to a new time slot.",
}

export default async function rescheduleBooking({
  bookingUid,
  newStart,
  rescheduleReason,
}: InferSchema<typeof schema>) {
  const request = getRequest()

  const body: Record<string, unknown> = {
    start: newStart,
    ...(rescheduleReason ? { rescheduleReason } : {}),
  }

  const { data } = await request.post(`/bookings/${bookingUid}/reschedule`, body, {
    headers: { "cal-api-version": "2024-08-13" },
  })

  return JSON.stringify(data, null, 2)
}
