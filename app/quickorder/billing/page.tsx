// File: app/orders/billing/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Medicine } from '../page'; // Import Medicine type from the parent page

// Type for Order Summary data passed via localStorage
interface OrderSummary {
  medicines: Medicine[];
  totalBill: number;
  totalMRP: number;
  totalSavings: number;
  flatDiscountAmount: number;
  flatDiscountPercentage: number;
  source: string;
}

// Placeholder type for Billing Address - adjust as needed
type BillingAddress = {
  name: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
};

export default function BillingPage() {
  const router = useRouter();
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    name: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null); // State to hold the summary with defined type

  // Fetch order details from localStorage on component mount
  useEffect(() => {
    const storedSummary = localStorage.getItem('currentOrderSummary');
    if (storedSummary) {
      try {
        setOrderSummary(JSON.parse(storedSummary));
      } catch (error) {
        console.error("Error parsing order summary from localStorage:", error);
        // Handle error, maybe redirect back or show a message
      }
    }
    // Optional: Clear the summary from localStorage after retrieving it
    // localStorage.removeItem('currentOrderSummary'); 
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    console.log('Billing Address:', billingAddress);
    // TODO: Add logic to submit the order (e.g., call an API)
    // await submitOrder({ ...orderData, billingAddress });
    alert('Order Confirmed (Placeholder)!'); // Placeholder confirmation
    // TODO: Navigate to an order confirmation/success page
    // router.push('/order-success');
    setIsSubmitting(false);
  };

  // Basic validation (can be enhanced)
  const isFormValid = 
    billingAddress.name.trim() !== '' &&
    billingAddress.mobile.trim().length === 10 && // Simple mobile check
    billingAddress.addressLine1.trim() !== '' &&
    billingAddress.pincode.trim().length === 6 && // Simple pincode check
    billingAddress.city.trim() !== '' &&
    billingAddress.state.trim() !== '';

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-1 w-full max-w-4xl p-4 md:p-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()} 
          className="mb-4 text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Order
        </Button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Billing Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Billing Address Form */}
          <Card className="md:col-span-2 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Enter Your Billing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={billingAddress.name} onChange={handleInputChange} placeholder="Enter your full name" required />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" name="mobile" type="tel" value={billingAddress.mobile} onChange={handleInputChange} placeholder="Enter 10-digit mobile number" maxLength={10} required />
                </div>
              </div>
              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input id="addressLine1" name="addressLine1" value={billingAddress.addressLine1} onChange={handleInputChange} placeholder="Flat, House no., Building, Company, Apartment" required />
              </div>
              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input id="addressLine2" name="addressLine2" value={billingAddress.addressLine2} onChange={handleInputChange} placeholder="Area, Colony, Street, Sector, Village" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" name="pincode" value={billingAddress.pincode} onChange={handleInputChange} placeholder="Enter 6-digit pincode" maxLength={6} required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={billingAddress.city} onChange={handleInputChange} placeholder="Enter city" required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={billingAddress.state} onChange={handleInputChange} placeholder="Enter state" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Placeholder */}
          <Card className="md:col-span-1 bg-white shadow-md h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {orderSummary ? (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Items:</span>
                    <span>{orderSummary.medicines?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total MRP:</span>
                    <span className="line-through">₹{orderSummary.totalMRP?.toFixed(2) ?? '0.00'}</span>
                  </div>
                   {orderSummary.flatDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm text-blue-600 font-medium">
                      <span>Flat Discount ({orderSummary.flatDiscountPercentage}%):</span>
                      <span>- ₹{orderSummary.flatDiscountAmount?.toFixed(2) ?? '0.00'}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Total Savings:</span>
                    <span>₹{orderSummary.totalSavings?.toFixed(2) ?? '0.00'}</span>
                  </div>
                  <hr className="my-2"/>
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Bill:</span>
                    <span>₹{orderSummary.totalBill?.toFixed(2) ?? '0.00'}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">Loading order summary...</p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                type="button" 
                onClick={handleConfirmOrder} 
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Processing...' : <><CheckCircle className="mr-2 h-4 w-4" /> Confirm Order</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}