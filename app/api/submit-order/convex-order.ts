// File: app/api/submit-order/convex-order.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Check for Convex URL environment variable
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable. Convex client cannot be initialized.");
}

// Set up Convex client
const convex = new ConvexHttpClient(convexUrl);

// Define types for order data
interface Medicine {
  name: string;
  quantity: number;
  price?: number;
  isGeneric?: boolean;
  productId?: string;
  brandName?: string;
  category?: string;
  mrp?: number;
  discount?: number;
}

interface OrderData {
  // Customer and patient info
  customerName: string;
  patientName: string;
  doctorName?: string;
  mobile: string;
  age: string;
  address: string;
  pincode: string;
  
  // Order details
  medicines: Medicine[];
  totalBill: number;
  totalMRP: number;
  totalSavings: number;
  flatDiscountAmount: number;
  flatDiscountPercentage: number;
  
  // Payment and status
  paymentMethod: string;
  paymentStatus: string;
  paymentDate?: string;
  
  // Prescription
  prescriptionUrl?: string;
  
  // Additional fields
  genericAmount: number;
  brandedAmount: number;
  orderId?: string;
  orderDate: string;
  location: string;
  shipmentDate?: string;
  shipmentNumber?: string;
  numberOfProducts: number;
  orderStatus: "Processing" | "Order Confirmed" | "Packing" | "Shipped" | "Delivered" | "Return" | "Cancel";
  deliveryStatus: string;
  billingMRP: number;
  billingDiscountAmount: number;
  sellAmount: number;
  returnAmount?: number;
  brandedServiceCharge: number;
  genericServiceCharge: number;
  finalCharge: number;
  invoiceLink?: string;
}

/**
 * Submits an order to the Convex backend, generating an order ID and date if not provided.
 *
 * Accepts an {@link OrderData} object, ensures required identifiers are set, and creates a new order record in Convex with customer, medicine, and billing details.
 *
 * @param orderData - The order information to be submitted.
 * @returns An object containing `success: true` and the generated or provided `orderId`.
 *
 * @throws {Error} If the order submission to Convex fails.
 */
export async function submitOrderToConvex(orderData: OrderData) {
  try {
    // Generate orderId if not provided
    if (!orderData.orderId) {
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      orderData.orderId = `ORD-${timestamp}-${random}`;
    }
    
    // Set current date if not provided
    if (!orderData.orderDate) {
      orderData.orderDate = new Date().toISOString();
    }
    
    // Create the order in Convex
    const orderId = await convex.mutation(api.orders.createOrder, {
      name: orderData.customerName,
      contact: orderData.mobile,
      address: orderData.address,
      pincode: orderData.pincode,
      medicines: orderData.medicines.map((med) => ({
        name: med.name,
        quantity: med.quantity,
        price: med.price,
        isGeneric: med.category?.toLowerCase() === 'generic',
        // Add additional medicine fields that might be useful
        skuId: med.productId,
        productName: med.name,
        brandName: med.brandName,
        mrp: med.mrp,
        sellingPrice: med.price,
        disc: med.discount,
      })),
      prescriptionUrl: orderData.prescriptionUrl,
      totalBill: orderData.totalBill,
      genericBill: orderData.genericAmount,
      status: orderData.orderStatus || "Processing",
    });
    
    // Return the created order ID
    return {
      success: true,
      orderId: orderId,
    };
  } catch (error) {
    console.error('Error submitting order to Convex:', error);
    throw error;
  }
}