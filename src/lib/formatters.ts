import { RequestLocation, RequestStatus, RequestType } from "@prisma/client"

export function formatDate(date: Date | string) {
 const input = typeof date === "string"
  ? new Date(date)
  : date
  
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

export function formatLocation(location: string) {
 return location
  .toLowerCase()
  .split("_")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")
}

export function formatType(type: string) {
 if (!type) {
  return type
 }

 return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

export const LOCATION_LABELS: Record<RequestLocation, string> = {
 FAIRVIEW: "Fairview",
 GEORGE_BUSH: "Geroge Bush",
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

export const TYPE_LABELS: Record<RequestType, string> = {
 DRIVER: "Driver",
 MAINTENANCE: "Maintenance"
}