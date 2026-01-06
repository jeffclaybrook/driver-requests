import { STATUS_LABELS, formatDate } from "@/lib/formatters"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"

type RequestCardProps = {
 href: string
 location: string
 date: Date | string
 description: string
 status: "PENDING" | "COMPLETED"
}

export function RequestCard({
 href,
 location,
 date,
 description,
 status
}: RequestCardProps) {
 return (
  <Link href={href} className="cursor-pointer group">
   <Card className="shadow-none group-hover:shadow transition duration-100">
    <CardHeader className="flex flex-row items-center justify-between">
     <CardTitle>{location}</CardTitle>
     <CardDescription>{formatDate(date)}</CardDescription>
    </CardHeader>
    <CardContent>
     <p>{description}</p>
    </CardContent>
    <CardFooter className="justify-end">
     <Badge variant={status === "PENDING" ? "secondary" : "success"}>{STATUS_LABELS[status]}</Badge>
    </CardFooter>
   </Card>
  </Link>
 )
}