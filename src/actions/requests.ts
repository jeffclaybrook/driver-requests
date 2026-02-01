"use server"

import { revalidatePath } from "next/cache"
import { RequestStatus } from "@prisma/client"
import { requireAdmin, requireDbUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CreateRequestInput, UpdateRequestInput, CreateNoteInput } from "@/lib/schema"

export async function createRequest(input: CreateRequestInput) {
 await requireAdmin()
 
 const status = input.completed
  ? RequestStatus.COMPLETED
  : RequestStatus.PENDING

 await prisma.request.create({
  data: {
   type: input.type,
   location: input.location,
   requestedBy: input.requestedBy.trim(),
   description: input.description.trim(),
   status,
   completedAt: status === RequestStatus.COMPLETED
    ? new Date()
    : null
  }
 })

 revalidatePath("/admin")
}

export async function updateRequest(input: UpdateRequestInput) {
 await requireAdmin()
 
 const status = input.completed
  ? RequestStatus.COMPLETED
  : RequestStatus.PENDING

 await prisma.request.update({
  where: {
   id: input.id
  },
  data: {
   location: input.location,
   requestedBy: input.requestedBy.trim(),
   description: input.description.trim(),
   status,
   completedAt: status === RequestStatus.COMPLETED
    ? new Date()
    : null
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
   note: note.length === 0
    ? null
    : note
  }
 })

 revalidatePath(`/${input.requestId}`)
 revalidatePath(`/admin/${input.requestId}`)
}

export async function getRequests() {
 await requireAdmin()

 return prisma.request.findMany({
  orderBy: [
   { status: "asc" },
   { createdAt: "desc" },
   { id: "desc" }
  ],
  select: {
   id: true,
   type: true,
   location: true,
   description: true,
   status: true,
   note: true,
   createdAt: true,
   updatedAt: true
  }
 })
}

export async function getRequestById(id: string) {
 await requireDbUser()

 return prisma.request.findUnique({
  where: { id },
  select: {
   id: true,
   type: true,
   location: true,
   requestedBy: true,
   description: true,
   status: true,
   note: true,
   createdAt: true,
   completedAt: true
  }
 })
}

export async function getPendingRequests() {
 await requireDbUser()

 return prisma.request.findMany({
  where: {
   status: RequestStatus.PENDING
  },
  orderBy: [
   {
    location: "asc"
   },
   {
    createdAt: "desc"
   }
  ],
  select: {
   id: true,
   type: true,
   location: true,
   description: true,
   status: true,
   createdAt: true
  }
 })
}