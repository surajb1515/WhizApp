import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function Home() {

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-background">

      <div
        className="absolute inset-0 bg-white dark:bg-neutral-950"
        style={{
          backgroundImage: `radial-gradient(circle, #657081 0.5px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto space-y-8 text-center max-w-7xl">
        <h1 className="text-5xl font-bold tracking-tighter text-transparent md:text-6xl xl:text-7xl whitespace-nowrap bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text dark:bg-gradient-to-r dark:from-gray-400 via dark:bg-neutral-400">
          Welcome to Not WhizApp
        </h1>
        <p className="max-w-3xl mx-auto text-xl bg-background  w-fit text-muted-foreground md:text-2xl">
          It&apos;s like WhatsApp, but not... You know what we mean.
        </p>
        <div className="pt-4">
          <Button size="lg" asChild className="h-12 px-8 text-lg font-semibold">
            <Link href='/chat'>
              Start Chatting
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


// clerk will send all the infomation to the webhook (with endpoint /api/auth/webhook)