import { ReactNode } from "react"
import { STATUS_LABELS, formatDate } from "@/lib/formatters"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"

type RequestCardProps = {
 href: string
 location: string
 date: Date | string
 description: string
 children?: ReactNode
 status: "PENDING" | "COMPLETED"
}

export function RequestCard({
 href,
 location,
 date,
 description,
 children,
 status
}: RequestCardProps) {
 return (
  <Link href={href} className="cursor-pointer group">
   <Card className="h-full shadow-none group-hover:shadow-md transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between">
     <CardTitle>{location}</CardTitle>
     <CardDescription>{formatDate(date)}</CardDescription>
    </CardHeader>
    <CardContent>
     <p className="line-clamp-2">{description}</p>
    </CardContent>
    <CardFooter className="justify-end gap-3 mt-auto">
     {children && children}
     <Badge variant={status === "PENDING" ? "secondary" : "success"}>{STATUS_LABELS[status]}</Badge>
    </CardFooter>
   </Card>
  </Link>
 )
}