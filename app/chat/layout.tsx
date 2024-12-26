import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import ChatLayoutWrapper from "./_components/chat-layout-wrapper"
import { Suspense } from "react"
import LoadingChat from "./loading"


export default async function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {

  // from clerk
  const { userId } = await auth()

  // user information from the database
  const preloadedUserInfo = await preloadQuery(api.users.readUser, {
    userId: userId!
  })


  // conversation + chats
  const preloadedConversations = await preloadQuery(api.chats.getConversation, {
    userId: userId!
  })



  return (
    <Suspense fallback={<LoadingChat />}>
      <ChatLayoutWrapper
        preloadedUserInfo={preloadedUserInfo}
        preloadedConversations={preloadedConversations}
      >
        {children}
      </ChatLayoutWrapper>
    </Suspense>
  )
}