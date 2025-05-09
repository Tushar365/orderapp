import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Store or update user in the database
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      console.error("Authentication failed: No identity found");
      throw new Error("Not authenticated");
    }

    console.log("Identity received from auth:", {
      subject: identity.subject,
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.tokenIdentifier
    });
    
    try {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
        .unique();
        
      if (existingUser) {
        console.log("Updating existing user:", existingUser._id);
        // Update existing user
        const updatedUser = await ctx.db.patch(existingUser._id, {
          name: identity.name ?? existingUser.name ?? "Unknown User", // Keep existing name if identity.name is undefined
          email: identity.email ?? existingUser.email ?? "no-email@example.com", // Keep existing email if identity.email is undefined
          pictureUrl: identity.pictureUrl,
        });
        console.log("User updated successfully", updatedUser);
        return updatedUser;
      }
      
      console.log("Creating new user with subject:", identity.subject);
      // Create new user
      const newUser = await ctx.db.insert("users", {
        name: identity.name ?? "Unknown User", // Provide default value if undefined
        email: identity.email ?? "no-email@example.com", // Provide default value if undefined
        pictureUrl: identity.pictureUrl,
        subject: identity.subject,
      });
      console.log("New user created successfully", newUser);
      return newUser;
    } catch (error) {
      console.error("Error storing user in database:", error);
      throw new Error(`Failed to store user: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }
    
    try {
      // Get user from database
      const user = await ctx.db
        .query("users")
        .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
        .unique();
        
      if (!user) {
        console.log("User not found in database, returning identity info");
        // Return basic identity info if user not in database yet
        return {
          id: identity.subject,
          name: identity.name,
          email: identity.email,
          pictureUrl: identity.pictureUrl,
        };
      }
      
      return {
        id: user.subject,
        name: user.name,
        email: user.email,
        pictureUrl: user.pictureUrl,
        _id: user._id, // Include the document ID
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },
}); 

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Here you can add additional logic to fetch user-specific data from your database
    return {
      id: userId,
      // Add other user data fields as needed
    };
  },
});

// Store user from Clerk webhook
export const storeUserFromWebhook = internalMutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.string(),
    pictureUrl: v.optional(v.string()),
    subject: v.string(),
  },
  handler: async (ctx, { userId, email, name, pictureUrl, subject }) => {
    console.log("Processing webhook user data:", { userId, email, name });
    
    try {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_subject", (q) => q.eq("subject", subject))
        .unique();
        
      if (existingUser) {
        console.log("Updating existing user from webhook:", existingUser._id);
        // Update existing user
        const updatedUser = await ctx.db.patch(existingUser._id, {
          name: name ?? existingUser.name ?? "Unknown User",
          email: email ?? existingUser.email ?? "no-email@example.com",
          pictureUrl,
        });
        console.log("User updated successfully from webhook", updatedUser);
        return updatedUser;
      }
      
      console.log("Creating new user from webhook with subject:", subject);
      // Create new user
      const newUser = await ctx.db.insert("users", {
        name: name ?? "Unknown User",
        email: email ?? "no-email@example.com",
        pictureUrl,
        subject,
      });
      console.log("New user created successfully from webhook", newUser);
      return newUser;
    } catch (error) {
      console.error("Error storing user from webhook:", error);
      throw new Error(`Failed to store user from webhook: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Update user session status
export const updateUserSession = internalMutation({
  args: {
    userId: v.string(),
    sessionId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { userId, sessionId, status }) => {
    console.log(`Updating session for user ${userId}: ${sessionId} -> ${status}`);
    
    try {
      // Find user by subject (which is the Clerk userId)
      const user = await ctx.db
        .query("users")
        .withIndex("by_subject", (q) => q.eq("subject", userId))
        .unique();
      
      if (user) {
        // Update user with session information
        console.log(`User ${user._id} session updated: ${sessionId} is now ${status}`);
        
        // Store the last session status on the user record
        const updatedUser = await ctx.db.patch(user._id, {
          lastSessionStatus: status,
          lastSessionId: sessionId,
          lastSessionUpdate: Date.now()
        });
        
        return { success: true, userId, sessionId, status };
      } else {
        // If user doesn't exist yet, we could create them
        // This is useful for handling session events before user.created
        console.log(`User ${userId} not found for session update. Creating placeholder.`);
        
        const newUser = await ctx.db.insert("users", {
          subject: userId,
          name: "Pending User",
          email: "pending@example.com",
          lastSessionStatus: status,
          lastSessionId: sessionId,
          lastSessionUpdate: Date.now()
        });
        
        return { success: true, userId, sessionId, status, newUser: true };
      }
    } catch (error) {
      console.error("Error updating user session:", error);
      throw new Error(`Failed to update user session: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Delete user (for Clerk webhook user.deleted events)
export const deleteUser = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    try {
      // Find user by subject (which is the Clerk userId)
      const user = await ctx.db
        .query("users")
        .withIndex("by_subject", (q) => q.eq("subject", userId))
        .unique();
      
      if (user) {
        console.log(`Deleting user with ID: ${user._id}`);
        await ctx.db.delete(user._id);
        return { success: true };
      } else {
        console.warn(`User with Clerk ID ${userId} not found for deletion`);
        return { success: false, reason: "User not found" };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});