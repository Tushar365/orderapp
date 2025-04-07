// File: app/api/submit-order/route.ts
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Configure Google Sheets credentials
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const ORDERS_SHEET_NAME = 'Orders';
const MEDICINES_SHEET_NAME = 'Medicines';

// Generate a unique order ID
function generateOrderId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    // Validate the order data
    if (!orderData.name || !orderData.contact || !orderData.address || !orderData.pincode || !orderData.medicines || !orderData.medicines.length) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }
    
    // Check if credentials are available
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google API credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Add more detailed logging to help debug the issue
    console.log('Attempting to authenticate with Google Sheets API');
    console.log('Service account email available:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('Private key available:', !!process.env.GOOGLE_PRIVATE_KEY);
    
    // Set up authentication with Google Sheets
    // Using a JWT client with service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: SCOPES,
    });
    
    // Remove the unused authClient variable
    // const authClient = await auth.getClient();
    
    // Initialize the sheets API correctly
    const sheets = google.sheets({
        version: 'v4',
        auth: auth
      });
    
    // Generate a unique order ID
    const orderId = generateOrderId();
    const currentDate = new Date().toISOString();
    
    // Add order details to the Orders sheet
    const orderRow = [
      orderId, // Unique Order ID
      currentDate, // Timestamp
      orderData.name,
      orderData.contact,
      orderData.address,
      orderData.pincode,
      orderData.prescription_file_url || '',
      orderData.medicines.length,
    ];
    
    // Remove the variable assignment since we're not using the response
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${ORDERS_SHEET_NAME}!A:H`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [orderRow],
      },
    });
    
    // Add medicines to the Medicines sheet
    const medicineRows = orderData.medicines.map((medicine: { sl_no: number; name: string; quantity: number }) => [
      orderId, // Unique Order ID
      currentDate, // Same date as the order
      medicine.name,
      medicine.quantity,
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
    
    return NextResponse.json({ success: true, orderId: orderId });
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 });
  }
}

// Remove or comment out the unused helper function
// Helper function to extract row number from a range like "Sheet1!A123:G123"
// function extractRowNumber(range: string): number {
//   const match = range.match(/(\d+):/);
//   return match ? parseInt(match[1]) : 0;
// }