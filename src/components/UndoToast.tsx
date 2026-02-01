"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"

export function UndoToast({
 toastId,
 durationMs,
 onUndo
}: {
 toastId: string | number
 durationMs: number
 onUndo: () => void
}) {
 const [progress, setProgress] = useState<number>(100)
 const startRef = useRef<number>(0)
 const rafRef = useRef<number | null>(null)

 useEffect(() => {
  startRef.current = performance.now()

  const tick = () => {
   const elapsed = performance.now() - startRef.current
   const next = Math.max(0, 100 - (elapsed / durationMs) * 100)

   setProgress(next)

   if (elapsed < durationMs) {
    rafRef.current = requestAnimationFrame(tick)
   }
  }

  rafRef.current = requestAnimationFrame(tick)

  return () => {
   if (rafRef.current) {
    cancelAnimationFrame(rafRef.current)
   }
  }
 }, [durationMs])

 return (
  <div className="w-[356px] rounded-lg bg-success-bg shadow-sm border border-success-border border-b-0 overflow-hidden">
   <div className="flex items-center justify-between gap-1.5 p-4 pb-0">
    <p className="text-sm text-success-text font-medium">Requested completed!</p>
    <Button
     type="button"
     variant="ghost"
     size="sm"
     className="hover:bg-success-text/10"
     onClick={() => {
      onUndo()
      toast.dismiss(toastId)
     }}
    >
     Undo
    </Button>
   </div>
   <div className="mt-3">
    <Progress value={progress} className="h-1" />
   </div>
  </div>
 )
}