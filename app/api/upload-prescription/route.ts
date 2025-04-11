// File: app/api/upload-prescription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Google Drive folder ID where prescriptions will be uploaded
const DRIVE_FOLDER_ID = '1nVNXJTCdl3DDXZ8BY4o_eMbUaf8W-NIy';

// Set up Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Create a buffer from the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get file extension from original filename
    const fileExtension = file.name.split('.').pop() || 'pdf';
    
    // Use orderId as filename if provided, otherwise use timestamp
    const timestamp = new Date().getTime();
    const filename = orderId 
      ? `${orderId}.${fileExtension}`
      : `prescription-${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    
    console.log('Using filename for upload:', filename);
    
    try {
      // Upload directly to Google Drive
      const driveResult = await uploadToDrive(buffer, filename, file.type);
      
      // Update Convex if orderId is provided
      if (orderId) {
        try {
          // Find the order by orderId and update its prescription information
          const updateResult = await convex.mutation(api.orders.updateOrderPrescription, {
            orderId,
            prescriptionUrl: driveResult.fileUrl,
            prescriptionFileId: driveResult.fileId,
          });
          
          console.log("Updated prescription info in Convex DB:", updateResult);
        } catch (convexError) {
          console.error("Error updating prescription in Convex:", convexError);
          // Continue anyway to ensure the prescription is still accessible
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        fileUrl: driveResult.fileUrl,
        fileId: driveResult.fileId,
        filename: filename,
        storage: 'google_drive'
      });
    } catch (driveError) {
      console.error('Google Drive upload failed:', driveError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to upload to Google Drive',
        details: driveError instanceof Error ? driveError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

async function uploadToDrive(buffer: Buffer, filename: string, mimeType: string) {
  try {
    // Check if environment variables are set
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google API credentials in environment variables');
      throw new Error('Missing Google API credentials');
    }
    
    // Set up authentication with Google Drive
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Log for debugging
    console.log('Attempting to upload file:', filename);
    console.log('To folder ID:', DRIVE_FOLDER_ID);
    
    // Create a readable stream from the buffer
    const readable = new Readable();
    readable._read = () => {}; // Required but not used
    readable.push(buffer);
    readable.push(null);
    
    // FIX: Direct upload to the target folder
    const response = await drive.files.create({
      requestBody: {
        name: filename,
        mimeType: mimeType || 'application/octet-stream',
        parents: [DRIVE_FOLDER_ID], // Set parent folder directly here
      },
      media: {
        mimeType: mimeType || 'application/octet-stream',
        body: readable,
      },
      fields: 'id,name,webViewLink',
    });
    
    console.log('File created with ID:', response.data.id);
    
    if (!response.data.id) {
      throw new Error('Failed to upload file to Google Drive');
    }
    
    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    
    console.log('File permissions updated to public');
    
    // Get the file's web view link
    const fileData = await drive.files.get({
      fileId: response.data.id,
      fields: 'webViewLink',
    });
    
    const fileUrl = fileData.data.webViewLink || '';
    console.log('File URL:', fileUrl);
    
    return {
      fileUrl: fileUrl,
      fileId: response.data.id
    };
  } catch (error) {
    console.error('Detailed Drive API error:', error);
    throw error;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};