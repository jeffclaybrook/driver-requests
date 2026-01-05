import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RequestForm } from "@/components/RequestForm"

export default async function Edit({
 params
}: {
 params: Promise<{ id: string }>
}) {
 await requireAdmin()

 const { id } = await params

 const request = await prisma.request.findUnique({
  where: { id },
  select: {
   id: true,
   location: true,
   requestedBy: true,
   description: true,
   status: true
  }
 })

 if (!request) {
  return notFound()
 }

 return (
  <main className="p-4 lg:p-6">
   <Card className="max-w-xl w-full mx-auto">
    <CardHeader>
     <CardTitle className="text-2xl font-semibold text-center">Edit Request</CardTitle>
    </CardHeader>
    <CardContent>
     <RequestForm
      request={{
       id: request.id,
       location: request.location,
       requestedBy: request.requestedBy,
       description: request.description,
       completed: request.status === "COMPLETED"
      }}
     />
    </CardContent>
   </Card>
  </main>
 )
}