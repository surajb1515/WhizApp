import { v } from 'convex/values'
import { mutation, query } from "./_generated/server"



// export const sendMessage
// export const getConversation
// export const getMessages
// export const generateUploadUrl
// export const getUploadUrl
// export const createOrGetConversationId
// export const deleteConversation





export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});




export const getUploadUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});


// if conversation already exists then it will just return its Id(conversationID)
// if the conversation doesn't exits then 
// it will create a conversation and will return conversation Id
export const createOrGetConversationId = mutation({
  args: {
    currentUserId: v.string(),        // clerk userId
    participantUserId: v.string(),    // clerk userId
  },
  handler: async (ctx, args) => {

    // Get both user's convex IDs from their clerk ID table
    const currentUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field("userId"), args.currentUserId))
      .first();

    const otherUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field("userId"), args.participantUserId))
      .first()

    if (!currentUser || !otherUser) throw new Error("User not found")


    // finding the existingConversation of the above 2 users
    const existingConversation = await ctx.db
      .query("conversations")
      .filter(q =>
        q.or(
          q.and(
            q.eq(q.field("participantOne"), currentUser._id),
            q.eq(q.field("participantTwo"), otherUser._id)
          ),
          q.and(
            q.eq(q.field("participantOne"), currentUser._id),
            q.eq(q.field("participantTwo"), otherUser._id)
          ),
        )
      )
      .first();

    if (existingConversation) {
      return existingConversation._id;
    }

    // creating the conversation if it doesn't exists
    const conversationId = await ctx.db.insert("conversations", {
      participantOne: currentUser._id,
      participantTwo: otherUser._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return conversationId
  }
})




export const sendMessage = mutation({
  args: {
    senderId: v.string(),
    content: v.string(),
    converstaionId: v.id("conversations"),
    type: v.optional(v.union(v.literal("text"), v.literal("image"))),
    mediaUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {

    // finding the sender (from the database)
    const senderUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field('userId'), args.senderId))
      .first()

    if (!senderUser) throw new Error("Sender not found")


    // inserting the message into messages Table
    // it will return messageId
    const messageId = await ctx.db.insert("messages", {
      senderId: senderUser._id,
      content: args.content,
      conversationId: args.converstaionId,
      type: args.type ?? "text",
      isEdited: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mediaUrl: args.mediaUrl
    })

    // updating the last message in the conversations Table (see the schema of conversation)
    await ctx.db.patch(args.converstaionId, {
      lastMessageId: messageId,
      updatedAt: Date.now(),
    })

    return messageId
  }
})




// a particular user (with some userId) will delete the conversation
// with a particular conversationId
export const deleteConversation = mutation({
  args: {
    userId: v.string(),
    conversationId: v.id("conversations")
  },
  handler: async (ctx, args) => {

    // get the user from its clerk userId
    // checking that the user that wanted to delete the conversation is present in the db or not
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .first();

    if (!user) throw new Error("User not found")

    //get the conversation
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) throw new Error("Conversation not found")


    // that user must be a part of conversation, which he/she wants to delete
    // checking that verify user is a part of that conversation
    if (
      conversation.participantOne !== user._id &&
      conversation.participantTwo !== user._id
    ) {
      throw new Error("Unauthorized to delete this conversation")
    }


    // get all the messages in the conversation 
    const allMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", q => q.eq("conversationId", args.conversationId))
      .collect();

    // Delete all the messages
    await Promise.all(allMessages.map(msg => ctx.db.delete(msg._id)))

    // Finally delete the conversation 
    await ctx.db.delete(args.conversationId)

    return {
      success: true,
      deletedMessages: allMessages.length
    }
  }
})




// Promise < {
//   id: Id<"conversations">;
//   name: string;
//   chatImage: string | undefined;
//   lastMessage: string;
//   time: string;
//   unread: number;
//   type: "text" | "image" | "video" | "audio" | "file" | undefined;
// }[]


// --------------------------------------------------------------------> REVIEW
// will return array of conversations with custom properties


export const getConversation = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {

    // finding the existing user form the database with particular userId
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('userId'), args.userId))
      .first();

    if (!user) return [];


    // finding all the conversation corresponding to the particular user we get above
    // either the user is is participantOne or participantTwo
    const allconversations = await ctx.db
      .query("conversations")
      .filter(q =>
        q.or(
          q.eq(q.field("participantOne"), user._id),
          q.eq(q.field("participantTwo"), user._id)
        )
      )
      .collect();

    const conversationsWithDetails = await Promise.all(
      allconversations.map(async (conv) => {
        const otherParticipantId =
          conv.participantOne === user._id
            ? conv.participantTwo
            : conv.participantOne;

        const otherUser = await ctx.db.get(otherParticipantId)
        const lastMessage = conv.lastMessageId
          ? await ctx.db.get(conv.lastMessageId)
          : null;

        // because i want to see lastMessage on the side bar like whatsapp
        return {
          id: conv._id,
          name: otherUser?.name ?? "Unknown",
          chatImage: otherUser?.profileImage,
          lastMessage: lastMessage?.content ?? "",
          time: formatChatTime(new Date(conv.updatedAt)),
          unread: 0, // You can implement unread count logic here
          type: lastMessage?.type,
        };

      })
    )

    // latest message on top
    return conversationsWithDetails.sort((a: any, b: any) => b.time - a.time)

  }
})





// returns -----> messages array[] with custom properties
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {

    // finding all the messages from the messages Table in database
    const messages = await ctx.db
      .query('messages')
      .filter(q => q.eq(q.field("conversationId"), args.conversationId))
      .order('asc')
      .take(args.limit ?? 50)

    return await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId)

        return {
          id: msg._id,
          sender_userId: sender?.userId,
          sender: sender?.name ?? "Unknown",
          content: msg.content,
          time: formatChatTime(new Date(msg.createdAt)),
          isSent: true,
          type: msg.type,
          mediaUrl: msg.mediaUrl,
        }
      })
    )
  }
})






const formatChatTime = (date: Date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    // Today: show time only
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  } else if (date.toDateString() === yesterday.toDateString()) {
    // Yesterday
    return 'Yesterday';
  } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    // Within last week: show day name
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      timeZone: 'Asia/Kolkata'
    });
  } else {
    // Older: show date
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  }
};