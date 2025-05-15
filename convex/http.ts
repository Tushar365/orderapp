import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

// Register the Clerk webhook handler at /clerk-users-webhook
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error validating webhook signature", { status: 400 });
    }
    
    try {
      switch (event.type) {
        case "user.created": // intentional fallthrough
        case "user.updated":
          // Use existing storeUser mutation with Clerk data
          await ctx.runMutation(internal.users.storeUserFromWebhook, {
            userId: event.data.id,
            email: event.data.email_addresses?.[0]?.email_address,
            name: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
            pictureUrl: event.data.image_url,
            subject: event.data.id, // Use Clerk ID as subject for consistency
          });
          console.log(`User data stored for: ${event.data.id}`);
          break;
          
        case "session.created":
          // Handle session creation - can be used to track active sessions
          console.log(`Session created for user: ${event.data.user_id}`);
          // Optionally update user's last login time
          await ctx.runMutation(internal.users.updateUserSession, {
            userId: event.data.user_id,
            sessionId: event.data.id,
            status: "active"
          });
          break;
          
        case "session.removed":
          // Handle session removal - can be used to track when users log out
          console.log(`Session removed for user: ${event.data.user_id}`);
          // Optionally update user's session status
          await ctx.runMutation(internal.users.updateUserSession, {
            userId: event.data.user_id,
            sessionId: event.data.id,
            status: "inactive"
          });
          break;
          
        case "user.deleted":
          // Handle user deletion if needed
          if (event.data.id) {
            await ctx.runMutation(internal.users.deleteUser, { userId: event.data.id });
            console.log(`User deletion processed for: ${event.data.id}`);
          } else {
            console.error("User deletion event received but no user ID was provided");
          }
          break;
          
        default:
          console.log("Ignored Clerk webhook event", event.type);
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }),
});

/**
 * Verifies and parses a Clerk webhook request using Svix signature headers.
 *
 * @param req - The incoming HTTP request containing the webhook payload and Svix signature headers.
 * @returns The verified {@link WebhookEvent} object if validation succeeds; otherwise, null.
 *
 * @remark Returns null if the webhook secret is missing, the signature is invalid, or an error occurs during verification.
 */
async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  try {
    const payloadString = await req.text();
    const svixHeaders = {
      "svix-id": req.headers.get("svix-id") || "",
      "svix-timestamp": req.headers.get("svix-timestamp") || "",
      "svix-signature": req.headers.get("svix-signature") || "",
    };
    
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      return null;
    }
    
    const wh = new Webhook(webhookSecret);
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;