// File: app/orders/components/MedicineSearch.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Medicine } from "../page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search as SearchIcon, Loader2 } from "lucide-react";

interface MedicineSearchProps {
  addMedicineAction: (medicine: Omit<Medicine, 'sl_no'>) => void;
}

// Helper to safely parse numeric values from product data
const parseNumeric = (value: string | number | undefined | null): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed; // Default to 0 if parsing fails
  }
  return 0; // Default for undefined or null
};

export default function MedicineSearch({ addMedicineAction }: MedicineSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Doc<"products"> | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch search results using Convex query
  const searchResults = useQuery(
    api.productsearch.searchProducts,
    debouncedSearchTerm ? { searchTerm: debouncedSearchTerm } : "skip"
  );

  const handleSelectProduct = (product: Doc<"products">) => {
    setSelectedProduct(product);
    setSearchTerm(product.Product_Name); // Fill input with selected product name
    setQuantity(1); // Reset quantity
  };

  const handleAddMedicine = () => {
    if (!selectedProduct) return;

    const mrp = parseNumeric(selectedProduct.MRP);
    const sellingPrice = parseNumeric(selectedProduct.Selling_price);
    const discount = mrp > 0 ? ((mrp - sellingPrice) / mrp) * 100 : 0;

    const medicineToAdd: Omit<Medicine, 'sl_no'> = {
      productId: selectedProduct.SKU_ID,
      name: selectedProduct.Product_Name,
      brandName: String(selectedProduct.Brand_Name), // Convert Brand_Name to string
      category: String(selectedProduct.Category), // Add category
      quantity: Math.min(Math.max(1, quantity), 50), // Ensure quantity is between 1 and 50
      price: sellingPrice,
      mrp: mrp,
      discount: discount, // Calculate discount
    };

    addMedicineAction(medicineToAdd);

    // Reset fields after adding
    setSearchTerm("");
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.min(Math.max(1, value), 50));
  };

  return (
    <Card className="bg-white shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Search & Add Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Label htmlFor="medicineSearch" className="text-sm font-medium text-gray-700 mb-1 block">
              Search Medicine
            </Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="medicineSearch"
                type="text"
                placeholder="Search by name, brand, or composition..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedProduct(null); // Clear selection when typing
                }}
                className="pl-10 p-2 border border-gray-300 rounded-md bg-white text-gray-900 w-full"
              />
            </div>
            {/* Search Results Dropdown */}
            {debouncedSearchTerm && searchResults !== undefined && !selectedProduct && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults === null ? (
                  <div className="p-3 text-center text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Loading...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">No products found.</div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <p className="font-medium text-sm text-gray-800">{product.Product_Name}</p>
                      <p className="text-xs text-gray-500">{product.Brand_Name} ({product.Category})</p> {/* Removed Pack_Size */}
                      <p className="text-xs text-gray-500">Composition: {product.Compostion}</p>
                      <p className="text-xs text-gray-600">MRP: <span className="line-through">₹{parseNumeric(product.MRP).toFixed(2)}</span> | Price: <span className="font-semibold">₹{parseNumeric(product.Selling_price).toFixed(2)}</span></p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quantity and Add Button */}
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-2">
              {/* Quantity Input */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={50}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center p-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  />
                  <Button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    +
                  </Button>
                </div>
                 <p className="text-xs text-gray-500 mt-1">Max: 50</p>
              </div>

              {/* Price Display */}
              <div className="flex flex-col gap-1 md:col-span-1">
                 <Label className="text-sm font-medium text-gray-700">Price Details</Label>
                 <div className="text-sm">
                    <p>MRP: <span className="line-through text-gray-500">₹{parseNumeric(selectedProduct.MRP).toFixed(2)}</span></p>
                    <p>Price: <span className="font-semibold text-blue-700">₹{parseNumeric(selectedProduct.Selling_price).toFixed(2)}</span></p>
                 </div>
              </div>

              {/* Add Button */}
              <Button
                type="button"
                onClick={handleAddMedicine}
                className="bg-blue-600 hover:bg-blue-700 text-white md:mt-0 mt-4"
              >
                <Plus className="h-4 w-4 mr-1" /> Add to Order
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}