"use client"

import { useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { RequestLocation, RequestType } from "@prisma/client"
import { createRequest, updateRequest, deleteRequest } from "@/actions/requests"
import { requestFormSchema, RequestFormValues } from "@/lib/schema"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { DeleteIcon } from "./Icons"

const typeOptions: { value: RequestType; label: string }[] = [
 { value: "DRIVER", label: "Driver" },
 { value: "MAINTENANCE", label: "Mainenance" }
]

const locationOptions: { value: RequestLocation; label: string }[] = [
 { value: "FAIRVIEW", label: "Fairview" },
 { value: "GEORGE_BUSH", label: "George Bush" },
 { value: "UNIVERSITY_DRIVE", label: "University Drive" },
 { value: "HIGHWAY_30", label: "Highway 30" },
 { value: "HOTEL", label: "Hotel" },
 { value: "SCREENED_IMAGES", label: "Screened Images" },
 { value: "OTHER", label: "Other" }
]

type RequestFormProps = {
 request?: {
  id: string
  type: RequestType
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
  type: request?.type ?? "DRIVER",
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
     name="type"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Select request type</FormLabel>
       <Select defaultValue={field.value} onValueChange={field.onChange}>
        <FormControl>
         <SelectTrigger className="w-full md:text-base">
          <SelectValue placeholder="Select type" />
         </SelectTrigger>
        </FormControl>
        <SelectContent>
         {typeOptions.map((type) => (
          <SelectItem
           key={type.value}
           value={type.value}
           className="md:text-base"
          >
           {type.label}
          </SelectItem>
         ))}
        </SelectContent>
       </Select>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="location"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Select request location</FormLabel>
       <Select defaultValue={field.value} onValueChange={field.onChange}>
        <FormControl>
         <SelectTrigger className="w-full md:text-base">
          <SelectValue placeholder="Select location" />
         </SelectTrigger>
        </FormControl>
        <SelectContent>
         {locationOptions.map((location) => (
          <SelectItem
           key={location.value}
           value={location.value}
           className="md:text-base"
          >
           {location.label}
          </SelectItem>
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
       <FormLabel>Requested by</FormLabel>
       <FormControl>
        <Input placeholder="Requested by" className="h-12 shadow-none md:text-base" {...field} />
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
        <Textarea placeholder="Description" className="min-h-[100px] shadow-none md:text-base" {...field} />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    {isEdit && (
     <FormField
      control={form.control}
      name="completed"
      render={({ field }) => (
       <FormItem>
        <span className="flex items-center gap-2 text-sm leading-none font-medium select-none">Status</span>
        <div className="flex items-center gap-2">
         <FormControl>
          <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
         </FormControl>
         <FormLabel className="text-md font-normal">Completed?</FormLabel>
        </div>
        <FormMessage />
       </FormItem>
      )}
     />
    )}
    <div className="flex items-center justify-end gap-4">
     {isEdit ? (
      <AlertDialog>
       <AlertDialogTrigger asChild>
        <Button
         type="button"
         variant="outline"
         disabled={isPending}
         className="border-destructive text-destructive hover:border-destructive hover:bg-destructive hover:text-white"
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
        <AlertDialogFooter className="sm:gap-4">
         <AlertDialogCancel>Cancel</AlertDialogCancel>
         <AlertDialogAction
          className="bg-destructive text-white hover:bg-destructive/90"
          onClick={() => handleDelete()}
         >
          <DeleteIcon className="size-6" />
          Delete
         </AlertDialogAction>
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
     <Button
      type="submit"
      disabled={isPending}
      className="bg-theme hover:bg-theme/90"
     >
      {isPending ? "Saving..." : "Save"}
     </Button>
    </div>
   </form>
  </Form>
 )
}