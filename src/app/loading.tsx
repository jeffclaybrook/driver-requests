import { LoadingIcon } from "@/components/Icons"

export default function HomeLoading() {
 return (
  <main className="flex items-center justify-center h-dvh">
   <LoadingIcon className="size-16 text-theme animate-spin" />
  </main>
 )
}