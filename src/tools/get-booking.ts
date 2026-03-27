import { z } from "zod/v4"
import { type InferSchema } from "xmcp"
import { getRequest } from "../lib/request"

export const schema = {
  bookingUid: z.string().describe("The unique identifier (UID) of the booking to retrieve"),
}

export const metadata = {
  name: "bookings_get",
  description: "Retrieves the details of a specific Cal.com booking by its UID.",
}

export default async function getBooking({
  bookingUid,
}: InferSchema<typeof schema>) {
  const request = getRequest()

  const { data } = await request.get(`/bookings/${bookingUid}`, {
    headers: { "cal-api-version": "2024-08-13" },
  })

  return JSON.stringify(data, null, 2)
}
