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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select imports
import { ArrowLeft, CreditCard, Upload } from 'lucide-react'; // Added CreditCard, Truck, Upload
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

// Updated Billing Address type
type BillingAddress = {
  customerName: string; // Changed from name
  patientName: string;  // New field
  doctorName: string;   // New field
  mobile: string;
  age: string;          // New field, using string for input flexibility
  address: string;      // Changed from addressLine1/2
  pincode: string;
  paymentMethod: 'COD' | 'Card' | ''; // Added payment method
};

export default function BillingPage() {
  const router = useRouter();
  // Initialize state with default values always for consistent server/client initial render
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    customerName: '',
    patientName: '',
    doctorName: '',
    mobile: '',
    age: '',
    address: '',
    pincode: '',
    paymentMethod: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null); // State to hold the summary with defined type
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null); // State for prescription file

  // Effect to load billing address from localStorage on client mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('billingAddressData');
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        // Ensure pincode is always a string, even if localStorage had null/undefined
        parsedAddress.pincode = String(parsedAddress.pincode || ''); 
        setBillingAddress(parsedAddress);
      } catch (error) {
        console.error("Error parsing billing address from localStorage:", error);
        localStorage.removeItem('billingAddressData'); // Clear invalid data
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save billing address to localStorage whenever it changes
  useEffect(() => {
    // Only save if the address is not the initial empty state (optional optimization)
    if (Object.values(billingAddress).some(val => val !== '')) {
        localStorage.setItem('billingAddressData', JSON.stringify(billingAddress));
    }
  }, [billingAddress]);

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

  // Updated input handler to work with both Input and Select
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | string, fieldName?: string) => {
    let name: string;
    let value: string;

    if (typeof e === 'string') {
        // Handle direct value change (e.g., from Select)
        if (!fieldName) {
            console.error("Field name is required when passing a direct value to handleInputChange");
            return;
        }
        name = fieldName;
        value = e;
    } else {
        // Handle event object (e.g., from Input)
        name = e.target.name;
        value = e.target.value;
    }

    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
      console.log('Prescription file selected:', e.target.files[0].name);
    } else {
      setPrescriptionFile(null);
    }
  };

  const handleProceedToPayment = () => {
    setIsSubmitting(true);
    console.log('Proceeding to payment with Billing Address:', billingAddress);
    console.log('Prescription File:', prescriptionFile?.name);
    // Billing address is already saved in localStorage by the useEffect
    // TODO: Add logic to handle prescription file upload if needed before navigating
    // Navigate to the payment selection page
    router.push('/quickorder/billing-address/bill');
    // No need to set isSubmitting back to false here, as the page will navigate away
    // If navigation fails or is slow, consider adding setIsSubmitting(false) in a finally block or error handler
  };

  // Basic validation (can be enhanced)
  const isFormValid =
    billingAddress.customerName.trim() !== '' &&
    billingAddress.patientName.trim() !== '' &&
    // billingAddress.doctorName.trim() !== '' && // Doctor Name can be optional
    billingAddress.mobile.trim().length === 10 && // Simple mobile check
    billingAddress.age.trim() !== '' && // Simple age check
    billingAddress.address.trim() !== '' &&
    billingAddress.pincode.trim() !== ''; // Updated pincode check (not empty)
    // Removed paymentMethod check as it's selected on the next page

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
              {/* Row 1: Customer Name, Patient Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" name="customerName" value={billingAddress.customerName} onChange={handleInputChange} placeholder="Enter customer name" required />
                </div>
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" name="patientName" value={billingAddress.patientName} onChange={handleInputChange} placeholder="Enter patient name" required />
                </div>
              </div>
              {/* Row 2: Doctor Name, Mobile Number, Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div>
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input id="doctorName" name="doctorName" value={billingAddress.doctorName} onChange={handleInputChange} placeholder="Enter doctor name (Optional)" />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" name="mobile" type="tel" value={billingAddress.mobile} onChange={handleInputChange} placeholder="Enter 10-digit mobile" maxLength={10} required />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={billingAddress.age} onChange={handleInputChange} placeholder="Enter age" required />
                </div>
              </div>
              {/* Row 3: Address */}
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={billingAddress.address} onChange={handleInputChange} placeholder="Enter full address" required />
              </div>
              {/* Row 4: Pincode - Changed to Select */}
              <div>
                <Label htmlFor="pincode">Pin Code</Label>
                <Select 
                  name="pincode" 
                  value={billingAddress.pincode} 
                  onValueChange={(value) => handleInputChange(value, 'pincode')} 
                  required
                >
                  <SelectTrigger id="pincode">
                    <SelectValue placeholder="Select Pin Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Placeholder - Add actual pincodes here later */}
                    <SelectItem value="110001">110001</SelectItem>
                    <SelectItem value="110002">110002</SelectItem>
                    {/* ... (add more pincodes) */}
                  </SelectContent>
                </Select>
              </div>

              {/* Prescription Upload Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Label htmlFor="prescriptionUpload" className="flex items-center gap-2 mb-2 cursor-pointer">
                  <Upload className="h-5 w-5 text-gray-600" />
                  <span>Upload Prescription (Optional)</span>
                </Label>
                <Input 
                  id="prescriptionUpload" 
                  name="prescriptionUpload" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png" // Specify acceptable file types
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {prescriptionFile && (
                  <p className="text-xs text-green-600 mt-1">Selected: {prescriptionFile.name}</p>
                )}
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
            {/* Moved Payment Selection above */}
            <CardFooter>
              <Button 
                type="button" 
                onClick={handleProceedToPayment} 
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700" // Changed button color to blue
              >
                {isSubmitting ? 'Processing...' : <><CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
