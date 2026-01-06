import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackIcon } from "@/components/Icons"
import { RequestForm } from "@/components/RequestForm"
import Link from "next/link"

export default function Create() {
 return (
  <main className="p-4 lg:px-6">
   <header className="flex items-center justify-start mb-4">
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
   </header>
   <Card className="max-w-xl w-full mx-auto">
    <CardHeader>
     <CardTitle className="text-2xl font-semibold text-center">Create Request</CardTitle>
    </CardHeader>
    <CardContent>
     <RequestForm />
    </CardContent>
   </Card>
  </main>
 )
}