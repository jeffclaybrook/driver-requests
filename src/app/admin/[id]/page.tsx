import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LOCATION_LABELS, STATUS_LABELS, formatDate } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BackIcon, EditIcon } from "@/components/Icons"
import Link from "next/link"

export default async function Request({
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
   createdAt: true,
   description: true,
   status: true,
   note: true
  }
 })

 if (!request) {
  return notFound()
 }

 return (
  <main className="p-4 lg:px-6">
   <header className="flex items-center justify-between gap-4 mb-4">
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
    <Button
     type="button"
     className="bg-theme hover:bg-theme/90"
     asChild
    >
     <Link href={`/admin/${request.id}/edit`}>
      <EditIcon className="size-5" />
      Edit
     </Link>
    </Button>
   </header>
   <Card className="max-w-lg w-full mx-auto shadow-xs">
    <CardHeader>
     <CardTitle className="text-2xl font-semibold text-center">Driver Request</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
     <div className="space-y-1">
      <CardDescription>Location:</CardDescription>
      <p className="font-medium">{LOCATION_LABELS[request.location]}</p>
     </div>
     <div className="space-y-1">
      <CardDescription>Status:</CardDescription>
      <Badge variant={request.status === "PENDING" ? "secondary" : "success"}>{STATUS_LABELS[request.status]}</Badge>
     </div>
     <div className="space-y-1">
      <CardDescription>Date:</CardDescription>
      <p className="font-medium">{formatDate(request.createdAt)}</p>
     </div>
     <div className="space-y-1">
      <CardDescription>Requested By:</CardDescription>
      <p className="font-medium">{request.requestedBy}</p>
     </div>
     <div className="space-y-1">
      <CardDescription>Description:</CardDescription>
      <p className="font-medium">{request.description}</p>
     </div>
     {request.note && request.note.trim().length > 0 && (
      <div className="space-y-1">
       <CardDescription>Notes:</CardDescription>
       <p className="font-medium">{request.note}</p>
      </div>
     )}
    </CardContent>
   </Card>
  </main>
 )
}