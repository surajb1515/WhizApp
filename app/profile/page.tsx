import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import ProfileComponent from "./_components/profile";


export default async function ProfilePage({ }) {

  const { userId } = await auth()

  const preLoadedUserInfo = await preloadQuery(api.users.readUser, {
    userId: userId!
  })





  return (
    <div className="flex flex-col h-screen">
      <ProfileComponent
        preloadedUserInfo={preLoadedUserInfo}
      />
    </div>
  )
}