# Boarding Buddy - Backend API

A production-ready Node.js + Express backend for the Boarding Buddy MERN SaaS application.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js           # MongoDB connection
│   └── index.js        # Centralized configuration
├── controllers/
│   ├── testController.js
│   └── index.js
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   ├── errorMiddleware.js   # Global error handling
│   ├── rateLimiter.js       # Rate limiting
│   └── index.js
├── models/
│   ├── User.js         # User model example
│   └── index.js
├── routes/
│   ├── testRoutes.js   # Test/health routes
│   └── index.js
├── utils/
│   ├── asyncHandler.js
│   ├── logger.js
│   ├── responseHelper.js
│   ├── tokenUtils.js
│   └── index.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests with coverage
- `npm run lint` - Run ESLint

## 📡 API Endpoints

### Test Routes

- `GET /` - Welcome message
- `GET /api/test` - API status check
- `GET /api/test/health` - Health check with uptime and memory

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT authentication (ready to use)
- Input validation

## 🛠️ Environment Variables

| Variable    | Description               | Default               |
| ----------- | ------------------------- | --------------------- |
| NODE_ENV    | Environment mode          | development           |
| PORT        | Server port               | 5000                  |
| MONGO_URI   | MongoDB connection string | -                     |
| JWT_SECRET  | JWT signing secret        | -                     |
| JWT_EXPIRE  | JWT expiration time       | 30d                   |
| CORS_ORIGIN | Allowed CORS origin       | http://localhost:3000 |

## 📝 License

ISC
