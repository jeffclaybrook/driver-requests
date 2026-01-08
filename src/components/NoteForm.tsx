"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createNote } from "@/actions/actions"
import { noteFormSchema, NoteFormValues } from "@/lib/schema"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Textarea } from "./ui/textarea"

export function NoteForm({
 requestId,
 initialNote
}: {
 requestId: string
 initialNote: string | null
}) {
 const [isPending, startTransition] = useTransition()
 const router = useRouter()

 const form = useForm<NoteFormValues>({
  resolver: zodResolver(noteFormSchema),
  defaultValues: {
   note: initialNote ?? ""
  },
  mode: "onSubmit"
 })

 const onSubmit = async (values: NoteFormValues) => {
  startTransition(async () => {
   try {
    await createNote({ requestId, note: values.note ?? "" })
    toast.success("Note created!")
    router.refresh()
   } catch (error) {
    console.error(error)
    toast.error("Error creating note")
   }
  })
 }

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
    <FormField
     control={form.control}
     name="note"
     render={({ field }) => (
      <FormItem>
       <FormLabel className="text-muted-foreground text-sm font-normal">Notes: (optional)</FormLabel>
       <FormControl>
        <Textarea
         {...field}
         value={field.value ?? ""}
         disabled={isPending}
         placeholder="Notes"
         className="min-h-[100px] shadow-none md:text-base resize-none"
        />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <div className="flex items-center justify-end absolute right-1 bottom-1">
     <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={isPending}
     >
      {isPending ? "Saving..." : "Save"}
     </Button>
    </div>
   </form>
  </Form>
 )
}