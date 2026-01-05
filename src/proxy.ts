import { NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/auth/sign-in(.*)"])

export default clerkMiddleware(async (auth, req) => {
 const { userId } = await auth()

 if (!userId && !isPublicRoute(req)) {
  return NextResponse.redirect(new URL("/auth/sign-in", req.url))
 }

 return NextResponse.next()
})

export const config = {
 matcher: [
  "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  "/(api|trpc)(.*)"
 ]
}