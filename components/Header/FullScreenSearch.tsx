"use client";

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from 'use-debounce'; // Assuming use-debounce is installed
import { useCart } from '@/context/CartContext'; // Corrected import path

interface FullScreenSearchProps {
  onCloseAction: () => void; // Renamed from onClose
}

// Helper function to calculate discounted price, handling potential string types
const calculateDiscountedPrice = (mrp: number | string | undefined | null, discount: number | string | undefined | null): number | null => {
  const mrpNum = typeof mrp === 'string' ? parseFloat(mrp) : mrp;
  const discountNum = typeof discount === 'string' ? parseFloat(discount) : discount;

  if (typeof mrpNum !== 'number' || isNaN(mrpNum) || typeof discountNum !== 'number' || isNaN(discountNum)) {
    return null; // Return null if MRP or discount is not a valid number after conversion
  }
  const discountAmount = (mrpNum * discountNum) / 100;
  return Math.round((mrpNum - discountAmount) * 100) / 100; // Calculate and round to 2 decimal places
};

export default function FullScreenSearch({ onCloseAction }: FullScreenSearchProps) { // Renamed prop
  const { addToCart } = useCart(); // Get addToCart function from context
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({}); // State to hold quantities for each product
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Debounce search input by 300ms
  const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set()); // State to track added products

  // Callback to handle quantity change for a specific product
  const handleQuantityChange = useCallback((productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, quantity) })); // Ensure quantity is at least 1
  }, []);

  // Callback to handle adding item to cart
  const handleAddToCart = useCallback((product: Doc<"products">) => {
    const quantity = quantities[product._id] || 1; // Default to 1 if not set
    addToCart(product, quantity);
    setAddedProductIds(prev => new Set(prev).add(product._id)); // Add product ID to the set
    // Optional: Add visual feedback like a toast notification here
    console.log(`Added ${quantity} of ${product.Product_Name} to cart`);

    // Optional: Reset the button state after a delay
    setTimeout(() => {
      setAddedProductIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }, 2000); // Reset after 2 seconds

  }, [quantities, addToCart]);

  const searchResults = useQuery(
    api.productsearch.searchProducts,
    debouncedSearchTerm ? { searchTerm: debouncedSearchTerm } : 'skip'
  );

  // Handle escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseAction(); // Use renamed prop
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseAction]); // Use renamed prop in dependency array

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header with Search Input and Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Input
            type="text"
            placeholder="Search for medicines, health products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow mr-4 text-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={onCloseAction} aria-label="Close search"> {/* Use renamed prop */}
            <X className="h-6 w-6 text-gray-500" />
          </Button>
        </div>

        {/* Results Table */}
        <div className="flex-grow overflow-y-auto">
          {searchResults === undefined && debouncedSearchTerm && (
            <div className="p-6 text-center text-gray-500">Loading results...</div>
          )}
          {searchResults && searchResults.length === 0 && debouncedSearchTerm && (
            <div className="p-6 text-center text-gray-500">No products found for &quot;{debouncedSearchTerm}&quot;.</div>
          )}
          {searchResults && searchResults.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Product Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">MRP (₹)</TableHead>
                  <TableHead className="text-right">Discount (%)</TableHead>
                  <TableHead className="text-right font-semibold">Price (₹)</TableHead>
                  <TableHead className="text-center w-[15%]">Quantity</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((product: Doc<"products">) => {
                  // Use product.Disc and handle potential string types for MRP and Disc
                  const discountedPrice = calculateDiscountedPrice(product.MRP, product.Disc);
                  const mrpNum = typeof product.MRP === 'string' ? parseFloat(product.MRP) : product.MRP;
                  const discNum = typeof product.Disc === 'string' ? parseFloat(product.Disc) : product.Disc;

                  const isAdded = addedProductIds.has(product._id);

                  return (
                    <TableRow key={product._id}><TableCell className="font-medium">{product.Product_Name || 'N/A'}</TableCell><TableCell>{typeof product.Brand_Name === 'number' ? product.Brand_Name.toString() : product.Brand_Name || 'N/A'}</TableCell>{/* Handle potential number type for Brand_Name */}<TableCell className="text-right">{typeof mrpNum === 'number' && !isNaN(mrpNum) ? mrpNum.toFixed(2) : 'N/A'}</TableCell><TableCell className="text-right text-green-600">{typeof discNum === 'number' && !isNaN(discNum) ? `${discNum}%` : '0%'}</TableCell><TableCell className="text-right font-semibold">{discountedPrice !== null ? discountedPrice.toFixed(2) : (typeof mrpNum === 'number' && !isNaN(mrpNum) ? mrpNum.toFixed(2) : 'N/A')}</TableCell><TableCell className="text-center"><Input
                          type="number"
                          min="1"
                          value={quantities[product._id] || 1}
                          onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value, 10))}
                          className="w-16 text-center mx-auto"
                        /></TableCell><TableCell className="text-center">
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(product)}
                            className={isAdded ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                            disabled={isAdded}
                          >
                            {isAdded ? 'Added ✓' : 'Add'}
                          </Button>
                        </TableCell></TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {!debouncedSearchTerm && (
             <div className="p-6 text-center text-gray-400">Start typing to search for products.</div>
          )}
        </div>
      </div>
    </div>
  );
}