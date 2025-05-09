import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    pictureUrl: v.optional(v.string()),
    subject: v.string(),
    // Add session tracking fields
    lastSessionStatus: v.optional(v.string()),
    lastSessionId: v.optional(v.string()),
    lastSessionUpdate: v.optional(v.float64()),
  }).index("by_subject", ["subject"]),
  // Orders table with extended fields
  orders: defineTable({
    // Basic order info
    orderId: v.string(),
    timestamp: v.float64(),
    orderDate: v.optional(v.string()),
    
    // Customer info
    name: v.string(), // customerName
    patientName: v.optional(v.string()),
    doctorName: v.optional(v.string()),
    contact: v.string(), // mobile
    age: v.optional(v.string()),
    address: v.string(),
    pincode: v.string(),
    location: v.optional(v.string()),
    
    // Order details
    medicineCount: v.float64(),
    totalBill: v.float64(),
    totalMRP: v.optional(v.float64()),
    totalSavings: v.optional(v.float64()),
    flatDiscountAmount: v.optional(v.float64()),
    flatDiscountPercentage: v.optional(v.float64()),
    genericBill: v.float64(),
    brandedAmount: v.optional(v.float64()),
    
    // Service charges
    brandedServiceCharge: v.optional(v.float64()),
    genericServiceCharge: v.optional(v.float64()),
    finalCharge: v.optional(v.float64()),
    
    // Status fields
    status: v.string(), // orderStatus
    deliveryStatus: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    paymentDate: v.optional(v.string()),
    
    // Shipment info
    shipmentDate: v.optional(v.string()),
    shipmentNumber: v.optional(v.string()),
    
    // Billing details
    billingMRP: v.optional(v.float64()),
    billingDiscountAmount: v.optional(v.float64()),
    sellAmount: v.optional(v.float64()),
    returnAmount: v.optional(v.float64()),
    
    // Files and links
    prescriptionUrl: v.optional(v.string()),
    invoiceLink: v.optional(v.string()),
  }).index("by_orderId", ["orderId"]),

  // Medicines table
  medicines: defineTable({
    customerContact: v.string(),
    customerName: v.string(),
    isGeneric: v.optional(v.boolean()), // Made optional
    name: v.string(),
    orderId: v.string(),
    quantity: v.float64(),
    price: v.optional(v.union(v.float64(), v.string())), // Allow float or string, matching products table
    // Add optional fields
    skuId: v.optional(v.string()),
    productName: v.optional(v.string()),
    composition: v.optional(v.string()),
    genericCategory: v.optional(v.string()),
    medication: v.optional(v.string()),
    category: v.optional(v.string()),
    notForSale: v.optional(v.boolean()),
    prescriptionRequired: v.optional(v.string()),
    mrp: v.optional(v.union(v.float64(), v.string())), // Allow float or string, matching products table
    newIu: v.optional(v.float64()),
    disc: v.optional(v.float64()),
    sellingPrice: v.optional(v.float64()),
    brandName: v.optional(v.string()),
    genericId: v.optional(v.string()),
  })
  .index("by_orderId", ["orderId"])
  .index("by_productName_composition_brandName", ["productName", "composition", "brandName"])
  .searchIndex("search_productName", { searchField: "productName" })
  .searchIndex("search_composition", { searchField: "composition" })
  .searchIndex("search_brandName", { searchField: "brandName" }),

  // Products table (for your medicine inventory)
  products: defineTable({
    Brand_Name: v.union(v.float64(), v.string()),
    Category: v.string(),
    Compostion: v.string(),
    Disc: v.union(v.float64(), v.string()),
    Generic_Id: v.string(),
    Generic_category: v.string(),
    MRP: v.union(v.float64(), v.string()),
    Medication: v.string(),
    Not_for_Sale: v.union(v.number(), v.string()),
    Product_Name: v.string(),
    SKU_ID: v.string(),
    new_iu: v.union(v.float64(), v.string()),
    prescription_required: v.string(),
    Selling_price: v.optional(v.union(v.float64(), v.string())), // Allow float or string, make optional
  })
  .searchIndex("search_Product_Name", { searchField: "Product_Name" })
  .searchIndex("search_Compostion", { searchField: "Compostion" })
  .searchIndex("search_Brand_Name", { searchField: "Brand_Name" }),
}, {schemaValidation: true});