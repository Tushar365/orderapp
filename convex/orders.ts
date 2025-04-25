import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Generate a unique order ID
function generateOrderId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

/**
 * Create a new order in the Convex database
 */
export const createOrder = mutation({
  args: {
    name: v.string(),
    contact: v.string(),
    address: v.string(),
    pincode: v.string(),
    medicines: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        price: v.optional(v.number()),
        isGeneric: v.optional(v.boolean()),
      })
    ),
    prescriptionUrl: v.optional(v.string()),
    prescriptionFileId: v.optional(v.string()),
    // Order status and billing - optional since they'll be updated later
    status: v.optional(v.union(
      v.literal("Processing"),
      v.literal("Order Confirmed"),
      v.literal("Packing"),
      v.literal("Shipped"),
      v.literal("Delivered"),
      v.literal("Return"),
      v.literal("Cancel")
    )), // Order status with specific allowed values
    totalBill: v.optional(v.number()), // Total bill amount
    genericBill: v.optional(v.number()), // Generic bill amount
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    try {
      // Generate the order ID
      const orderId = generateOrderId();
      const timestamp = Date.now();
      
      // Insert the order
      await ctx.db.insert("orders", {
        orderId,
        timestamp,
        name: args.name,
        contact: args.contact,
        address: args.address,
        pincode: args.pincode,
        prescriptionUrl: args.prescriptionUrl,
        status: args.status ?? "Processing", // Default status
        totalBill: args.totalBill ?? 0,
        genericBill: args.genericBill ?? 0,
        medicineCount: args.medicines.length,
      });
      
      // Insert all medicines
      for (const medicine of args.medicines) {
        await ctx.db.insert("medicines", {
          orderId,
          name: medicine.name,
          quantity: medicine.quantity,
          price: medicine.price,
          isGeneric: medicine.isGeneric,
          customerName: args.name,
          customerContact: args.contact,
        });
      }
      
      return orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  },
});

/**
 * Update order status
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.string(),
    status: v.union(
      v.literal("Processing"),
      v.literal("Order Confirmed"),
      v.literal("Packing"),
      v.literal("Shipped"),
      v.literal("Delivered"),
      v.literal("Return"),
      v.literal("Cancel")
    ),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Find the order by orderId
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();
    
    if (orders.length === 0) {
      return false;
    }
    
    // Update the status
    await ctx.db.patch(orders[0]._id, {
      status: args.status,
    });
    
    return true;
  },
});

/**
 * Get an order by its orderId
 */
export const getOrder = query({
  args: {
    orderId: v.string(),
  },
  // Define the return type explicitly, matching the schema and potential nulls
  returns: v.union(v.null(), v.object({
    _id: v.id("orders"),
    orderId: v.string(),
    timestamp: v.number(),
    name: v.string(),
    contact: v.string(),
    address: v.string(),
    pincode: v.string(),
    prescriptionUrl: v.optional(v.string()),
    status: v.string(),
    totalBill: v.number(),
    genericBill: v.number(),
    medicineCount: v.number(),
    medicines: v.array(
      v.object({
        _id: v.id("medicines"),
        name: v.string(),
        quantity: v.number(),
        price: v.optional(v.number()),
        isGeneric: v.optional(v.boolean()),
      })
    ),
  })),
  handler: async (ctx, args) => {
    // Find the order
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .first(); // Use .first() to get a single order or null
    
    if (!order) {
      return null; // Return null if order not found
    }
    
    // Get the medicines for this order
    const medicines = await ctx.db
      .query("medicines")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();
    
    return {
      _id: order._id,
      orderId: order.orderId,
      timestamp: order.timestamp,
      name: order.name,
      contact: order.contact,
      address: order.address,
      pincode: order.pincode,
      prescriptionUrl: order.prescriptionUrl,
      status: order.status ?? "Processing", // Use nullish coalescing for default
      totalBill: order.totalBill ?? 0,  // Use nullish coalescing for default
      genericBill: order.genericBill ?? 0,  // Use nullish coalescing for default
      medicineCount: order.medicineCount,
      medicines: medicines.map(medicine => ({
        _id: medicine._id,
        name: medicine.name,
        quantity: medicine.quantity,
        price: medicine.price,
        isGeneric: medicine.isGeneric,
      })),
    };
  },
});

