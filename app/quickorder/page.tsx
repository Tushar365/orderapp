// File: app/orders/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react"; // Import useEffect

import { useRouter } from 'next/navigation'; // Import useRouter
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MedicineSearch from "./components/MedicineSearch"; // Import the new search component
import MedicineList from "./components/MedicineList";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

// Define types
// Define types
export type Medicine = {
  sl_no: number;
  productId: string; // Corresponds to SKU_ID
  name: string;
  brandName: string; // Add brand name
  category: string; // Added category
  quantity: number;
  price: number; // Selling_price
  mrp: number; // MRP
  discount?: number; // Optional discount percentage or amount
};

// Simplified Order Data for this page (only medicines)
export type OrderData = {
  medicines: Medicine[];
};

export default function OrderPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData>({ medicines: [] });

  // Effect to load order data from localStorage on initial mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrder = localStorage.getItem('quickOrderData');
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          // Basic validation to ensure it has a medicines array
          if (parsedOrder && Array.isArray(parsedOrder.medicines)) {
            setOrderData(parsedOrder);
          } else {
             console.warn("Invalid order data found in localStorage, resetting.");
             localStorage.removeItem('quickOrderData');
          }
        } catch (error) {
          console.error("Error parsing quick order data from localStorage:", error);
          localStorage.removeItem('quickOrderData'); // Clear invalid data
        }
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save order data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickOrderData', JSON.stringify(orderData));
    }
  }, [orderData]); // Dependency array ensures this runs whenever orderData changes

  // State update handler for medicines
  const updateMedicines = (medicines: Medicine[]) => {
    setOrderData({ medicines });
  };

  // Remove medicine handler
  const removeMedicine = (index: number) => {
    const updatedMedicines = [...orderData.medicines];
    updatedMedicines.splice(index, 1);
    
    // Re-number sl_no
    const renumberedMedicines = updatedMedicines.map((med, idx) => ({
      ...med,
      sl_no: idx + 1,
    }));
    
    updateMedicines(renumberedMedicines);
  };

  // Add medicine handler (to be implemented in MedicineSearch)
  const addMedicine = (medicine: Omit<Medicine, 'sl_no'>) => {
    const newMedicine: Medicine = {
      ...medicine,
      sl_no: orderData.medicines.length + 1,
    };
    updateMedicines([...orderData.medicines, newMedicine]);
  };

  // Calculate totals with flat discount for Branded items
  const { totalBill, totalMRP, totalSavings, flatDiscountAmount, flatDiscountPercentage } = useMemo(() => {
    let initialTotalBill = 0;
    let initialTotalMRP = 0;
    let brandedSubtotal = 0;

    orderData.medicines.forEach(med => {
      const itemTotal = med.price * med.quantity;
      const itemMRP = med.mrp * med.quantity;
      initialTotalBill += itemTotal;
      initialTotalMRP += itemMRP;

      if (med.category === 'Branded') {
        brandedSubtotal += itemTotal;
      }
    });

    let currentFlatDiscountPercentage = 0;
    if (brandedSubtotal > 1299) {
      currentFlatDiscountPercentage = 4;
    } else if (brandedSubtotal > 499) {
      currentFlatDiscountPercentage = 2;
    }

    const initialTotalSavings = initialTotalMRP - initialTotalBill;
    // Calculate flat discount ONLY on the branded subtotal
    const currentFlatDiscountAmount = brandedSubtotal * (currentFlatDiscountPercentage / 100);
    // Final total bill is the initial bill minus the calculated flat discount
    const finalTotalBill = initialTotalBill - currentFlatDiscountAmount;
    // Final savings include item discounts plus the flat discount
    const finalTotalSavings = initialTotalSavings + currentFlatDiscountAmount;

    return {
      totalBill: finalTotalBill,
      totalMRP: initialTotalMRP,
      totalSavings: finalTotalSavings,
      flatDiscountAmount: currentFlatDiscountAmount,
      flatDiscountPercentage: currentFlatDiscountPercentage,
    };
  }, [orderData.medicines]);

  // Navigate to billing page
  const goToBilling = () => {
    // Store orderData and totals in localStorage before navigating
    const summaryData = {
      medicines: orderData.medicines,
      totalBill,
      totalMRP,
      totalSavings,
      flatDiscountAmount,
      flatDiscountPercentage,
      source: 'quick-order' // Identify the source page
    };
    localStorage.setItem('currentOrderSummary', JSON.stringify(summaryData));
    // Clear the quick order data after proceeding to billing
    if (typeof window !== 'undefined') {
        localStorage.removeItem('quickOrderData');
    }
    router.push('/quickorder/billing'); // Corrected path
  };

  // Form validation
  const isMedicinesValid = orderData.medicines.length > 0;
  
  // Rendering
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl p-4 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Order</h2>
        
        {/* Medicine Search Component */}
        <MedicineSearch addMedicineAction={addMedicine} />

        {/* Medicine List */}
        <MedicineList 
          medicines={orderData.medicines} 
          onRemoveAction={removeMedicine} 
        />

        {/* Order Summary Card */}
        {isMedicinesValid && (
          <Card className="mt-6 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Total MRP:</span>
                <span className="line-through">₹{totalMRP.toFixed(2)}</span>
              </div>
               {flatDiscountAmount > 0 && (
                <div className="flex justify-between text-sm text-blue-600 font-medium">
                  <span>Flat Discount ({flatDiscountPercentage}% on Branded):</span>
                  <span>- ₹{flatDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Total Savings:</span>
                 {/* Savings now include item discounts + flat discount */}
                <span>₹{totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                <span>Total Bill:</span>
                <span>₹{totalBill.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Navigation Button */}
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={goToBilling}
            disabled={!isMedicinesValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next: Billing Address <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
