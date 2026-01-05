import { auth, clerkClient } from "@clerk/nextjs/server"
import { isAdminEmail } from "./admin"
import { prisma } from "./prisma"

export async function requireDbUser() {
 const { userId } = await auth()

 if (!userId) {
  throw new Error("Unauthorized")
 }

 const clerk = await clerkClient()
 const user = await clerk.users.getUser(userId)

 const primaryEmail =
  user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ??
  user.emailAddresses[0]?.emailAddress ??
  null

 const role = isAdminEmail(primaryEmail) ? "ADMIN" : "USER"

 const dbUser = await prisma.user.upsert({
  where: {
   clerkUserId: userId
  },
  update: { role },
  create: {
   clerkUserId: userId,
   role
  },
  select: {
   id: true,
   role: true,
   clerkUserId: true
  }
 })

 if (!dbUser) {
  throw new Error("User not found in database")
 }

 return dbUser
}

export async function requireAdmin() {
 const dbUser = await requireDbUser()

 if (dbUser.role !== "ADMIN") {
  throw new Error("Unauthorized")
 }

 return dbUser
}