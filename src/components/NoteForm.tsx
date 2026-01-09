"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createNote } from "@/actions/actions"
import { noteFormSchema, NoteFormValues } from "@/lib/schema"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Textarea } from "./ui/textarea"
import { AddIcon, EditIcon } from "./Icons"

export function NoteForm({
 requestId,
 initialNote
}: {
 requestId: string
 initialNote: string | null
}) {
 const [open, setOpen] = useState<boolean>(false)
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
    toast.success(initialNote ? "Note updated!" : "Note created!")
    router.refresh()
   } catch (error) {
    console.error(error)
    toast.error("Error creating note")
   }
  })
 }

 return (
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogTrigger asChild>
    <Button
     type="button"
     variant="outline"
     className="text-theme hover:text-theme gap-1"
    >
     {initialNote ? (
      <>
       <EditIcon className="size-5" />
       Edit Note
      </>
     ) : (
      <>
       <AddIcon className="size-5" />
       Add Note
      </>
     )}
    </Button>
   </DialogTrigger>
   <DialogContent>
    <DialogHeader>
     <DialogTitle>{initialNote ? "Edit Note" : "Add Note"}</DialogTitle>
    </DialogHeader>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)}>
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
      <DialogFooter className="flex items-center justify-end gap-4 mt-4">
       <DialogClose asChild>
        <Button type="button" variant="outline">Cancel</Button>
       </DialogClose>
       <Button
        type="submit"
        onClick={() => setOpen(false)}
        disabled={isPending}
        className="bg-theme hover:bg-theme/90"
       >
        {isPending ? "Saving..." : "Save"}
       </Button>
      </DialogFooter>
     </form>
    </Form>
   </DialogContent>
  </Dialog>
 )
}