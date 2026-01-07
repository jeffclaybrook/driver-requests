"use server"

import { RequestStatus } from "@prisma/client"
import { requireDbUser } from "../auth"
import { prisma } from "../prisma"

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
   location: true,
   description: true,
   status: true,
   createdAt: true
  }
 })
}