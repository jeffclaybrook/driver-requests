import { getRequests } from "@/actions/requests"
import { requireAdmin } from "@/lib/auth"
import { LOCATION_LABELS } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/Header"
import { NoteIcon } from "@/components/Icons"
import { RequestCard } from "@/components/RequestCard"
import Link from "next/link"

export default async function Admin() {
 await requireAdmin()

 const requests = await getRequests()

 const driverRequests = requests.filter(
  request => request.type === "DRIVER"
 )

 const maintenanceRequests = requests.filter(
  request => request.type === "MAINTENANCE"
 )

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
   <Tabs defaultValue="driver">
    <TabsList className="w-full bg-background group-data-[orientation=horizontal]/tabs:h-12">
     <TabsTrigger value="driver" className="cursor-pointer border-0 border-b-1 rounded-none rounded-t-md hover:text-foreground/80 hover:bg-theme/10 data-[state=active]:hover:bg-theme/10 data-[state=active]:text-theme group-data-[variant=default]/tabs-list:data-[state=active]:border-theme group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none">Driver</TabsTrigger>
     <TabsTrigger value="maintenance" className="cursor-pointer border-0 border-b-1 rounded-none rounded-t-md hover:text-foreground/80 hover:bg-theme/10 data-[state=active]:hover:bg-theme/10 data-[state=active]:text-theme group-data-[variant=default]/tabs-list:data-[state=active]:border-theme group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none">Maintenance</TabsTrigger>
    </TabsList>
    <TabsContent value="driver">
     {driverRequests.length === 0 ? (
      <section className="flex items-center justify-center pt-48">
       <p>You&apos;re all caught up!</p>
      </section>
     ) : (
      <section className="grid lg:grid-cols-4 gap-4 py-4 px-2 lg:px-6">
       {driverRequests.map((request) => (
        <RequestCard
         key={request.id}
         href={`/admin/${request.id}`}
         location={LOCATION_LABELS[request.location]}
         date={request.createdAt}
         description={request.description}
         status={request.status}
        >
         {request.note && <NoteIcon className="size-5" />}
        </RequestCard>
       ))}
      </section>
     )}
    </TabsContent>
    <TabsContent value="maintenance">
     {maintenanceRequests.length === 0 ? (
      <section className="flex items-center justify-center pt-48">
       <p>You&apos;re all caught up!</p>
      </section>
     ) : (
      <section className="grid lg:grid-cols-4 gap-4 py-4 px-2 lg:px-6">
       {maintenanceRequests.map((request) => (
        <RequestCard
         key={request.id}
         href={`/admin/${request.id}`}
         location={LOCATION_LABELS[request.location]}
         date={request.createdAt}
         description={request.description}
         status={request.status}
        >
         {request.note && <NoteIcon className="size-5" />}
        </RequestCard>
       ))}
      </section>
     )}
    </TabsContent>
   </Tabs>
  </main>
 )
}