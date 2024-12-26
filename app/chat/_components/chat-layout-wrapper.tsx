"use client"
import LoadingState from "@/components/Loading";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Suspense, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import LoadingChat from "../loading";






export default function ChatLayoutWrapper({
  children,
  preloadedUserInfo,
  preloadedConversations
}: {
  children: React.ReactNode;
  preloadedUserInfo: Preloaded<typeof api.users.readUser>;
  preloadedConversations: Preloaded<typeof api.chats.getConversation>
}) {


  // Sidebar
  // Header 
  // Nice loading State (we really don't need it )


  const { isLoaded, isSignedIn, userId } = useAuth()
  const [shouldShowLoading, setShouldShowLoading] = useState(true)

  const userInfo = usePreloadedQuery(preloadedUserInfo)
  const conversation = usePreloadedQuery(preloadedConversations)


  // may be fake loading
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShouldShowLoading(false)
  //   }, 1000)

  //   return () => clearTimeout(timer)
  // }, [])

  const isLoading = !isLoaded
    || userInfo === undefined
    // || shouldShowLoading
    || conversation === undefined

  if (isLoading) {
    return <LoadingChat />
  }

  if (!isSignedIn) {
    return null
  }







  return (

    <div className="flex h-screen overflow-hidden">
      <Suspense fallback={<LoadingChat />}>
        <Sidebar
          preloadedUserInfo={preloadedUserInfo}
          preloadedConversations={preloadedConversations}
        />
      </Suspense>
      <Header>
        <Suspense fallback={<LoadingChat />}>
          {children}
        </Suspense>
      </Header>
    </div>
  )
}