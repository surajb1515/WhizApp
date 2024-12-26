import { mutation, query } from "./_generated/server";
import { v } from "convex/values";



// it will return id of new user
export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const newUserId = await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        createdAt: args.createdAt,
        profileImage: args.profileImage
      })

      return newUserId;
    } catch (error) {
      throw new Error("User informated did not insert successfully")
    }
  },
});



// return void
export const updateName = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found")
    }

    const updatedUser = await ctx.db.patch(user._id, {
      name: args.name
    })

    return updatedUser;
  }
})



// return void
export const updateProfileImage = mutation({
  args: {
    userId: v.string(),
    profileImage: v.string()
  },
  handler: async (ctx, args) => {

    // finding the existing user from the database
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found")
    }

    const updatedUser = await ctx.db.patch(user._id, {
      profileImage: args.profileImage,
    })
    return updatedUser
  }
})



// return user
export const readUser = query({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const userInfo = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("userId"), args.userId))
        .first()

      return userInfo
    } catch (error) {
      throw new Error("Reading user did not work")
    }
  }
})



// will return [] of users
export const searchUsers = query({
  args: {
    searchTerm: v.string(),
    currentUserId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm) return []

    const searchTermLowerCase = args.searchTerm.toLocaleLowerCase()

    const users = await ctx.db
      .query("users")
      .filter(q => q.neq(q.field("userId"), args.currentUserId))
      .collect()

    return users.filter((user: any) => {
      const nameMatch = user?.name?.toLocaleLowerCase().includes(searchTermLowerCase)
      const emailMatch = user?.email?.toLocaleLowerCase().includes(searchTermLowerCase)

      return nameMatch || emailMatch
    })
      .slice(0, 10)
  }
})