"use client"

import { useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { markRequestCompleted, undoMarkRequestCompleted } from "@/actions/actions"
import { Button } from "./ui/button"
import { UndoToast } from "./UndoToast"

const TOAST_DURATION_MS = 4000

export function MarkCompleteButton({
 requestId
}: {
 requestId: string
}) {
 const [isPending, startTransition] = useTransition()
 const router = useRouter()
 const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

 const handleClick = () => {
  startTransition(async () => {
   await markRequestCompleted(requestId)

   if (redirectTimeoutRef.current) {
    clearTimeout(redirectTimeoutRef.current)
   }

   redirectTimeoutRef.current = setTimeout(() => {
    router.push("/")
    router.refresh()
   }, TOAST_DURATION_MS)

   toast.custom(
    (t) => (
     <UndoToast
      toastId={t}
      durationMs={TOAST_DURATION_MS}
      onUndo={() => {
       if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
        redirectTimeoutRef.current = null
       }

       startTransition(async () => {
        await undoMarkRequestCompleted(requestId)
        toast.success("Undo successful!")
        router.refresh()
       })
      }}
     />
    ),
    {
     duration: TOAST_DURATION_MS
    }
   )
  })
 }

 return (
  <Button
   type="button"
   disabled={isPending}
   className="w-full h-10 bg-theme hover:bg-theme/90"
   onClick={handleClick}
  >
   Mark Completed
  </Button>
 )
}