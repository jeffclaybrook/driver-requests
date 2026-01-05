import { ReactNode } from "react"
import { UserButton } from "@clerk/nextjs"
import { requireDbUser } from "@/lib/auth"
import { AdminIcon } from "./Icons"
import Image from "next/image"
import Link from "next/link"

export async function Header({
 children
}: {
 children?: ReactNode
}) {
 const user = await requireDbUser()
 const isAdmin = user.role === "ADMIN"

 return (
  <header className="flex items-center justify-between gap-4 absolute top-0 left-0 w-full z-50 p-4 lg:px-6">
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
    {isAdmin ? (
     <UserButton
      appearance={{
       elements: {
        userButtonAvatarBox: "!h-10 !w-10"
       }
      }}
     >
      <UserButton.MenuItems>
       <UserButton.Link
        label="Admin"
        labelIcon={<AdminIcon />}
        href={"/admin"}
       />
      </UserButton.MenuItems>
     </UserButton>
    ) : (
     <UserButton
      appearance={{
       elements: {
        userButtonAvatarBox: "!h-10 !w-10"
       }
      }}
     />
    )}
   </div>
  </header>
 )
}