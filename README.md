# MedGhor - Medicine Ordering Application

## Overview

MedGhor is a full-stack web application for online medicine ordering with prescription upload capabilities. The platform streamlines healthcare access by providing a digital solution for medicine procurement.

## Features

- **Medicine Ordering**: Add medicines to cart and place orders
- **Prescription Upload**: Upload prescription images for verification
- **Order Tracking**: View past orders and their status
- **Google Sheets Integration**: Order data synced with Google Sheets
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Convex for database and server logic
- **Storage**: File storage for prescription uploads
- **Integration**: Google Sheets API for order management

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Convex account
- Google Cloud Platform account (for Sheets integration)

### Setup Steps

1. Clone the repository

```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env` file with the following variables:

```plaintext
NEXT_PUBLIC_CONVEX_URL=your_convex_url
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SHEET_ID=your_sheet_id
```

4. Start development server

```bash
npm run dev
```

## Google Sheets Integration

### Setup Instructions

1. Create a Google Cloud Platform project
2. Enable the Google Sheets API
3. Create a service account and download credentials
4. Share your Google Sheet with the service account email
5. Add service account credentials to environment variables

Detailed instructions available in the [documentation](app/orders/doc.md).

## Project Structure

- `/app`: Next.js application routes and pages
  - `/api`: API routes for orders and prescriptions
  - `/orders`: Order form and submission logic
  - `/past-orders`: Order history and tracking
- `/components`: Reusable UI components
- `/convex`: Convex backend schema and functions
- `/public`: Static assets

## Contributing

Contributions are welcome. Please submit a Pull Request.

## License

This project is licensed under the MIT License.
