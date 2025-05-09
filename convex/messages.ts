import { query } from "./_generated/server";

// Get orders for the currently authenticated user
export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // If you want to allow unauthenticated access, return null or an empty list.
      // Otherwise, throw an error.
      console.error("Unauthenticated call to query: User is not authenticated.");
      throw new Error("Unauthenticated call to query: User is not authenticated.");
    }

    // Attempt to retrieve the user's phone number from the identity.
    // The availability and field name (`phoneNumber`) depend on your Convex Auth provider setup (e.g., Clerk).
    // Verify the exact field name in your identity object if this doesn't work.
    const userPhoneNumber = identity.phoneNumber;

    if (!userPhoneNumber) {
      // If phoneNumber is not available in the identity, we cannot link orders via the 'contact' field.
      // Consider alternative linking methods (e.g., storing identity.subject in orders)
      // or ensure the auth provider includes the phone number in the identity token.
      console.warn(`User identity (subject: ${identity.subject}) does not include phoneNumber. Cannot fetch orders linked by contact number.`);
      // Returning empty array as orders cannot be reliably fetched without a linking identifier.
      // Adjust this behavior (e.g., throw error) based on your application's requirements.
      return [];
      // Alternatively, you could throw an error:
      // throw new Error("Cannot determine user's phone number to fetch orders.");
    }

    // Fetch orders where the 'contact' field matches the authenticated user's phone number.
    // This assumes the 'contact' field in the 'orders' table stores the user's phone number
    // and is the intended way to link orders to users based on the current schema.
    console.log(`Fetching orders for contact: ${userPhoneNumber}`);
    try {
      const orders = await ctx.db
        .query("orders")
        .filter((q) => q.eq(q.field("contact"), userPhoneNumber)) // Filter by contact matching user's phone number
        .collect();
      console.log(`Found ${orders.length} orders for contact: ${userPhoneNumber}`);
      return orders;
    } catch (error) {
      console.error(`Error fetching orders for contact ${userPhoneNumber}:`, error);
      // Rethrow the error or handle it as appropriate for your application
      throw new Error(`Failed to fetch orders: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});