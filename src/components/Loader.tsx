import { cn } from "@/lib/utils"
import { LoadingIcon } from "./Icons"

export function Loader({
 className
}: {
 className?: string
}) {
 return (
  <LoadingIcon className={cn("size-16 text-theme animate-spin", className)} />
 )
}