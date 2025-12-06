# Shopify Insights Dashboard

A full-stack application that integrates with Shopify to ingest and visualize store data including products, customers, and orders.

## Project Structure

```
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── server.js       # Main server entry point
│   │   ├── shopify.js      # Shopify API integration
│   │   └── routes/
│   │       ├── ingest.js   # Data ingestion endpoints
│   │       └── insights.js # Analytics endpoints
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── frontend/                # Next.js React application
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── ConnectStore.tsx    # Shopify store connection UI
│   │   ├── Dashboard.tsx       # Main dashboard component
│   │   ├── StatCard.tsx        # Statistics card component
│   │   ├── Section.tsx         # Section wrapper component
│   │   ├── CustomTooltip.tsx   # Chart tooltip component
│   │   └── ThemeProvider.tsx   # Theme configuration
│   ├── public/             # Static assets
│   └── package.json
│
└── README.md               # This file
```

## Tech Stack

### Backend
- **Framework**: Express.js 5.2.1
- **Database**: SQLite with Prisma ORM 5.22.0
- **Shopify Integration**: @shopify/shopify-api 12.1.2
- **Utilities**: CORS, dotenv

### Frontend
- **Framework**: Next.js 16.0.7
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4, PostCSS
- **Charting**: Recharts 3.5.1
- **Icons**: Lucide React 0.556.0
- **HTTP Client**: Axios 1.13.2
- **Language**: TypeScript 5

## Prerequisites

- Node.js 16+ and npm/yarn
- Shopify store and API credentials
- SQLite3 (included with Prisma)

## Installation

### 1. Clone and Navigate
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the `backend` directory:
```env
PORT=4000
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=products,customers,orders
DATABASE_URL="file:./dev.db"
```

### 3. Initialize Database

From the `backend` directory:
```bash
npx prisma migrate dev --name init
```

## Running the Application

### Start Backend
```bash
cd backend
npm start
# Server runs on http://localhost:4000
```

### Start Frontend
In a new terminal:
```bash
cd frontend
npm run dev
# Application runs on http://localhost:3000
```

## API Endpoints

### Ingest Routes (`/ingest`)
- Data ingestion endpoints for syncing Shopify store data

### Insights Routes (`/insights`)
- Analytics and reporting endpoints

### Health Check
- `GET /health` - Returns database connection status

## Database Schema

The application uses the following main models:

- **Tenant**: Shopify store connection (domain, access token)
- **Product**: Store products with metadata
- **Customer**: Store customers with purchase history
- **Order**: Customer orders and transactions

## Features

- 🏪 Shopify store integration and authentication
- 📊 Real-time data ingestion from Shopify
- 📈 Interactive analytics dashboard
- 🎯 Customer insights and product analytics
- 🎨 Dark/Light theme support
- 📱 Responsive design

## Development

### Backend Development
- Main server file: `backend/src/server.js`
- Routes are modular in `backend/src/routes/`
- Database queries use Prisma ORM

### Frontend Development
- App router in `frontend/app/`
- Reusable components in `frontend/components/`
- Styling with Tailwind CSS

### Code Quality
- Frontend includes ESLint configuration
- TypeScript for type safety in frontend

## Troubleshooting

### Database Connection Issues
```bash
# Reset database (careful - deletes all data)
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
```

### Port Already in Use
- Backend default: 4000 - Change via `PORT` env variable
- Frontend default: 3000 - Change via `npm run dev -- -p 3001`

## License

ISC

## Notes

- Ensure both backend and frontend servers are running for the application to work properly
- The frontend communicates with the backend API for data fetching
- Shopify credentials must be valid for data ingestion to work
