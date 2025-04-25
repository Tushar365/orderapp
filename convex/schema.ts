import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Orders table
  orders: defineTable({
    address: v.string(),
    contact: v.string(),
    genericBill: v.float64(),
    medicineCount: v.float64(),
    name: v.string(),
    orderId: v.string(),
    pincode: v.string(),
    prescriptionUrl: v.optional(v.string()), // Made optional
    status: v.string(),
    timestamp: v.float64(),
    totalBill: v.float64(),
  }).index("by_orderId", ["orderId"]),

  // Medicines table
  medicines: defineTable({
    customerContact: v.string(),
    customerName: v.string(),
    isGeneric: v.optional(v.boolean()), // Made optional
    name: v.string(),
    orderId: v.string(),
    quantity: v.float64(),
    price: v.optional(v.float64()), // Added optional price
    // Add optional fields
    skuId: v.optional(v.string()),
    productName: v.optional(v.string()),
    composition: v.optional(v.string()),
    genericCategory: v.optional(v.string()),
    medication: v.optional(v.string()),
    category: v.optional(v.string()),
    notForSale: v.optional(v.boolean()),
    prescriptionRequired: v.optional(v.string()),
    mrp: v.optional(v.float64()),
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