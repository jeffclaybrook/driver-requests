import { ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

export function Header({
 children
}: {
 children?: ReactNode
}) {
 return (
  <header className="flex items-center justify-between gap-4 relative z-50 p-4 lg:px-6">
   <Link href={"/"} aria-label="Home">
    <Image
     src="/logo.jpeg"
     alt="Aggieland Outfitters logo"
     width={40}
     height={40}
     priority
    />
   </Link>
   <div className="flex items-center justify-end gap-4 flex-1">
    {children && children}
    <UserButton
     appearance={{
      elements: {
       userButtonAvatarBox: "!h-10 !w-10"
      }
     }}
    />
   </div>
  </header>
 )
}