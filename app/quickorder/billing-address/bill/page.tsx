"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, CreditCard, Truck } from 'lucide-react';
import { Medicine } from '../../page'; // Assuming Medicine type is exported from quickorder/page.tsx

// Define the structure for the summary data stored in localStorage
interface OrderSummary {
  medicines: Medicine[];
  totalBill: number;
  totalMRP: number;
  totalSavings: number;
  flatDiscountAmount: number;
  flatDiscountPercentage: number;
  source: string;
}

export default function BillingPage() {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('cod'); // Default to COD
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSummary = localStorage.getItem('currentOrderSummary');
      if (savedSummary) {
        try {
          const parsedSummary: OrderSummary = JSON.parse(savedSummary);
          // Basic validation
          if (parsedSummary && parsedSummary.medicines && typeof parsedSummary.totalBill === 'number') {
            setOrderSummary(parsedSummary);
          } else {
            setError('Invalid order summary data found.');
            console.warn('Invalid order summary data found in localStorage.');
          }
        } catch (e) {
          setError('Failed to parse order summary.');
          console.error('Error parsing order summary from localStorage:', e);
        }
      } else {
        setError('No order summary found. Please go back and add items.');
        // Optionally redirect back or show a message
        // router.push('/quickorder');
      }
      setIsLoading(false);
    }
  }, [router]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!orderSummary) return;
    
    setIsSubmitting(true);
    setOrderError(null);
    
    try {
      // Get billing address data from localStorage
      const billingAddressData = localStorage.getItem('billingAddressData');
      if (!billingAddressData) {
        throw new Error('Billing address information not found');
      }
      
      const billingAddress = JSON.parse(billingAddressData);
      
      // Prepare order data with all required fields
      const orderData = {
        // Customer and patient info
        customerName: billingAddress.customerName,
        patientName: billingAddress.patientName,
        doctorName: billingAddress.doctorName,
        mobile: billingAddress.mobile,
        age: billingAddress.age,
        address: billingAddress.address,
        pincode: billingAddress.pincode,
        
        // Order details
        medicines: orderSummary.medicines,
        totalBill: orderSummary.totalBill,
        totalMRP: orderSummary.totalMRP,
        totalSavings: orderSummary.totalSavings,
        flatDiscountAmount: orderSummary.flatDiscountAmount,
        flatDiscountPercentage: orderSummary.flatDiscountPercentage,
        
        // Payment method
        paymentMethod: paymentMethod,
        
        // Prescription URL (if available)
        prescriptionUrl: '', // This would be set after uploading the prescription file
      };
      
      // Submit order to API
      const response = await fetch('/api/submit-order/route-extended', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }
      
      // Store the order ID
      setOrderId(result.orderId);
      
      // Show success message
      alert(`Order Placed Successfully! Order ID: ${result.orderId}\nPayment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}\nTotal: ₹${orderSummary.totalBill.toFixed(2)}`);
      
      // Clear data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentOrderSummary');
        localStorage.removeItem('quickOrderData');
        // Don't remove billingAddressData to keep it for future orders
      }
      
      // Redirect to home or order confirmation page
      router.push('/');
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="flex-1 w-full max-w-2xl p-4 md:p-8 flex items-center justify-center">
          <p className="text-gray-600">Loading order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !orderSummary) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="flex-1 w-full max-w-2xl p-4 md:p-8 flex flex-col items-center justify-center">
          <p className="text-red-600 font-semibold mb-4">{error || 'Could not load order summary.'}</p>
          <Button onClick={() => router.push('/quickorder')}>Go Back to Order</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="flex-1 w-full max-w-2xl p-4 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Billing & Payment</h2>

        <Card className="mb-6 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Total MRP:</span>
              <span className="line-through">₹{orderSummary.totalMRP.toFixed(2)}</span>
            </div>
            {orderSummary.flatDiscountAmount > 0 && (
              <div className="flex justify-between text-sm text-blue-600 font-medium">
                <span>Flat Discount ({orderSummary.flatDiscountPercentage}% on Branded):</span>
                <span>- ₹{orderSummary.flatDiscountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Total Savings:</span>
              <span>₹{orderSummary.totalSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-200 mt-2">
              <span>Total Bill:</span>
              <span>₹{orderSummary.totalBill.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
              <Label
                htmlFor="cod"
                className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <RadioGroupItem value="cod" id="cod" />
                <Truck className="h-5 w-5 text-gray-700" />
                <span className="font-medium text-gray-800">Cash on Delivery (COD)</span>
              </Label>
              <Label
                htmlFor="card"
                className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-gray-700" />
                <span className="font-medium text-gray-800">Credit/Debit Card (Online Payment)</span>
                 {/* Placeholder for card details form if needed */}
                 {paymentMethod === 'card' && <span className="text-sm text-gray-500 ml-auto">(Not implemented)</span>}
              </Label>
            </RadioGroup>
          </CardContent>
          <CardFooter className="mt-4 border-t pt-4 flex flex-col gap-2">
            {orderError && (
              <div className="w-full p-2 mb-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                {orderError}
              </div>
            )}
            {orderId && (
              <div className="w-full p-2 mb-2 bg-green-50 text-green-600 text-sm rounded border border-green-200">
                Order placed successfully! Order ID: {orderId}
              </div>
            )}
            <Button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting || paymentMethod === 'card'} // Disable during submission or if card payment is selected
            >
              {isSubmitting ? (
                'Processing Order...' 
              ) : (
                <>Check Out & Place Order <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </CardFooter>
        </Card>

      </main>
      <Footer />
    </div>
  );
}