/**
 * List all orders
 */
export const listOrders = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  // Define the return type explicitly
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      orderId: v.string(),
      timestamp: v.number(),
      name: v.string(),
      contact: v.string(),
      address: v.string(), // Added address
      pincode: v.string(), // Added pincode
      prescriptionUrl: v.optional(v.string()), // Added prescriptionUrl
      status: v.string(),
      totalBill: v.number(),
      medicineCount: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    let query = ctx.db.query("orders");
    if (args.status) {
      // Filter by status if provided
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }
    
    // Get orders sorted by timestamp (newest first)
    const orders = await query
      .order("desc")
      .take(args.limit || 100);
    
    return orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      timestamp: order.timestamp,
      name: order.name,
      contact: order.contact,
      address: order.address, // Include address
      pincode: order.pincode, // Include pincode
      prescriptionUrl: order.prescriptionUrl, // Include prescriptionUrl
      status: order.status ?? "Processing", // Ensure status is never undefined
      totalBill: order.totalBill ?? 0, // Ensure totalBill is never undefined
      medicineCount: order.medicineCount,
    }));
  },
});

/**
 * Update prescription details for an order
 */
export const updateOrderPrescription = mutation({
  args: {
    orderId: v.string(),
    prescriptionUrl: v.optional(v.string()),
    // Removed prescriptionFileId as it's not in the schema
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_orderId", q => q.eq("orderId", args.orderId))
      .collect();

    if (!orders.length) return false;
    
    await ctx.db.patch(orders[0]._id, {
      prescriptionUrl: args.prescriptionUrl,
    });
    
    return true;
  },
});

/**
 * Update medicine details from Google Sheet
 */
export const updateMedicineFromSheet = mutation({
  args: {
    orderId: v.string(),
    medicineName: v.string(),
    quantity: v.optional(v.number()),
    price: v.optional(v.number()),
    isGeneric: v.optional(v.boolean()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Find the medicine by orderId and name
    const medicines = await ctx.db
      .query("medicines")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .filter((q) => q.eq(q.field("name"), args.medicineName))
      .collect();
    
    if (medicines.length === 0) {
      console.error(`Medicine not found: ${args.orderId} - ${args.medicineName}`);
      return false;
    }
    
    // Prepare update object with only the fields that are provided
    const updateFields: Partial<typeof medicines[0]> = {}; // Use Partial for type safety
    
    if (args.quantity !== undefined && args.quantity !== null) {
      updateFields.quantity = args.quantity;
    }
    
    if (args.price !== undefined && args.price !== null) {
      // Assuming 'price' field exists in 'medicines' table, otherwise adjust
      // updateFields.price = args.price; 
    }
    
    if (args.isGeneric !== undefined && args.isGeneric !== null) {
      updateFields.isGeneric = args.isGeneric;
    }
    
    // Only update if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      await ctx.db.patch(medicines[0]._id, updateFields);
      return true;
    }
    
    return false;
  },
});

/**
 * Update order details from Google Sheet
 */
export const updateOrderFromSheet = mutation({
  args: {
    orderId: v.string(),
    totalBill: v.optional(v.number()),
    genericBill: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("Processing"),
      v.literal("Order Confirmed"),
      v.literal("Packing"),
      v.literal("Shipped"),
      v.literal("Delivered"),
      v.literal("Return"),
      v.literal("Cancel")
    )),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Find the order by orderId
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .collect();
    
    if (orders.length === 0) {
      console.error(`Order not found: ${args.orderId}`);
      return false;
    }
    
    // Prepare update object with only the fields that are provided
    const updateFields: Partial<typeof orders[0]> = {}; // Use Partial for type safety
    
    if (args.totalBill !== undefined && args.totalBill !== null) {
      updateFields.totalBill = args.totalBill;
    }
    
    if (args.genericBill !== undefined && args.genericBill !== null) {
      updateFields.genericBill = args.genericBill;
    }
    
    if (args.status !== undefined && args.status !== null) {
      updateFields.status = args.status;
    }
    
    // Only update if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      await ctx.db.patch(orders[0]._id, updateFields);
      return true;
    }
    
    return false;
  },
});
