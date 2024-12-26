// client component by default as its parent is client component
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { Avatar } from "@radix-ui/react-avatar"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { MoreVertical, Search, Users2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import SearchComponent from "./search"
import { Input } from "@/components/ui/input"




export default function Sidebar({
  preloadedUserInfo,
  preloadedConversations
}: {
  preloadedUserInfo: Preloaded<typeof api.users.readUser>;
  preloadedConversations: Preloaded<typeof api.chats.getConversation>
}) {


  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { signOut } = useAuth()
  const router = useRouter()

  const userInfo = usePreloadedQuery(preloadedUserInfo)
  const conversations = usePreloadedQuery(preloadedConversations)



  // filtering the conversations based on the searchQuery 
  // which is given by the user
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations

    return conversations?.
      filter((chat) => {
        const matchesName = chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesMessage = chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesName || matchesMessage
      }).sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase())
        const bNameMatch = b.name.toLowerCase().includes(searchQuery.toLowerCase())

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1

        return 0
      })


  }, [searchQuery, conversations])








  return (

    <div className="w-[150px] md:w-1/4 h-screen flex flex-col border-r border-border ">


      {/* Header */}
      <div className="shrink-0 px-3 py-[10px] md:py-[14px] flex justify-center md:justify-between items-center">
        <Link href="/profile">
          <Avatar>
            <AvatarImage className="w-8 h-8 rounded-full md:w-9 md:h-9" src={userInfo?.profileImage} alt="Your avatar" />
          </Avatar>
        </Link>
        <div className="items-center justify-center hidden gap-2 md:flex">
          <SearchComponent onSidebar={true} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                signOut()
                router.push("/")
              }}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


      {/* Search Input */}
      <div className="p-4 space-y-2">
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="peer pe-9 ps-9"
            placeholder="Search chats via (name)"
          />
          <div className="absolute inset-y-0 flex items-center justify-center pointer-events-none start-0 ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search
              size={16}
              strokeWidth={2}
            />
          </div>
        </div>
      </div>


      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.map((chat) => (
          <Link
            href={`/chat/${chat.id}`}
            key={chat.id}
          >
            <div
              className={`flex items-center px-2 py-2 md:px-3 md:py-3 hover:bg-accent cursor-pointer
                  ${pathname.split("/")?.[2] === chat?.id ? "bg-accent" : ""}
                `}>
              <div className="relative">
                <Avatar>
                  <AvatarImage className="w-12 h-12 rounded-full" src={chat?.chatImage} />
                  <AvatarFallback className="bg-[#6B7C85]">
                    <Users2 className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Conversation details - Only visible on md and larger screens */}
              <div className="flex-1 hidden min-w-0 ml-3 md:block">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-base font-normal truncate ">
                    <HighlightText text={chat.name} searchQuery={searchQuery} />
                  </h2>
                  <span className="text-[#8696A0] text-xs ml-2 shrink-0">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#8696A0] text-sm truncate pr-2">
                    {chat.type === "image" ? (
                      <span className="flex items-center gap-1">
                        <span className="text-[#8696A0]">📸</span> Photo
                      </span>
                    ) : (
                      <HighlightText text={chat.lastMessage} searchQuery={searchQuery} />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}





const HighlightText = ({ text, searchQuery }: {
  text: string,
  searchQuery: string
}) => {
  if (!searchQuery) return <>{text}</>

  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))

  return (
    <>
      {parts.map((part, i) => (
        part.toLowerCase() === searchQuery.toLowerCase() ?
          <span key={i} className="bg-[#00A884] text-[#111B21] px-0.5 rounded">
            {part}
          </span>
          :
          <span key={i}>{part}</span>
      ))}
    </>
  )
}