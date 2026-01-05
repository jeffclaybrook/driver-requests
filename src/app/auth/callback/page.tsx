import { redirect } from "next/navigation"
import { requireDbUser } from "@/lib/auth"

export default async function AuthCallback() {
 await requireDbUser()

 redirect("/")
}