import { z } from "zod"
import { RequestLocation } from "@prisma/client"

export const requestFormSchema = z.object({
 location: z.enum(RequestLocation, "Required"),
 requestedBy: z.string().min(1, "Required"),
 description: z.string().min(1, "Required"),
 completed: z.boolean().optional().default(false)
})

export type RequestFormValues = z.input<typeof requestFormSchema>