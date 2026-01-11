"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { getRequests } from "@/lib/queries/get-requests"
import { LOCATION_LABELS } from "@/lib/formatters"
import { RequestCard } from "./RequestCard"
import { NoteIcon } from "./Icons"
import { Loader } from "./Loader"

type RequestItem = Awaited<ReturnType<typeof getRequests>>["requests"][number]

export function AdminList({
 initialRequests,
 initialCursor
}: {
 initialRequests: RequestItem[]
 initialCursor: string | null
}) {
 const [requests, setRequests] = useState<RequestItem[]>(initialRequests)
 const [cursor, setCursor] = useState<string | null>(initialCursor)
 const [hasMore, setHasMore] = useState<boolean>(initialCursor !== null)
 const [isPending, startTransition] = useTransition()
 const scrollRef = useRef<HTMLDivElement | null>(null)

 const loadMore = () => {
  if (!hasMore || isPending) {
   return
  }

  startTransition(async () => {
   try {
    const res = await getRequests({ cursor, take: 16 })
    setRequests((prev) => [...prev, ...res.requests])
    setCursor(res.nextCursor)
    setHasMore(res.nextCursor !== null)
   } catch (error) {
    console.error(error)
    toast.error("Failed to load more requests.")
   }
  })
 }

 useEffect(() => {
  const el = scrollRef.current

  if (!el) {
   return
  }

  const observer = new IntersectionObserver(
   (entries) => {
    if (entries[0]?.isIntersecting) {
     loadMore()
    }
   },
   {
    root: null,
    rootMargin: "600px",
    threshold: 0
   }
  )

  observer.observe(el)

  return () => observer.disconnect()
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [cursor, hasMore])

 if (requests.length === 0) {
  return (
   <section className="flex items-center justify-center h-dvh">
    <p>You&apos;re all caught up!</p>
   </section>
  )
 }

 return (
  <>
   <section className="grid lg:grid-cols-4 gap-4 pt-18 pb-4 px-2 lg:px-6">
    {requests.map((request) => (
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
   <div ref={scrollRef} className="h-10" />
   {hasMore && isPending && (
    <div className="flex items-center justify-center pb-6">
     <Loader className="size-10" />
    </div>
   )}
  </>
 )
}