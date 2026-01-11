import { getRequests } from "@/lib/queries/get-requests"
import { requireAdmin } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { AdminList } from "@/components/AdminList"
import { Header } from "@/components/Header"
import Link from "next/link"

export default async function Admin() {
 await requireAdmin()

 const { requests, nextCursor } = await getRequests({ take: 16 })

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
   <AdminList initialRequests={requests} initialCursor={nextCursor} />
  </main>
 )
}