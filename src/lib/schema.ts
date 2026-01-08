import { z } from "zod"
import { RequestLocation } from "@prisma/client"

export const requestFormSchema = z.object({
 location: z.enum(RequestLocation, "Required"),
 requestedBy: z.string().min(1, "Required"),
 description: z.string().min(1, "Required"),
 completed: z.boolean().optional().default(false)
})

export const noteFormSchema = z.object({
 note: z.string().max(2000, "Note must be less than 2000 characters").optional().default("")
})

export type RequestFormValues = z.input<typeof requestFormSchema>

export type NoteFormValues = z.input<typeof noteFormSchema>