"use server"

import { requireDbUser } from "../auth"
import { prisma } from "../prisma"

export async function getRequestById(id: string) {
 await requireDbUser()

 return prisma.request.findUnique({
  where: { id },
  select: {
   id: true,
   location: true,
   requestedBy: true,
   description: true,
   status: true,
   createdAt: true,
   completedAt: true
  }
 })
}