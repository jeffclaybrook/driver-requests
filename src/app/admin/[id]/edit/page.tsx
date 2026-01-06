import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackIcon } from "@/components/Icons"
import { RequestForm } from "@/components/RequestForm"
import Link from "next/link"

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
  <main className="p-4 lg:px-6">
   <header className="flex items-center justify-start mb-4">
    <Button
     type="button"
     variant="ghost"
     size="icon"
     aria-label="Back to Admin"
     className="rounded-full"
     asChild
    >
     <Link href={"/admin"}>
      <BackIcon className="size-6" />
      <span className="sr-only">Back to Admin</span>
     </Link>
    </Button>
   </header>
   <Card className="max-w-xl w-full mx-auto shadow-xs">
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