import { defineSchema, defineTable } from 'convex/server';
import { Infer, v } from "convex/values";


export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    createdAt: v.number(),
    // optional fields
    name: v.optional(v.string()),
    profileImage: v.optional(v.string())
  })
    .index("by_userId", ["userId"])
    .index("by_name", ["name"])
    .index("by_email", ["email"]),


  conversations: defineTable({
    participantOne: v.id("users"),
    participantTwo: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageId: v.optional(v.id("messages")),
  })
    .index("by_participants", ["participantOne", "participantTwo"])
    .index("by_participantOne", ["participantOne"])
    .index("by_participantTwo", ["participantTwo"])
    .index("by_updated", ["updatedAt"]),


  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("video"),
      v.literal("audio"),
      v.literal("file")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    isEdited: v.boolean(),
    mediaUrl: v.optional(v.string()),
    replyTo: v.optional(v.id("messages")),
  })
    .index("by_conversation", ["conversationId", "createdAt"])
    .index("by_sender", ["senderId"]),

})




