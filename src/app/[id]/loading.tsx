import { LoadingIcon } from "@/components/Icons"

export default function RequestLoading() {
 return (
  <main className="flex items-center justify-center h-dvh">
   <LoadingIcon className="size-16 animate-spin" />
  </main>
 )
}