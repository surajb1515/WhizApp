"use client"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import ModeToggle from "@/components/mode-toggle"



// This is the header of the conversation
// Right part of the chat page

export default function Header({
  children
}: {
  children: React.ReactNode
}) {


  const { userId } = useAuth()
  const pathname = usePathname()
  const router = useRouter()


  // pathname = /chat/j977yyz1pq9cxxmf9hg200a2j5771wzq
  // grabbing the conversationId form the URL
  const conversationId = pathname?.split("/chat/")?.[1]
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)


  // Get our delete mutation
  const deleteConversation = useMutation(api.chats.deleteConversation)


  async function handleDelete() {
    if (!conversationId || !userId) return;

    try {
      setIsDeleting(true)

      await deleteConversation({
        userId,
        conversationId: conversationId as Id<"conversations">
      })

      toast.success("Chat deleted successfully")
      router.push("/chat")
    } catch (error) {
      toast.error("Failed to delete chat")
      console.error("Error deleting the chat:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteAlert(false)
    }
  }





  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex justify-end w-full space-x-2">

          <div>
            <ModeToggle />
          </div>

          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-red-500 focus-text-red-500"
              >
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="text-white bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {children}
    </div>
  )
}