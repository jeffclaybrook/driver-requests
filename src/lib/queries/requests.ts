"use server"

import { RequestStatus } from "@prisma/client"
import { requireAdmin, requireDbUser } from "../auth"
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

export async function getRequestsForDriver() {
 await requireDbUser()

 return prisma.request.findMany({
  where: {
   status: RequestStatus.PENDING
  },
  orderBy: {
   createdAt: "desc"
  },
  select: {
   id: true,
   location: true,
   description: true,
   status: true,
   createdAt: true
  }
 })
}

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