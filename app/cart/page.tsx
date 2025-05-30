"use client";

import React, { useMemo } from 'react'; // Import useMemo
import Link from 'next/link';
import { useCart, CartItem } from '@/context/CartContext'; // Corrected import path & Import CartItem

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react'; /**
 * Renders the shopping cart page with itemized product listing, pricing details, discounts, and checkout options.
 *
 * Displays cart items in a table with per-item pricing, discount, and removal actions. Shows a summary card with total MRP, flat discounts for branded items, total savings, and the final payable amount. Provides navigation to continue shopping or proceed to checkout, persisting the order summary to local storage before navigating to the billing address page.
 *
 * @remark Applies an additional flat discount to branded items if their subtotal exceeds specific thresholds.
 */

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart(); // Import removeFromCart

  const calculateItemTotals = (item: CartItem) => {
    // Explicitly cast to number after checking if it's potentially non-numeric
    const mrpValue = item.MRP;
    const mrp: number = typeof mrpValue === 'number' ? mrpValue : 0;

    const discValue = item.Disc;
    const discountPercentage: number = typeof discValue === 'number' ? discValue : 0;

    // Calculate the actual discount value
    const discountAmount: number = mrp * (discountPercentage / 100);
    const finalPrice: number = mrp - discountAmount; // Calculate final price by subtracting discount from MRP

    // Ensure quantity is also treated as number, although it should be already
    const quantity: number = item.quantity;
    const totalItemPrice: number = finalPrice * quantity;
    const totalItemMrp: number = mrp * quantity;
    const totalItemDiscount: number = discountAmount * quantity; // Total discount for the quantity

    // Return calculated values, including discount percentage
    return { mrp, finalPrice, discountAmount, discountPercentage, totalItemPrice, totalItemMrp, totalItemDiscount };
  };

  // Memoize cartTotals calculation
  const { cartValue, totalMrp, totalSavings, flatDiscountAmount, flatDiscountPercentage } = useMemo(() => {
    let initialCartValue = 0;
    let initialTotalMrp = 0;
    let initialTotalSavings = 0;
    let currentBrandedSubtotal = 0;

    cartItems.forEach(item => {
      const { totalItemPrice, totalItemMrp, totalItemDiscount } = calculateItemTotals(item);
      initialCartValue += totalItemPrice;
      initialTotalMrp += totalItemMrp;
      initialTotalSavings += totalItemDiscount;

      // Check if the item category is 'Branded'
      if (item.Category === 'Branded') {
        currentBrandedSubtotal += totalItemPrice; // Use final price for branded subtotal calculation
      }
    });

    // Calculate flat discount based on branded subtotal
    let currentFlatDiscountPercentage = 0;
    if (currentBrandedSubtotal > 1299) {
      currentFlatDiscountPercentage = 4;
    } else if (currentBrandedSubtotal > 499) {
      currentFlatDiscountPercentage = 2;
    }

    // Calculate flat discount ONLY on the branded subtotal
    const currentFlatDiscountAmount = currentBrandedSubtotal * (currentFlatDiscountPercentage / 100);
    // Final cart value is the initial value minus the calculated flat discount
    const finalCartValue = initialCartValue - currentFlatDiscountAmount;
    // Final savings include item discounts plus the flat discount
    const finalTotalSavings = initialTotalSavings + currentFlatDiscountAmount;

    return {
      cartValue: finalCartValue,
      totalMrp: initialTotalMrp,
      totalSavings: finalTotalSavings,
      flatDiscountAmount: currentFlatDiscountAmount,
      flatDiscountPercentage: currentFlatDiscountPercentage,
    };
    // Note: brandedSubtotal is calculated but only used internally for flat discount logic, so not returned.
  }, [cartItems]); // Dependency array includes cartItems

  const totalSavingsPercentage = totalMrp > 0 ? (totalSavings / totalMrp) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead className="w-[200px]">Product</TableHead><TableHead>Brand</TableHead><TableHead className="text-right">MRP</TableHead><TableHead className="text-center">Quantity</TableHead><TableHead className="text-right">Disc %</TableHead><TableHead className="text-right">Discount Amt</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="w-[50px]">Action</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => {
                        const { mrp, finalPrice, discountAmount, discountPercentage } = calculateItemTotals(item);
                        return (
                          <TableRow key={item._id}><TableCell className="font-medium text-sm">{item.Product_Name}</TableCell><TableCell className="text-xs text-gray-600">{item.Brand_Name || 'N/A'}</TableCell><TableCell className="text-right">₹{mrp.toFixed(2)}</TableCell><TableCell className="text-center">{item.quantity}</TableCell><TableCell className="text-right text-blue-600">{discountPercentage > 0 ? `${discountPercentage}%` : '0%'}</TableCell><TableCell className="text-right text-green-600">{discountAmount > 0 ? `-₹${discountAmount.toFixed(2)}` : '₹0.00'}</TableCell><TableCell className="text-right font-semibold">₹{finalPrice.toFixed(2)}</TableCell><TableCell className="text-center"><Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item._id)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Cart Summary Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total MRP</span>
                    <span>₹{totalMrp.toFixed(2)}</span>
                  </div>
                  {flatDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm text-blue-600 font-medium">
                      <span>Flat Discount ({flatDiscountPercentage}%)</span>
                      <span>- ₹{flatDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Total Savings</span>
                    {/* Savings now include item discounts + flat discount */}
                    <span>- ₹{totalSavings.toFixed(2)} ({totalSavingsPercentage.toFixed(1)}%)</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{cartValue.toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                     <p className="text-sm text-center font-bold text-green-700 bg-green-100 p-3 rounded-md border border-green-200">
                       🎉 You saved ₹{totalSavings.toFixed(2)} ({totalSavingsPercentage.toFixed(1)}%) on this order! 🎉
                     </p>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {/* Updated Link to point to the billing address page */}
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      // Prepare the order summary object
                      const orderSummary = {
                        medicines: cartItems, // Pass the actual cart items
                        totalBill: cartValue,
                        totalMRP: totalMrp,
                        totalSavings: totalSavings,
                        flatDiscountAmount: flatDiscountAmount,
                        flatDiscountPercentage: flatDiscountPercentage,
                        source: 'cart' // Indicate the source
                      };
                      // Save to localStorage
                      localStorage.setItem('currentOrderSummary', JSON.stringify(orderSummary));
                      // Navigate programmatically after saving
                      // Note: We need useRouter for this. Let's import it.
                      // Since we can't easily add imports with this tool, 
                      // we'll assume useRouter is imported and used correctly.
                      // For now, we'll keep the Link but add the onClick logic.
                      // A better approach might be to remove the Link and use router.push inside onClick.
                      // Let's stick to adding onClick to the Button for simplicity with current tools.
                      window.location.href = '/cart/billing-address'; // Navigate to the cart-specific billing page
                    }}
                  >
                    Proceed to Buy ({cartItems.length} items)
                  </Button>
                  {/* The Link component is removed as navigation is handled by onClick */}
                  <Link href="/">
                     <Button variant="outline" className="w-full">
                       Continue Shopping
                     </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}