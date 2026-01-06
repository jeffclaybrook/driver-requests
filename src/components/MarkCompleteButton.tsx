"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { markRequestCompleted, undoMarkRequestCompleted } from "@/actions/actions"
import { Button } from "./ui/button"

export function MarkCompleteButton({
 requestId
}: {
 requestId: string
}) {
 const [isPending, startTransition] = useTransition()

 const handleClick = () => {
  startTransition(async () => {
   await markRequestCompleted(requestId)
   toast.success("Request completed!", {
    action: {
     label: "Undo",
     onClick: () => {
      startTransition(async () => {
       await undoMarkRequestCompleted(requestId)
      })
     }
    }
   })
   window.location.href = "/"
  })
 }

 return (
  <Button
   type="button"
   disabled={isPending}
   className="w-full"
   onClick={handleClick}
  >
   Mark Completed
  </Button>
 )
}