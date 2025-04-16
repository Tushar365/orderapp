// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Orders table
  orders: defineTable({
    // Order details
    orderId: v.string(), // Unique order ID (ORD-timestamp-random)
    timestamp: v.number(), // Creation timestamp
    name: v.string(), // Customer name
    contact: v.string(), // Customer contact information
    address: v.string(), // Delivery address
    pincode: v.string(), // Delivery pincode
    
    // Prescription info
    prescriptionUrl: v.optional(v.string()), // URL to the prescription file in Google Drive
    
    // Order status and billing - optional since they'll be updated later
    status: v.optional(v.union(
      v.literal("Processing"),
      v.literal("processing"),
      v.literal("Order Confirmed"),
      v.literal("order confirmed"),
      v.literal("Packing"),
      v.literal("packing"),
      v.literal("Shipped"),
      v.literal("shipped"),
      v.literal("Delivered"),
      v.literal("delivered"),
      v.literal("Return"),
      v.literal("return"),
      v.literal("Cancel"),
      v.literal("cancel")
    )), // Order status with specific allowed values
    totalBill: v.optional(v.number()), // Total bill amount
    genericBill: v.optional(v.number()), // Generic bill amount (for generic medicines)
    
    // Metadata
    medicineCount: v.number(), // Number of medicines in this order
  }).index("by_orderId", ["orderId"]),

  // Medicines table
  medicines: defineTable({
    orderId: v.string(), // Reference to the parent order
    name: v.string(), // Medicine name
    quantity: v.number(), // Quantity ordered
    price: v.optional(v.number()), // Price per unit (optional for admin to fill later)
    isGeneric: v.optional(v.boolean()), // Whether this is a generic medicine
    
    // References to customer for easier querying
    customerName: v.string(), // Customer name (denormalized for convenience)
    customerContact: v.string(), // Customer contact (denormalized for convenience)
  }).index("by_orderId", ["orderId"]),
});