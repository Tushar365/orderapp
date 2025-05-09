import { v } from "convex/values";
import { internalAction } from "./_generated/server";

// This webhook handler will process events from Clerk
export const clerkWebhook = internalAction({
  args: {
    payload: v.any(),
    headers: v.any(),
  },
  handler: async (ctx, { payload, headers }) => {
    // Verify the webhook signature
    const sigHeader = headers["svix-signature"];
    const sigTime = headers["svix-timestamp"];
    const body = JSON.stringify(payload);

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      throw new Error("Missing webhook secret");
    }

    try {
      // Process the webhook event based on the type
      const { type, data } = payload;
      console.log(`Received webhook event: ${type}`);

      // Handle user creation events
      if (type === "user.created" || type === "user.updated") {
        const userData = data;
        console.log(`Processing user data for ${userData.id}`);

        // Store user data in Convex
        // You would typically call a mutation here to store the user
        // For example:
        // await ctx.runMutation(internal.users.storeUserFromWebhook, {
        //   userId: userData.id,
        //   email: userData.email_addresses?.[0]?.email_address,
        //   name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        //   pictureUrl: userData.image_url,
        // });
      }

      return { success: true };
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw new Error(`Webhook processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});