import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div style={{
      backgroundImage: `radial-gradient(circle, #657081 0.5px, transparent 1px)`,
      backgroundSize: '20px 20px'
    }}
      className="min-h-screen flex flex-col  items-center p-2">
      <h1 className="pt-20 text-5xl font-bold tracking-tighter text-transparent md:text-6xl xl:text-7xl whitespace-nowrap bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text dark:bg-gradient-to-r dark:from-gray-400 via dark:bg-neutral-400">
        Hey, It's Safe...
      </h1>
      <div className="mt-14">
        <SignIn />
      </div>
    </div>
  )
}