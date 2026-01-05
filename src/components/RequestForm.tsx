"use client"

import { useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { RequestLocation } from "@prisma/client"
import { createRequest, updateRequest, deleteRequest } from "@/actions/actions"
import { requestFormSchema, RequestFormValues } from "@/lib/schema"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { DeleteIcon } from "./Icons"

const locationOptions: { value: RequestLocation; label: string }[] = [
 { value: "FAIRVIEW", label: "Fairview" },
 { value: "GEORGE_BUSH", label: "George Bush" },
 { value: "UNIVERSITY_DRIVE", label: "University Drive" },
 { value: "HIGHWAY_30", label: "Highway 30" },
 { value: "HOTEL", label: "Hotel" },
 { value: "OTHER", label: "Other" }
]

type RequestFormProps = {
 request?: {
  id: string
  location: RequestLocation
  requestedBy: string
  description: string
  completed: boolean
 }
}

export function RequestForm({ request }: RequestFormProps) {
 const [isPending, startTransition] = useTransition()
 const router = useRouter()
 const isEdit = !!request?.id

 const defaultValues: RequestFormValues = useMemo(() => ({
  location: request?.location ?? "FAIRVIEW",
  requestedBy: request?.requestedBy ?? "",
  description: request?.description ?? "",
  completed: request?.completed ?? false
 }), [request])

 const form = useForm<RequestFormValues>({
  resolver: zodResolver(requestFormSchema),
  defaultValues,
  mode: "onSubmit"
 })

 const onSubmit = async (values: RequestFormValues) => {
  startTransition(async () => {
   try {
    if (isEdit && request?.id) {
     await updateRequest({ id: request.id, ...values })
     toast.success("Request updated!")
    } else {
     await createRequest(values)
     toast.success("Request created!")
    }
    router.push("/admin")
    router.refresh()
   } catch (error) {
    console.error(error)
    toast.error("Error submitting request")
   }
  })
 }

 const handleDelete = async () => {
  if (!request?.id) {
   return
  }

  startTransition(async () => {
   try {
    await deleteRequest(request.id)
    router.push("/admin")
    toast.success("Request deleted")
   } catch (error) {
    console.error(error)
    toast.error("Failed to delete request")
   }
  })
 }

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
     control={form.control}
     name="location"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Select Location</FormLabel>
       <Select defaultValue={field.value} onValueChange={field.onChange}>
        <FormControl>
         <SelectTrigger className="w-full">
          <SelectValue placeholder="Select location" />
         </SelectTrigger>
        </FormControl>
        <SelectContent>
         {locationOptions.map((location) => (
          <SelectItem key={location.value} value={location.value}>{location.label}</SelectItem>
         ))}
        </SelectContent>
       </Select>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="requestedBy"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Requested By</FormLabel>
       <FormControl>
        <Input placeholder="Requested by" className="h-10 shadow-none" {...field} />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="description"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Description</FormLabel>
       <FormControl>
        <Textarea placeholder="Description" className="min-h-[100px] shadow-none" {...field} />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="completed"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Status</FormLabel>
       <div className="flex items-center gap-2">
        <FormControl>
         <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
        </FormControl>
        <span className="text-md">Completed?</span>
       </div>
       <FormMessage />
      </FormItem>
     )}
    />
    <div className="flex items-center justify-end gap-4">
     {isEdit ? (
      <AlertDialog>
       <AlertDialogTrigger asChild>
        <Button
         type="button"
         variant="outline"
         className="border-destructive text-destructive"
        >
         <DeleteIcon className="size-6" />
         Delete
        </Button>
       </AlertDialogTrigger>
       <AlertDialogContent>
        <AlertDialogHeader>
         <AlertDialogTitle>Are you sure you want to delete this request?</AlertDialogTitle>
         <AlertDialogDescription>This action cannot be undone and will permanently delete this request.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
         <AlertDialogCancel>Cancel</AlertDialogCancel>
         <AlertDialogAction onClick={() => handleDelete()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>
      </AlertDialog>
     ) : (
      <Button
       type="button"
       variant="ghost"
       onClick={() => router.push("/admin")}
      >
       Cancel
      </Button>
     )}
     <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
    </div>
   </form>
  </Form>
 )
}