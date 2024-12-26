


// "use client"
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { sendMessage } from "@/convex/chats";
// import { fetchMutation } from "convex/nextjs";
// import { useMutation } from "convex/react";
// import { Mic, Paperclip, Send, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";


// interface FormInput {
//   message: string;
// }






// export default function FormChat({
//   conversationId,
//   userId,
// }: {
//   conversationId: string,
//   userId: string
// }) {



//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset
//   } = useForm<FormInput>()


//   const [attachments, setAttachments] = useState<string[]>([])
//   const [isUploading, setIsUploading] = useState(false)

//   // for microphone premissions and all
//   const [isListening, setIsListening] = useState(false)
//   const [speechSupported, setSpeecSupported] = useState(false)
//   const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null)

//   // No change in the state when re-render
//   const recognitionRef = useRef<SpeechRecognition | null>(null)



//   const sendMessage = useMutation(api.chats.sendMessage)


//   // Premission of microphone of users device
//   const checkMicrophonePermission = async () => {
//     try {
//       const permissionResult = await navigator.mediaDevices.getUserMedia({ audio: true })

//       setHasMicPermission(true)

//       permissionResult.getTracks().forEach(track => track.stop())
//     } catch (error) {
//       setHasMicPermission(false)
//       console.log("Microphone permissions error", error)
//     }
//   }


//   // we are initialising the speach recognisition
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//       if (SpeechRecognition) {
//         setSpeecSupported(true)

//         recognitionRef.current = new SpeechRecognition()
//         const recognition = recognitionRef.current

//         recognition.continuous = true
//         recognition.interimResults = true
//         recognition.lang = "en-US"

//         recognition.onstart = () => {
//           setIsListening(true)
//           toast.success("Started Listening")
//         }

//         recognition.onresult = (event: any) => {
//           const current = event.resultIndex;
//           const transcript = event.results[current][0].transcript
//           const currentMessage = watch("message") || ""

//           if (event.results[current].isFinal) {
//             setValue('message', currentMessage + transcript + " ")
//           }
//         }

//         recognition.onerror = (event: any) => {
//           console.log('Speech recognition error: ', event.error)
//           setIsListening(false)

//           switch (event.error) {
//             case 'not-allowed':
//               toast.error("Microphone access denied. Please enable microphone permissions.");
//               setHasMicPermission(false);
//               break;
//             case 'no-speech':
//               toast.error("No speech detected. Please try again.");
//               break;
//             case 'network':
//               toast.error("Network error. Please check your connection.");
//               break;
//             default:
//               toast.error("Speech recognition error. Please try again.");
//           }

//         }

//         recognition.onend = () => {
//           setIsListening(false);
//           toast.info("Stopped listening");
//         };

//         // Check initial microphone permission
//         checkMicrophonePermission();

//       }
//     }

//   }, [])




//   async function toggleListening() {
//     if (!recognitionRef.current) return

//     if (isListening) {
//       recognitionRef.current.stop()
//     } else {
//       if (hasMicPermission === false) {
//         toast.error("Microphone access denied. Please enable microphone permissions in your browser settings.", {
//           action: {
//             label: "How to enable",
//             onClick: () => {
//               // Open help dialog or link to instructions
//               toast.info("To enable microphone: Click the camera/microphone icon in your browser's address bar and allow access", {
//                 duration: 5000
//               });
//             },
//           },
//         }
//         )
//         return
//       }

//       try {
//         await checkMicrophonePermission()

//         if (hasMicPermission) {
//           recognitionRef.current.start()
//         }
//       } catch (error) {
//         console.log('Error starting speech recognition ', error)
//         toast.error("Failed to start speech recognition. Please try again.");
//       }
//     }
//   }




//   async function onSubmit(data: FormInput) {
//     try {
//       if (isListening && recognitionRef.current) {
//         recognitionRef.current.stop()
//       }

//       for (const imageUrl of attachments) {
//         await sendMessage({
//           type: "image",
//           converstaionId: conversationId as Id<"conversations">,
//           senderId: userId!,
//           content: "Image",
//           mediaUrl: imageUrl
//         })
//       }

//       if (data.message.trim()) {
//         await sendMessage({
//           type: "text",
//           converstaionId: conversationId as Id<"conversations">,
//           senderId: userId!,
//           content: data.message
//         })
//       }

//       reset()
//       setAttachments([])
//     } catch (error) {
//       console.log("Failed to send message:", error);
//       toast.error("Failed to send message. Please try again.");
//     }
//   }



//   async function handleImageUplaod(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0]
//     if (!file) return;

//     try {
//       setIsUploading(true)

//       const postUrl = await fetchMutation(api.chats.generateUploadUrl)
//       const result = await fetch(postUrl, {
//         method: "POST",
//         headers: { "Content-Type": file.type },
//         body: file
//       })

//       if (!result.ok) {
//         throw new Error(`Upload failed: ${result.statusText}`)
//       }

//       const { storageId } = await result.json()

//       const url = await fetchMutation(api.chats.getUploadUrl, {
//         storageId
//       })

//       if (url) {
//         setAttachments([...attachments, url])
//       }

//     } catch (error) {
//       console.log("Upload failed:", error);
//       toast.error("Failed to upload image. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   }


//   function removeAttachment(index: number) {
//     setAttachments(attachments.filter((_, i) => i !== index))
//   }





//   return (
//     <div className="">

//       {/* for images and attachments  */}
//       {attachments?.length > 0 && (
//         <div className="flex flex-wrap gap-2 p-2 border-b border-border">
//           {attachments.map((url, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={url}
//                 alt="attachment"
//                 className="object-cover w-20 h-20 rounded-md"
//               />
//               <button onClick={() => removeAttachment(index)}
//                 className="absolute p-1 transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
//               >
//                 <X className="w-4 h-4 text-white" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className={` p-4 flex items-center space-x-2  ${attachments?.length > 0 && "pb-[5rem]"} `}>

//         {/* FILE INPUT  */}
//         <div className="relative">
//           <label
//             htmlFor="file-upload"
//             className="inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-colors rounded-md cursor-pointer ring-offset-background focus-visible::outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
//           >
//             <Paperclip className="w-5 h-5" />
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={handleImageUplaod}
//             disabled={isUploading}
//           />
//         </div>

//         <Input
//           {...register("message")}
//           placeholder={isUploading ? "Uploading..." : isListening ? "Listening..." : "Type a message"}
//           className="flex-1 border-2 bg-background placeholder:text-muted-foreground"
//         />
//         {speechSupported && (
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={toggleListening}
//             className={`transition-colors ${isListening ? "text-red-500" : hasMicPermission === false ? "text-gray-400" : ""}`}
//           >
//             <Mic className={"h-6 w-6 " + isListening ? " animate-pulse" : ""} />
//           </Button>
//         )}
//         <Button
//           type="submit"
//           size="icon"
//           disabled={isUploading || !attachments.length && !watch("message")}>
//           <Send className="w-5 h-5" />
//         </Button>
//       </form>
//     </div>
//   );
// }



// import { Button } from "@/components/ui/button";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// export default function TooltipDemo() {
//   return (
//     <TooltipProvider delayDuration={0}>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button variant="outline" size="sm">
//             Tiny
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent className="px-2 py-1 text-xs">This is a simple tooltip</TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// }
