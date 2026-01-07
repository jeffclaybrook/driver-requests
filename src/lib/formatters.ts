import { RequestLocation, RequestStatus } from "@prisma/client"

export function formatDate(date: Date | string) {
 const input = typeof date === "string" ? new Date(date) : date
 const today = new Date()

 const startOfToday = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
 )

 const startOfYesterday = new Date(startOfToday)

 startOfYesterday.setDate(startOfYesterday.getDate() - 1)

 if (input >= startOfToday) {
  return "Today"
 }

 if (input >= startOfYesterday) {
  return "Yesterday"
 }

 const month = String(input.getMonth() + 1).padStart(2, "0")
 const day = String(input.getDate()).padStart(2, "0")
 const year = input.getFullYear()

 return `${month}/${day}/${year}`
}

export const LOCATION_LABELS: Record<RequestLocation, string> = {
 FAIRVIEW: "Fariview",
 GEORGE_BUSH: "George Bush",
 UNIVERSITY_DRIVE: "University Drive",
 HIGHWAY_30: "Highway 30",
 HOTEL: "Hotel",
 SCREENED_IMAGES: "Screened Images",
 OTHER: "Other"
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
 PENDING: "Pending",
 COMPLETED: "Completed"
}