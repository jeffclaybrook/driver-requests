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
 const grouped = Object.groupBy(requests, (request) => request.location)

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
    <section className="pt-18 p-4 lg:px-6 space-y-10">
     {Object.entries(grouped).map(([location, items]) => (
      <div key={location}>
       <h2 className="text-lg font-semibold mb-2">{location}</h2>
       <div className="grid lg:grid-cols-4 gap-2 lg:gap-4">
        {items.map((item) => (
         <RequestCard
          key={item.id}
          href={`/${item.id}`}
          location={LOCATION_LABELS[item.location]}
          date={item.createdAt}
          description={item.description}
          status={item.status}
         />
        ))}
       </div>
      </div>
     ))}
    </section>
   )}
  </main>
 )
}