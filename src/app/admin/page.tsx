import { getRequests } from "@/lib/queries/get-requests"
import { requireAdmin } from "@/lib/auth"
import { LOCATION_LABELS } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { NoteIcon } from "@/components/Icons"
import { RequestCard } from "@/components/RequestCard"
import Link from "next/link"

export default async function Admin() {
 await requireAdmin()

 const requests = await getRequests()

 return (
  <main>
   <Header>
    <Button
     type="button"
     className="bg-theme hover:bg-theme/90"
     asChild
    >
     <Link href={"/admin/create"}>Create Request</Link>
    </Button>
   </Header>
   {requests.length === 0 ? (
    <section className="flex items-center justify-center h-dvh">
     <p>You&apos;re all caught up!</p>
    </section>
   ) : (
    <section className="grid lg:grid-cols-4 gap-4 pt-18 pb-4 px-2 lg:px-6">
     {requests.map((request) => (
      <RequestCard
       key={request.id}
       href={`/admin/${request.id}`}
       location={LOCATION_LABELS[request.location]}
       date={request.createdAt}
       description={request.description}
       status={request.status}
      >
       {request.note && (
        <NoteIcon className="size-5" />
       )}
      </RequestCard>
     ))}
    </section>
   )}
  </main>
 )
}