// File: app/api/submit-order/route.ts
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Configure Google Sheets credentials
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const ORDERS_SHEET_NAME = 'Orders';
const MEDICINES_SHEET_NAME = 'Medicines';

// Set up Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Define medicine type to replace 'any'
interface Medicine {
  name: string;
  quantity: number;
  price?: number;
  isGeneric?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    // Validate the order data
    if (!orderData.name || !orderData.contact || !orderData.address || !orderData.pincode || !orderData.medicines || !orderData.medicines.length) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }
    
    // Create the order in Convex first to get the orderId
    let orderId;
    try {
      // Ensure status is capitalized correctly to match the schema
      const status = "Processing"; // Always use the correct capitalization
      
      orderId = await convex.mutation(api.orders.createOrder, {
        name: orderData.name,
        contact: orderData.contact,
        address: orderData.address,
        pincode: orderData.pincode,
        medicines: orderData.medicines.map((med: Medicine) => ({
          name: med.name,
          quantity: med.quantity,
          price: med.price || undefined,
          isGeneric: med.isGeneric || false,
        })),
        prescriptionUrl: orderData.prescription_file_url,
        prescriptionFileId: orderData.prescription_file_id,
        totalBill: 0,
        genericBill: 0,
        status: status, // Use the correctly capitalized status
      });
      
      console.log("Order successfully stored in Convex DB with ID:", orderId);
    } catch (convexError) {
      console.error("Error storing order in Convex:", convexError);
      return NextResponse.json({ error: 'Failed to create order in database' }, { status: 500 });
    }
    
    // Check if credentials are available for Google Sheets
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Missing Google API credentials - skipping sheet sync');
      // Return success even if we can't sync to sheets, since the order is in Convex
      return NextResponse.json({ 
        success: true, 
        orderId: orderId,
        sheetSync: false
      });
    }
    
    try {
      const currentDate = new Date().toISOString();
      
      // Set up authentication with Google Sheets
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: SCOPES,
      });
      
      // Initialize the sheets API
      const sheets = google.sheets({
        version: 'v4',
        auth: auth
      });
      
      // Add order details to the Orders sheet with new columns set to null/empty
      const orderRow = [
        orderId, // Unique Order ID from Convex
        currentDate, // Timestamp
        orderData.name,
        orderData.contact,
        orderData.address,
        orderData.pincode,
        orderData.prescription_file_url || '',
        orderData.medicines.length,
        orderData.totalBill || '', // Total bill - initialized to 0, will be updated via sheet
        orderData.genericBill || '', // Generic bill - initialized to 0, will be updated via sheet
        orderData.status || '' // Status - initialized to Processing, will be updated via sheet
      ];
      
      // Add to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ORDERS_SHEET_NAME}!A:K`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [orderRow],
        },
      });
      
      // Add medicines to the Medicines sheet
      const medicineRows = orderData.medicines.map((medicine: { name: string; quantity: number; price?: number; isGeneric?: boolean }) => [
        orderId, // Unique Order ID
        currentDate, // Same date as the order
        medicine.name,
        medicine.quantity,
        medicine.price || '',
        medicine.isGeneric ? 'Yes' : 'No',
        orderData.name, // For easier reference/filtering
        orderData.contact, // For easier reference/filtering
      ]);
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${MEDICINES_SHEET_NAME}!A:H`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: medicineRows,
        },
      });
      
      console.log("Order successfully synced to Google Sheets");
      
      return NextResponse.json({ 
        success: true, 
        orderId: orderId,
        sheetSync: true
      });
    } catch (sheetError) {
      console.error("Error syncing to Google Sheets:", sheetError);
      // Return success even if sheet sync fails, since the order is in Convex
      return NextResponse.json({ 
        success: true, 
        orderId: orderId,
        sheetSync: false,
        sheetError: sheetError instanceof Error ? sheetError.message : 'Unknown sheet error'
      });
    }
  } catch (error) {
    console.error('Error submitting order:', error);
    return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 });
  }
}