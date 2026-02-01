import { notFound } from "next/navigation"
import { getRequestById } from "@/actions/requests"
import { requireDbUser } from "@/lib/auth"
import { LOCATION_LABELS, STATUS_LABELS, TYPE_LABELS, formatDate } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BackIcon } from "@/components/Icons"
import { MarkCompleteButton } from "@/components/MarkCompleteButton"
import { NoteForm } from "@/components/NoteForm"
import Link from "next/link"

export default async function Request({
 params
}: {
 params: Promise<{ id: string }>
}) {
 await requireDbUser()

 const { id } = await params
 const request = await getRequestById(id)

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
     aria-label="Back to Home"
     className="rounded-full"
     asChild
    >
     <Link href={"/"}>
      <BackIcon className="size-6" />
      <span className="sr-only">Back to Home</span>
     </Link>
    </Button>
   </header>
   <Card className="max-w-lg w-full mx-auto shadow-xs">
    <CardHeader>
     <CardTitle className="text-2xl font-semibold text-center">{TYPE_LABELS[request.type]} Request</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
     <div className="space-y-1">
      <CardDescription>Request type:</CardDescription>
      <p className="font-medium">{TYPE_LABELS[request.type]}</p>
     </div>
     <div className="space-y-1">
      <CardDescription>Location:</CardDescription>
      <p className="font-medium">{LOCATION_LABELS[request.location]}</p>
     </div>
     <div className="space-y-1">
      <CardDescription>Status:</CardDescription>
      <Badge variant="secondary">{STATUS_LABELS[request.status]}</Badge>
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
     <NoteForm requestId={request.id} initialNote={request.note} />
    </CardContent>
    <CardFooter>
     <MarkCompleteButton requestId={request.id} />
    </CardFooter>
   </Card>
  </main>
 )
}