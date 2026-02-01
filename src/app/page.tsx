import { getPendingRequests } from "@/actions/requests"
import { requireDbUser } from "@/lib/auth"
import { LOCATION_LABELS, formatLocation } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/Header"
import { RequestCard } from "@/components/RequestCard"
import Link from "next/link"

export default async function Home() {
 const user = await requireDbUser()
 const requests = await getPendingRequests()
 const isAdmin = user.role === "ADMIN"

 const driverRequests = requests.filter(
  request => request.type === "DRIVER"
 )

 const maintenanceRequests = requests.filter(
  request => request.type === "MAINTENANCE"
 )

 const groupedDriverRequests = Object.groupBy(
  driverRequests, (request) => request.location
 )

 const groupedMaintenanceRequests = Object.groupBy(
  maintenanceRequests, (request) => request.location
 )

 return (
  <main>
   <Header>
    {isAdmin && (
     <Button
      type="button"
      variant="ghost"
      className="text-theme"
      asChild
     >
      <Link href={"/admin"}>Admin</Link>
     </Button>
    )}
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
      <section className="py-4 px-2 lg:px-6 space-y-10">
       {Object.entries(groupedDriverRequests).map(([location, items]) => (
        <div key={location}>
         <h2 className="text-lg font-semibold mb-2">{formatLocation(location)}</h2>
         <div className="grid lg:grid-cols-4 gap-4">
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
    </TabsContent>
    <TabsContent value="maintenance">
     {maintenanceRequests.length === 0 ? (
      <section className="flex items-center justify-center pt-48">
       <p>You&apos;re all caught up!</p>
      </section>
     ) : (
      <section className="py-4 px-2 lg:px-6 space-y-10">
       {Object.entries(groupedMaintenanceRequests).map(([location, items]) => (
        <div key={location}>
         <h2 className="text-lg font-semibold mb-2">{formatLocation(location)}</h2>
         <div className="grid lg:grid-cols-4 gap-4">
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
    </TabsContent>
   </Tabs>
  </main>
 )
}