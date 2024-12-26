

import { Laptop } from "lucide-react";
import { Suspense } from "react";
import LoadingChat from "./loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchComponent from "./_components/search";
// import SearchComponent from "./_components/search";





export default async function ChatHomeScreen() {

  // function wait(duration: number) {
  //   return new Promise(resolve => {
  //     setTimeout(resolve, duration);
  //   })
  // }

  // await wait(3000)



  return (
    <Suspense fallback={<LoadingChat />}>
      <div
        style={{
          backgroundImage: `radial-gradient(circle, #657081 0.5px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
        className="flex flex-col items-center justify-center flex-1 text-center"
      >
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-5xl font-bold tracking-tighter text-transparent md:text-6xl xl:text-7xl whitespace-nowrap bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text dark:bg-gradient-to-r dark:from-gray-400 via dark:bg-neutral-400">
            Start a new Conversation.
          </h1>
          <div className="pt-4">
            <Button size="lg" asChild className="h-12 px-8 text-lg font-semibold">
              <SearchComponent onSidebar={false} />
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
