import { z } from "zod"
import { RequestLocation, RequestType } from "@prisma/client"

export const requestFormSchema = z.object({
 type: z.enum(RequestType, "Required"),
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

export type CreateRequestInput = {
 type: RequestType
 location: RequestLocation
 requestedBy: string
 description: string
 completed?: boolean
}

export type UpdateRequestInput = CreateRequestInput & {
 id: string
}

export type CreateNoteInput = {
 requestId: string
 note: string
}