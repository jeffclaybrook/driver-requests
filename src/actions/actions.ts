"use server"

import { revalidatePath } from "next/cache"
import { RequestStatus } from "@prisma/client"
import { requireAdmin, requireDbUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CreateRequestInput, UpdateRequestInput, CreateNoteInput } from "@/lib/schema"

export async function createRequest(input: CreateRequestInput) {
 await requireAdmin()
 
 const status = input.completed ? RequestStatus.COMPLETED : RequestStatus.PENDING

 await prisma.request.create({
  data: {
   location: input.location,
   requestedBy: input.requestedBy.trim(),
   description: input.description.trim(),
   status,
   completedAt: status === RequestStatus.COMPLETED ? new Date() : null
  }
 })

 revalidatePath("/admin")
}

export async function updateRequest(input: UpdateRequestInput) {
 await requireAdmin()
 
 const status = input.completed ? RequestStatus.COMPLETED : RequestStatus.PENDING

 await prisma.request.update({
  where: {
   id: input.id
  },
  data: {
   location: input.location,
   requestedBy: input.requestedBy.trim(),
   description: input.description.trim(),
   status,
   completedAt: status === RequestStatus.COMPLETED ? new Date() : null
  }
 })

 revalidatePath("/admin")
 revalidatePath("/")
}

export async function deleteRequest(id: string) {
 await requireAdmin()

 await prisma.request.delete({
  where: { id }
 })

 revalidatePath("/admin")
 revalidatePath("/")
}

export async function markRequestCompleted(id: string) {
 await requireDbUser()

 await prisma.request.updateMany({
  where: {
   id,
   status: "PENDING"
  },
  data: {
   status: "COMPLETED",
   completedAt: new Date()
  }
 })

 revalidatePath("/")
 revalidatePath(`/${id}`)
}

export async function undoMarkRequestCompleted(id: string) {
 await requireDbUser()

 await prisma.request.updateMany({
  where: {
   id,
   status: "COMPLETED"
  },
  data: {
   status: "PENDING",
   completedAt: new Date()
  }
 })

 revalidatePath("/")
 revalidatePath(`/${id}`)
}

export async function createNote(input: CreateNoteInput) {
 await requireDbUser()

 const note = input.note.trim()

 await prisma.request.update({
  where: {
   id: input.requestId
  },
  data: {
   note: note.length === 0 ? null : note
  }
 })

 revalidatePath(`/${input.requestId}`)
 revalidatePath(`/admin/${input.requestId}`)
}