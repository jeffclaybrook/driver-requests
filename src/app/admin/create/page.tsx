import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RequestForm } from "@/components/RequestForm"

export default function Create() {
 return (
  <main className="p-4 lg:p-6">
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