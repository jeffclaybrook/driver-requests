import { notFound } from "next/navigation"
import { getRequestById } from "@/lib/queries/requests"
import { requireDbUser } from "@/lib/auth"
import { LOCATION_LABELS, STATUS_LABELS, formatDate } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkCompleteButton } from "@/components/MarkCompleteButton"

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
  <main className="p-4 lg:p-6">
   <Card className="max-w-xl w-full mx-auto">
    <CardHeader>
     <CardTitle className="text-2xl font-semibold text-center">Driver Request</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
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
    </CardContent>
    {request.status === "PENDING" && (
     <CardFooter>
      <MarkCompleteButton requestId={request.id} />
     </CardFooter>
    )}
   </Card>
  </main>
 )
}