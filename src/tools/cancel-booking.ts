import { z } from "zod/v4"
import { type InferSchema } from "xmcp"
import { getRequest } from "../lib/request"

export const schema = {
  bookingUid: z.string().describe("The unique identifier (UID) of the booking to cancel"),
  cancellationReason: z.string().optional().describe("Optional reason for cancelling the booking"),
}

export const metadata = {
  name: "bookings_cancel",
  description: "Cancels an existing Cal.com booking by its UID.",
}

export default async function cancelBooking({
  bookingUid,
  cancellationReason,
}: InferSchema<typeof schema>) {
  const request = getRequest()

  const body: Record<string, unknown> = {
    ...(cancellationReason ? { cancellationReason } : {}),
  }

  const { data } = await request.post(`/bookings/${bookingUid}/cancel`, body, {
    headers: { "cal-api-version": "2024-08-13" },
  })

  return JSON.stringify(data, null, 2)
}
