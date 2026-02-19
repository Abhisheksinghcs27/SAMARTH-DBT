# SAMARTH DBT Backend API

Backend API server for the SAMARTH DBT Platform - a unified system for managing Direct Benefit Transfer under PCR Act, 1955 and PoA Act, 1989.

## Features

- 🔐 JWT-based authentication for victims and officials
- 📝 Application management with full CRUD operations
- 🤖 AI-powered verification using Google Gemini
- 🔍 Multi-agency verification (Aadhaar, CCTNS, Bank)
- 📊 Real-time tracking and timeline events
- 🎫 Grievance redressal system
- 📁 File upload support for documents
- 📈 Analytics and statistics

## Prerequisites

- Node.js 18.x or higher
- MongoDB (local or cloud instance)
- Google Gemini API Key

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/samarth-dbt
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   GEMINI_API_KEY=your-gemini-api-key-here
   MAX_FILE_SIZE=5242880
   UPLOAD_DIR=./uploads
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication

- `POST /api/auth/victim/login` - Login/Register as victim (Aadhaar-based)
- `POST /api/auth/official/login` - Login as official
- `GET /api/auth/me` - Get current user info

### Applications

- `GET /api/applications` - Get all applications (with filters)
- `GET /api/applications/:id` - Get single application
- `POST /api/applications` - Create new application (Victims only)
- `PATCH /api/applications/:id/status` - Update application status (Officials only)
- `GET /api/applications/stats/overview` - Get statistics (Officials only)

### Verification

- `POST /api/verification/:id/verify` - Execute full verification flow (Officials only)
- `POST /api/verification/:id/disburse` - Initiate payment disbursement (Officials only)

### Grievances

- `GET /api/grievances` - Get all grievances
- `GET /api/grievances/:id` - Get single grievance
- `POST /api/grievances` - Create new grievance (Victims only)
- `PATCH /api/grievances/:id/status` - Update grievance status (Officials only)

### Tracking

- `GET /api/tracking/:id` - Get tracking data for an application

### AI Assistant

- `POST /api/ai/guidance` - Get legal guidance from AI assistant

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Models

- **User**: Stores victim and official user accounts
- **Application**: Stores all relief applications
- **Grievance**: Stores grievance tickets
- **TimelineEvent**: Stores application timeline events

## Verification Flow

1. **Aadhaar Verification**: Validates 12-digit Aadhaar number
2. **CCTNS Verification**: Fetches FIR data from CCTNS (simulated)
3. **Bank Verification**: Validates bank account and IFSC
4. **AI Verification**: Uses Gemini AI to verify statement consistency

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

The project uses TypeScript with the following structure:
```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── middleware/    # Express middleware
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── services/      # Business logic services
│   ├── utils/         # Utility functions
│   └── server.ts      # Main server file
├── dist/              # Compiled JavaScript
└── uploads/           # Uploaded files
```

## Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add input validation and sanitization
- Use HTTPS in production
- Implement proper CORS policies

## License

ISC
