
// search or + new chat button/component

'use client'
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueries, useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import debounce from 'lodash/debounce'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquareMore, Plus, Search, Users2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import SekeletonComponent from "./skeleton"







export default function SearchComponent({
  onSidebar
}: {
  onSidebar: boolean
}) {


  const { userId } = useAuth()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedTerm, setDebouncedTerm] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()


  const createConversation = useMutation(api.chats.createOrGetConversationId)


  const debouncedSearch = useCallback(
    // Debounce function that delays executing the search
    debounce((term: string) => {
      // startTransition allows React to prioritize urgent updates
      startTransition(() => {
        // Update the search term after a delay
        setDebouncedTerm(term)
      })
    }, 300),
    [],
  )


  const searchResultsUsers = useQuery(api.users.searchUsers, {
    searchTerm: debouncedTerm,
    currentUserId: userId || ""
  })



  // This function will be executed 
  // when user will click on the he/she wants to chat with
  async function handleStartChat(selectedUserId: string) {
    try {
      const conversationId = await createConversation({
        currentUserId: userId!,
        participantUserId: selectedUserId
      })

      setIsOpen(false)
      router.push(`/chat/${conversationId}`)
    } catch (error) {
      console.error("Error creating conversation" + error)
    }
  }


  // onChange on the search input
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchTerm(value)
    debouncedSearch(value)
  }



  // Prepare skeleton items for loading state
  const SkeletonItem = () => (
    <div className="flex items-center px-4 py-3 animate-pulse">
      <div className="w-12 h-12 mr-3 rounded-full" />
      <div className="flex-1">
        <div className="w-1/3 h-4 mb-2 rounded" />
        <div className="w-1/2 h-3 rounded" />
      </div>
    </div>
  )


  return (

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {onSidebar
          ?
          <Button variant='ghost' size='icon'>
            <Plus className="w-5 h-5" />
          </Button>
          :
          <div className="">
            <Button className="">
              Bother Somebody
            </Button>
          </div>
        }
      </DialogTrigger>

      <DialogContent className="w-full max-w-[380px] p-0 ">
        <DialogTitle></DialogTitle>

        <DialogHeader className="p-0">


          {/* Header */}
          <div className="flex items-center gap-4 p-2">
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={() => setIsOpen(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-base font-medium ">New Chat</h2>
          </div>


          {/* Search  */}
          <div className="p-4 space-y-2">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                className="peer pe-9 ps-9"
                placeholder="Search... via (name or email)"
              />
              <div className="absolute inset-y-0 flex items-center justify-center pointer-events-none start-0 ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Search
                  size={16}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>


          {/* Results with fixed height container */}
          <div className="overflow-y-auto max-h-[400px] min-h-[300px]">
            {isPending
              ? <SekeletonComponent />
              :
              <>
                {searchResultsUsers?.map((user) => (
                  <div
                    key={user.userId}
                    onClick={() => handleStartChat(user.userId)}
                    className="flex items-center px-4 py-3 transition-colors rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <Avatar className="w-12 h-12 mr-3">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback className="">
                        <Users2 className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-normal truncate ">
                        {user.name}
                      </h3>
                    </div>
                  </div>
                ))}

                {searchResultsUsers?.length === 0 && debouncedTerm && (
                  <div className="p-4 text-center text-[#8696A0]">
                    No contacts found
                  </div>
                )}

                {!debouncedTerm && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[#8696A0] text-sm">
                      Search for users to start a new chat
                    </p>
                  </div>
                )}
              </>
            }
          </div>
        </DialogHeader>

      </DialogContent>
    </Dialog >
  )
}