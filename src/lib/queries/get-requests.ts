"use server"

import { requireAdmin } from "../auth"
import { prisma } from "../prisma"

const PAGE_SIZE = 16

export async function getRequests(
 input?: {
  cursor?: string | null
  take?: number
 }
) {
 await requireAdmin()

 const take = input?.take ?? PAGE_SIZE
 const cursor = input?.cursor ?? null

 const requests = await prisma.request.findMany({
  take,
  ...(cursor
   ? {
    cursor: { id: cursor },
    skip: 1
   }
   : {}
  ),
  orderBy: [
   { status: "asc" },
   { createdAt: "desc" },
   { id: "desc" }
  ],
  select: {
   id: true,
   location: true,
   description: true,
   status: true,
   note: true,
   createdAt: true,
   updatedAt: true
  }
 })

 const nextCursor = requests.length === take ? requests[requests.length - 1].id : null

 return { requests, nextCursor }
}