"use server"

import { requireAdmin } from "../auth"
import { prisma } from "../prisma"

export async function getRequestsForAdmin() {
 await requireAdmin()

 return prisma.request.findMany({
  orderBy: {
   createdAt: "desc"
  },
  select: {
   id: true,
   location: true,
   description: true,
   status: true,
   createdAt: true,
   updatedAt: true
  }
 })
}