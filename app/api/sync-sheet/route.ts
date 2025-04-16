// File: app/api/sync-sheet/route.ts
import { google, sheets_v4 } from 'googleapis';
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // You can optionally validate with a secret token
    if (process.env.SYNC_SECRET && body.secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if credentials are available
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google API credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
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
    
    // Sync orders from sheet to Convex
    const ordersResult = await syncOrders(sheets);
    
    // Sync medicines from sheet to Convex
    const medicinesResult = await syncMedicines(sheets);
    
    return NextResponse.json({ 
      success: true, 
      orders: ordersResult,
      medicines: medicinesResult
    });
  } catch (error) {
    console.error('Error syncing from sheet:', error);
    return NextResponse.json({ error: 'Failed to sync from sheet' }, { status: 500 });
  }
}

// Sync orders from Google Sheet to Convex
async function syncOrders(sheets: sheets_v4.Sheets) {
  try {
    console.log("Starting order sync from Google Sheets to Convex...");
    
    // Get all orders from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${ORDERS_SHEET_NAME}!A:K`,
    });
    
    const rows = response.data.values || [];
    console.log(`Retrieved ${rows.length} rows from Orders sheet`);
    
    // Skip header row if present
    const dataRows = rows[0][0] === 'Order ID' ? rows.slice(1) : rows;
    console.log(`Processing ${dataRows.length} data rows`);
    
    // Process each row
    let updatedCount = 0;
    for (const row of dataRows) {
      try {
        // Extract data (assuming columns are in order as defined)
        const orderId = row[0];
        const totalBill = row[8] ? parseFloat(row[8]) : 0;
        const genericBill = row[9] ? parseFloat(row[9]) : 0;
        const status = row[10] || null;
        
        console.log(`Processing order: ${orderId}, status: ${status}, totalBill: ${totalBill}, genericBill: ${genericBill}`);
        
        // Update Convex if we have an orderId and at least one value
        if (orderId && (totalBill !== null || genericBill !== null || status !== null)) {
          await convex.mutation(api.orders.updateOrderFromSheet, {
            orderId,
            totalBill,
            genericBill,
            status,
          });
          updatedCount++;
          console.log(`Successfully updated order: ${orderId}`);
        } else {
          console.log(`Skipping row with insufficient data: ${JSON.stringify(row)}`);
        }
      } catch (error) {
        console.error('Error Processing order row:', row, error);
        // Continue processing other rows
      }
    }
    
    return {
      updatedCount,
      message: `Synchronized ${updatedCount} orders from sheet to Convex DB`
    };
  } catch (error) {
    console.error('Error syncing orders:', error);
    return {
      updatedCount: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Sync medicines from Google Sheet to Convex
async function syncMedicines(sheets: sheets_v4.Sheets) {
  try {
    console.log("Starting medicine sync from Google Sheets to Convex...");
    
    // Get all medicines from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${MEDICINES_SHEET_NAME}!A:H`,
    });
    
    const rows = response.data.values || [];
    console.log(`Retrieved ${rows.length} rows from Medicines sheet`);
    
    // Skip header row if present
    const dataRows = rows[0][0] === 'Order ID' ? rows.slice(1) : rows;
    console.log(`Processing ${dataRows.length} data rows`);
    
    // Process each row
    let updatedCount = 0;
    for (const row of dataRows) {
      try {
        // Extract data (assuming columns are in order as defined)
        // A:H columns: OrderId, Date, Name, Quantity, Price, IsGeneric, CustomerName, CustomerContact
        const orderId = row[0];
        const medicineName = row[2];
        const quantity = row[3] ? parseInt(row[3]) : 0;
        const price = row[4] ? parseFloat(row[4]) : 0;
        const isGeneric = row[5] === 'Yes';
        
        // Update Convex if we have an orderId and medicine name
        if (orderId && medicineName) {
          await convex.mutation(api.orders.updateMedicineFromSheet, {
            orderId,
            medicineName,
            quantity,
            price,
            isGeneric,
          });
          updatedCount++;
        }
      } catch (error) {
        console.error('Error processing medicine row:', row, error);
        // Continue processing other rows
      }
    }
    
    return {
      updatedCount,
      message: `Synchronized ${updatedCount} medicines from sheet to Convex DB`
    };
  } catch (error) {
    console.error('Error syncing medicines:', error);
    return {
      updatedCount: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Add this function if you want to schedule periodic syncs
export async function GET(req: NextRequest) {
  try {
    // You can optionally validate with a key in the URL
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    
    if (process.env.SYNC_KEY && key !== process.env.SYNC_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Call the same sync logic as the POST handler
    const result = await POST(
      new NextRequest(req.url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: req.cookies.toString()
        }),
        body: JSON.stringify({})
      })
    );
    
    return result;
  } catch (error) {
    console.error('Error handling GET sync request:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to sync from sheet' 
    }, { status: 500 });
  }
}

// Add a new endpoint to set up sheet validations
export async function PUT(req: NextRequest) {
  try {
    // You can optionally validate with a secret token
    const body = await req.json();
    if (process.env.SYNC_SECRET && body.secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if credentials are available
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google API credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
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
    
    // Set up status dropdown in the Orders sheet
    await setupStatusDropdown(sheets);
    
    return NextResponse.json({ 
      success: true, 
      message: "Sheet validations set up successfully"
    });
  } catch (error) {
    console.error('Error setting up sheet validations:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to set up sheet validations' 
    }, { status: 500 });
  }
}

// Function to set up status dropdown in the Orders sheet
async function setupStatusDropdown(sheets: sheets_v4.Sheets) {
  try {
    // Get the sheet ID first
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const ordersSheet = spreadsheet.data.sheets?.find(
      (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title === ORDERS_SHEET_NAME
    );
    
    if (!ordersSheet) {
      throw new Error(`Sheet "${ORDERS_SHEET_NAME}" not found`);
    }
    
    const sheetId = ordersSheet.properties?.sheetId;
    
    // Define the status options
    const statusOptions = [
      "Processing",
      "Order Confirmed",
      "Packing",
      "Shipped",
      "Delivered",
      "Return",
      "Cancel"
    ];
    
    // Add data validation to the status column (column K)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId: sheetId,
                startRowIndex: 1,  // Skip header row
                endRowIndex: 1000, // Apply to many rows
                startColumnIndex: 10, // Column K (0-indexed)
                endColumnIndex: 11,
              },
              rule: {
                condition: {
                  type: "ONE_OF_LIST",
                  values: statusOptions.map(option => ({ userEnteredValue: option })),
                },
                strict: true,
                showCustomUi: true,
              },
            },
          },
        ],
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error setting up status dropdown:', error);
    throw error;
  }
}