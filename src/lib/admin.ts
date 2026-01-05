export function isAdminEmail(email: string | null | undefined) {
 if (!email) {
  return null
 }

 const allowed = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

 return allowed.includes(email.trim().toLowerCase())
}