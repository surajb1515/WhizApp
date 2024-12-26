'use client'
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useEffect, useRef } from "react";





interface Message {
  content: string;
  id: Id<"messages">;
  isSent: boolean;
  sender: string;
  sender_userId: string | undefined;
  time: string;
  type: "text" | "image" | "video" | "audio" | "file";
  mediaUrl?: string;
}




export default function ChatList({
  userId,
  preloadedMessages
}: {
  userId: string;
  preloadedMessages: Preloaded<typeof api.chats.getMessages>
}) {



  const messages = usePreloadedQuery(preloadedMessages)


  // TO PRESIST ITS VALUE ON RE-RENDER
  // ITS CHANGE WILL NOT TRIGER A RE-RENDER
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // it should take you to the bottom of the conversation/chats
  // when ever the messages[] changes 
  // that means when ever you add a new message, it will take you to the bottom of the page
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])





  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-background  max-h-[calc(100vh-135px)]"
      style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        backgroundImage: `radial-gradient(circle, #657081 0.5px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }} >
      <div className="flex flex-col min-h-full p-4 space-y-4">
        {messages.map((msg: Message) => {
          const isMyMessage = msg.sender_userId === userId

          return (

            // Message ka outer box (whole row, you can say) 
            <div
              key={msg.id}
              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
            >

              {/* Message ka box */}
              <div className={`rounded-lg px-3 py-1.5 max-w-xs lg:max-w-md 
                ${isMyMessage
                  ? "bg-primary text-primary-foreground dark:bg-[#005C4B] "
                  : 'bg-muted dark:bg-[#202C33]'
                }
               `}>

                {!isMyMessage && (
                  <p className="mb-1 text-xs dark:text-white text-muted-foreground">
                    {msg.sender}
                  </p>
                )}

                {msg?.type === "image"
                  ? (
                    <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                      <div className="w-full">
                        <img
                          src={msg.mediaUrl}
                          alt="Message content"
                          className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                          // sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 33vw"
                          onLoad={() => {
                            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                          }}
                        />
                      </div>
                    </div>
                  )
                  : (
                    <p className="text-sm break-words whitespace-pre-wrap dark:text-white">
                      {msg.content}
                    </p>
                  )}

                <p className="mt-1 text-xs text-right text-muted-foreground">
                  {msg.time}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

    </div>
  )
}