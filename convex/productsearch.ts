import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel"; // Added import

// Search products by productName, brandName, and composition from the products table
// Optimized for speed and accuracy with sequential fallback search strategy
export const searchProducts = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const { searchTerm } = args;
    
    if (!searchTerm || searchTerm.trim() === "") {
      return [];
    }
    
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    
    // First try Product_Name search (highest priority)
    let productNameResults = await ctx.db.query("products")
      .withSearchIndex("search_Product_Name", q => 
        q.search("Product_Name", trimmedSearchTerm))
      .take(15);
    
    // If we don't have enough results from Product_Name, try Brand_Name
    let brandNameResults: Doc<"products">[] = []; // Explicitly typed
    if (productNameResults.length < 5) {
      brandNameResults = await ctx.db.query("products")
        .withSearchIndex("search_Brand_Name", q => 
          q.search("Brand_Name", trimmedSearchTerm))
        .take(10);
    }
    
    // If we still don't have enough results, try Composition
    let compositionResults: Doc<"products">[] = []; // Explicitly typed
    if (productNameResults.length + brandNameResults.length < 5) {
      compositionResults = await ctx.db.query("products")
        .withSearchIndex("search_Compostion", q => 
          q.search("Compostion", trimmedSearchTerm))
        .take(10);
    }
    
    // Combine results with priority (productName > brandName > composition)
    const seen = new Set();
    const allResults = [];
    
    // Add product name matches first (highest priority)
    for (const item of productNameResults) {
      if (!seen.has(item._id)) {
        seen.add(item._id);
        allResults.push(item);
      }
    }
    
    // Add brand name matches next (second priority)
    for (const item of brandNameResults) {
      if (!seen.has(item._id)) {
        seen.add(item._id);
        allResults.push(item);
      }
    }
    
    // Add composition matches last (lowest priority)
    for (const item of compositionResults) {
      if (!seen.has(item._id)) {
        seen.add(item._id);
        allResults.push(item);
      }
    }
    
    return allResults.slice(0, 20); // Limit to 20 results
  },
});