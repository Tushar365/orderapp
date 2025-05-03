// File: app/api/submit-order/route-extended.ts
import { NextRequest, NextResponse } from 'next/server';
import { submitOrderToConvex } from '../convex-order';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    // Validate the order data
    if (!orderData.customerName || !orderData.patientName || !orderData.mobile || 
        !orderData.address || !orderData.pincode || !orderData.medicines || 
        !orderData.medicines.length) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }
    
    // Set default values for required fields
    const currentDate = new Date().toISOString();
    const location = orderData.location || 'Online';
    const numberOfProducts = orderData.medicines.length;
    
    // Calculate generic and branded amounts
    let genericAmount = 0;
    let brandedAmount = 0;

    // Define an interface for medicine items based on usage
    interface MedicineItem {
      price: number;
      quantity: number;
      category?: string;
      // Add other potential fields if needed based on orderData structure
    }
    
    orderData.medicines.forEach((med: MedicineItem) => {
      const itemTotal = med.price * med.quantity;
      if (med.category?.toLowerCase() === 'generic') {
        genericAmount += itemTotal;
      } else {
        brandedAmount += itemTotal;
      }
    });
    
    // Calculate service charges (example calculation - adjust as needed)
    const brandedServiceCharge = brandedAmount * 0.05; // 5% service charge on branded
    const genericServiceCharge = genericAmount * 0.03; // 3% service charge on generic
    const finalCharge = orderData.totalBill + brandedServiceCharge + genericServiceCharge;
    
    // Prepare complete order data
    const completeOrderData = {
      // Customer and patient info
      customerName: orderData.customerName,
      patientName: orderData.patientName,
      doctorName: orderData.doctorName || '',
      mobile: orderData.mobile,
      age: orderData.age || '',
      address: orderData.address,
      pincode: orderData.pincode,
      
      // Order details
      medicines: orderData.medicines,
      totalBill: orderData.totalBill,
      totalMRP: orderData.totalMRP,
      totalSavings: orderData.totalSavings,
      flatDiscountAmount: orderData.flatDiscountAmount || 0,
      flatDiscountPercentage: orderData.flatDiscountPercentage || 0,
      
      // Payment and status
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
      paymentDate: orderData.paymentMethod === 'cod' ? '' : currentDate,
      
      // Prescription
      prescriptionUrl: orderData.prescriptionUrl || '',
      
      // Additional fields
      genericAmount,
      brandedAmount,
      orderDate: currentDate,
      location,
      shipmentDate: '',
      shipmentNumber: '',
      numberOfProducts,
      orderStatus: 'Processing' as ("Processing" | "Order Confirmed" | "Packing" | "Shipped" | "Delivered" | "Return" | "Cancel"), // Explicitly assert the type
      deliveryStatus: 'No',
      billingMRP: orderData.totalMRP,
      billingDiscountAmount: orderData.totalSavings,
      sellAmount: orderData.totalBill,
      returnAmount: 0,
      brandedServiceCharge,
      genericServiceCharge,
      finalCharge,
      invoiceLink: ''
    };
    
    // Submit to Convex
    const result = await submitOrderToConvex(completeOrderData); // This should now type-check correctly
    
    return NextResponse.json({ 
      success: true, 
      orderId: result.orderId,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('!!! Critical Error in /api/submit-order:', error);
    let errorMessage = 'Failed to submit order';
    let errorDetails = 'Unknown error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.message; // Include stack trace if available
    }
    
    console.error('Error details:', errorDetails);
    
    // Ensure a JSON response is always attempted, even if error details are complex
    try {
      return NextResponse.json({ 
        error: errorMessage, 
        details: errorDetails
      }, { status: 500 });
    } catch (responseError) {
      // Fallback if even creating the JSON response fails
      console.error('!!! Failed to create JSON error response:', responseError);
      // Return a plain text response as a last resort
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}