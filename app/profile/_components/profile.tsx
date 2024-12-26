"use client"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { ArrowLeft, Camera, Edit2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchMutation } from "convex/nextjs";
import { toast } from 'sonner';
import ModeToggle from "@/components/mode-toggle";



interface ProfileFormData {
  name: string;
}



export default function ProfileComponent({
  preloadedUserInfo
}: {
  preloadedUserInfo: Preloaded<typeof api.users.readUser>
}) {


  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const userInfo = usePreloadedQuery(preloadedUserInfo)
  const updateUserMutation = useMutation(api.users.updateName)


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userInfo?.name || ""
    }
  })


  // FORM HANDLER 
  async function onSubmit(data: ProfileFormData) {
    // console.log('data in line:52', data)
    try {
      if (userInfo?.userId) {
        await updateUserMutation({
          userId: userInfo.userId,
          name: data.name
        })

        toast.success('Name has been successfull updated!')

        setIsEditing(false)
        router.refresh()
      } else {
        console.error("User Id is undefined")
      }
    } catch (error) {
      console.error('error in line:53', error)
    }

  }


  // TO CHANGE PROFILE IMAGE
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('handleImageChange clicked')
    const file = e?.target?.files?.[0]

    if (!file) {
      console.log('!file')
      return
    }

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        //
      }
      reader.readAsDataURL(file)

      const postUrl = await fetchMutation(api.chats.generateUploadUrl)

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file
      })

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`)
      }

      const { storageId } = await result.json()

      const url = await fetchMutation(api.chats.getUploadUrl, {
        storageId
      })

      if (url && userInfo?.userId) {
        await fetchMutation(api.users.updateProfileImage, {
          userId: userInfo?.userId,
          profileImage: url
        })
      }

      toast.success("Profile Photo changed successfully")

    } catch (error) {
      console.error("Upload failed:", error);

    }
  }


  return (
    <div>
      {/* Header */}
      <header className="pl-2 border-b flex items-center">
        <div className="container flex items-center gap-4 py-4">
          <Link href={"/chat"}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        </div>
        <div className="p-2">
          <ModeToggle />
        </div>
      </header>

      <div
        style={{
          backgroundImage: `radial-gradient(circle, #657081 0.5px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
        className="h-[90vh] overflow-hidden ">
        <div className="flex flex-col items-center p-4">

          {/* Profile Content */}
          <main className="container max-w-md py-8 space-y-8">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={userInfo?.profileImage} alt={userInfo?.name || ""} />
                  <AvatarFallback>{userInfo?.name}</AvatarFallback>
                </Avatar>
                {/* <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Button> */}
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-neutral-800 dark:bg-white rounded-full p-2 cursor-pointer">
                  <Camera className="w-6 h-6 text-white dark:text-black" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="bg-background" htmlFor="name">Name</Label>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="input-21"></Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5">
                      <Input
                        className="flex-1 shadow-none -me-px rounded-e-none focus-visible:z-10 bg-background"
                        {...register("name", {
                          required: true
                        })}
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 text-sm font-medium transition-colors border rounded-e-lg border-input bg-background text-foreground outline-offset-2 hover:bg-accent hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50">
                        Update
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="space-y-2">
                <Label className="bg-background" htmlFor="email">Email</Label>
                <div className="bg-background">
                  <Input
                    defaultValue={userInfo?.email}
                    disabled
                  />

                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}