import { getRequestsForAdmin } from "@/lib/queries/requests"
import { requireAdmin } from "@/lib/auth"
import { LOCATION_LABELS } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { RequestCard } from "@/components/RequestCard"
import Link from "next/link"

export default async function Home() {
 await requireAdmin()

 const requests = await getRequestsForAdmin()

 return (
  <main>
   <Header>
    <Button type="button" asChild>
     <Link href={"/admin/create"}>Create Request</Link>
    </Button>
   </Header>
   {requests.length === 0 ? (
    <section className="flex items-center justify-center h-dvh">
     <p>You&apos;re all caught up!</p>
    </section>
   ) : (
    <section className="grid lg:grid-cols-4 gap-2 lg:gap-4 pt-16 p-2 lg:px-4">
     {requests.map((request) => (
      <RequestCard
       key={request.id}
       href={`/admin/${request.id}/edit`}
       location={LOCATION_LABELS[request.location]}
       date={request.createdAt}
       description={request.description}
       status={request.status}
      />
     ))}
    </section>
   )}
  </main>
 )
}