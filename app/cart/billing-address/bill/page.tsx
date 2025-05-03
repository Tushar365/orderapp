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
import { CartItem } from '@/context/CartContext'; // Import CartItem type

// Define the structure for the summary data stored in localStorage
interface OrderSummary {
  medicines: CartItem[]; // Use CartItem type
  totalBill: number;
  totalMRP: number;
  totalSavings: number;
  flatDiscountAmount: number;
  flatDiscountPercentage: number;
  source: string;
}

// Billing Address type (assuming it's stored in localStorage)
type BillingAddress = {
  customerName: string;
  patientName: string;
  doctorName: string;
  mobile: string;
  age: string;
  address: string;
  pincode: string;
  // paymentMethod might be part of this or selected here
};

export default function CartBillPage() {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('cod'); // Default to COD
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSummary = localStorage.getItem('currentOrderSummary');
      const savedAddress = localStorage.getItem('billingAddressData');
      let summaryError = null;
      let addressError = null;

      if (savedSummary) {
        try {
          const parsedSummary: OrderSummary = JSON.parse(savedSummary);
          // Validate source and basic structure
          if (parsedSummary && parsedSummary.source === 'cart' && parsedSummary.medicines && typeof parsedSummary.totalBill === 'number') {
            setOrderSummary(parsedSummary);
          } else {
            summaryError = 'Invalid or non-cart order summary data found.';
            console.warn(summaryError);
          }
        } catch (e) {
          summaryError = 'Failed to parse order summary.';
          console.error('Error parsing order summary from localStorage:', e);
        }
      } else {
        summaryError = 'No order summary found. Please go back to your cart.';
      }

      if (savedAddress) {
        try {
          const parsedAddress: BillingAddress = JSON.parse(savedAddress);
          // Basic validation for address
          if (parsedAddress && parsedAddress.customerName && parsedAddress.mobile) {
            setBillingAddress(parsedAddress);
          } else {
            addressError = 'Invalid billing address data found.';
            console.warn(addressError);
          }
        } catch (e) {
          addressError = 'Failed to parse billing address.';
          console.error('Error parsing billing address from localStorage:', e);
        }
      } else {
        addressError = 'No billing address found. Please go back and enter details.';
      }

      // Set combined error message if any error occurred
      const combinedError = [summaryError, addressError].filter(Boolean).join(' ');
      if (combinedError) {
        setError(combinedError);
      }

      setIsLoading(false);
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!orderSummary || !billingAddress) {
        setError('Missing order summary or billing address.');
        return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Prepare order data with all required fields
      const orderData = {
        // Customer and patient info from billingAddress
        customerName: billingAddress.customerName,
        patientName: billingAddress.patientName,
        doctorName: billingAddress.doctorName,
        mobile: billingAddress.mobile,
        age: billingAddress.age,
        address: billingAddress.address,
        pincode: billingAddress.pincode,

        // Order details from orderSummary, mapping medicines to match API expectation
        medicines: orderSummary.medicines.map(item => {
          console.log('Mapping item:', item); // Add logging here
          return {
            // Explicitly map required fields from the CartItem (Doc<"products"> & { quantity: number })
            // The API expects 'name' and 'quantity'.
            name: item.Product_Name, // Map Product_Name from CartItem (Doc<"products">) to the required 'name' field
            quantity: item.quantity,
            // Include other relevant fields if needed by the API, ensuring they exist on 'item'
            // Example: skuId: item.skuId, price: item.price etc.
            // Spreading ...item might include fields not expected or in the wrong format.
            // Let's be explicit based on the API validator requirements.
            // Optional fields from validator: brandName, category, disc, isGeneric, mrp, price, productName, sellingPrice, skuId
            // Map from CartItem (Doc<"products">) properties to API expected properties
            skuId: item.SKU_ID, // Map from item.SKU_ID (assuming this is the correct property on Doc<"products">)
            price: item.Selling_price, // Map from item.Selling_price which exists on CartItem type
            mrp: item.MRP,     // Map from item.MRP (assuming this is the correct property)
            // Add other optional fields from 'item' as required by the API
            isGeneric: !!item.Generic_category // Map from Generic_category (string) to isGeneric (boolean)
            // Ensure all fields expected by the API validator are present or optional
            // The validator expects: name, quantity, and optionally others like skuId, price etc.
            // Add other fields if necessary based on the exact API requirements/validator
          };
        }),
        totalBill: orderSummary.totalBill,
        totalMRP: orderSummary.totalMRP,
        totalSavings: orderSummary.totalSavings,
        flatDiscountAmount: orderSummary.flatDiscountAmount,
        flatDiscountPercentage: orderSummary.flatDiscountPercentage,

        // Payment method
        paymentMethod: paymentMethod,

        // Prescription URL (Needs logic for handling upload if implemented)
        prescriptionUrl: '', // Placeholder - Add logic if prescription upload is part of this flow
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

      // Show success message (Consider a more integrated notification system)
      alert(`Order Placed Successfully! Order ID: ${result.orderId}\nPayment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}\nTotal: ₹${orderSummary.totalBill.toFixed(2)}`);

      // Clear data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentOrderSummary');
        // Keep billingAddressData for potential future use
        // localStorage.removeItem('billingAddressData');
      }

      // Redirect to home or order confirmation page
      router.push('/'); // Redirect to homepage after successful order
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

  if (error || !orderSummary || !billingAddress) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="flex-1 w-full max-w-2xl p-4 md:p-8 flex flex-col items-center justify-center">
          <p className="text-red-600 font-semibold mb-4 text-center">{error || 'Could not load order details. Please check your cart and address.'}</p>
          <Button onClick={() => router.push('/cart')}>Go Back to Cart</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="flex-1 w-full max-w-2xl p-4 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Confirm Order & Payment</h2>

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
                <span>Flat Discount ({orderSummary.flatDiscountPercentage}%):</span>
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

        {/* Display Billing Address for Confirmation */} 
        <Card className="mb-6 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-1">
            <p><strong>Customer:</strong> {billingAddress.customerName}</p>
            <p><strong>Patient:</strong> {billingAddress.patientName}</p>
            {billingAddress.doctorName && <p><strong>Doctor:</strong> {billingAddress.doctorName}</p>}
            <p><strong>Mobile:</strong> {billingAddress.mobile}</p>
            <p><strong>Age:</strong> {billingAddress.age}</p>
            <p><strong>Address:</strong> {billingAddress.address}</p>
            <p><strong>Pincode:</strong> {billingAddress.pincode}</p>
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
              disabled={isSubmitting || paymentMethod === 'card'} // Disable during submission or if card payment is selected (as it's not implemented)
            >
              {isSubmitting ? (
                'Placing Order...'
              ) : (
                <>Place Order <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </CardFooter>
        </Card>

      </main>
      <Footer />
    </div>
  );
}