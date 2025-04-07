# Setting Up Google Sheets Direct Integration

Follow these steps to set up direct integration between your Next.js application and Google Sheets:

## 1. Set Up Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API for your project

## 2. Create Service Account Credentials

1. In your Google Cloud project, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "Service Account"
3. Fill in the service account details and click "Create"
4. Grant the service account access to your project (Role: Editor)
5. Create a new key for this service account (JSON format)
6. Download and save the JSON key file securely

## 3. Set Up Your Google Sheet

1. Create a new Google Sheet
2. Create two sheets/tabs:
   - "Orders" - with columns: Timestamp, Name, Contact, Address, Pincode, PrescriptionUrl, MedicineCount
   - "Medicines" - with columns: OrderRowRef, SlNo, Name, Quantity, CustomerName, CustomerContact
3. Share your sheet with the service account email address (with Editor permissions)

## 4. Environment Variables

Add these environment variables to your project (in a .env.local file for local development):

```
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@example.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="your_private_key_here"
```

The Sheet ID is the long string in the URL of your Google Sheet:
`https://docs.google.com/spreadsheets/d/`**your_sheet_id_here**`/edit`

## 5. Install Required Packages

```bash
npm install googleapis
```

## 6. Testing the Integration

1. Start your Next.js development server: `npm run dev`
2. Navigate to the orders page
3. Fill out the form and submit an order
4. Check your Google Sheet to verify the data was added correctly

## Troubleshooting

- **Authentication Issues**: Make sure your service account has the correct permissions and the private key is correctly formatted in your environment variables.
- **CORS Errors**: These shouldn't occur since we're using a server-side API route.
- **Rate Limiting**: Google Sheets API has quota