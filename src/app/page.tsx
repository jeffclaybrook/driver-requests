import { getPendingRequests } from "@/lib/queries/get-pending-requests"
import { requireDbUser } from "@/lib/auth"
import { LOCATION_LABELS } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import { RequestCard } from "@/components/RequestCard"
import Link from "next/link"

export default async function Home() {
 const user = await requireDbUser()
 const isAdmin = user.role === "ADMIN"
 const requests = await getPendingRequests()

 return (
  <main>
   <Header>
    {isAdmin && (
     <Button
      type="button"
      variant="ghost"
      asChild
     >
      <Link href={"/admin"}>Admin</Link>
     </Button>
    )}
   </Header>
   {requests.length === 0 ? (
    <section className="flex items-center justify-center h-dvh">
     <p>You&apos;re all caught up!</p>
    </section>
   ) : (
    <section className="grid lg:grid-cols-4 gap-2 lg:gap-4 pt-18 p-4 lg:px-6">
     {requests.map((request) => (
      <RequestCard
       key={request.id}
       href={`/${request.id}`}
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