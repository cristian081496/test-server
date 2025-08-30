# Admin Dashboard API

Backend service for the Admin Dashboard application that processes user data and transactions from ZIP file uploads.

## Features

- RESTful API with Express.js
- MySQL database with Sequelize ORM
- ZIP file processing for bulk data import
- Automatic JSON error correction
- Avatar image management
- Transaction tracking per user
- CORS enabled for cross-origin requests

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM for database operations
- **Multer** - File upload middleware
- **ADM-ZIP** - Archive processing
- **dotenv** - Environment variable management

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/cristian081496/test-server.git
   cd test-server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up MySQL database

   ```bash
   # Connect to MySQL
   mysql -u root -p

   # Create database
   CREATE DATABASE exam_dashboard_db;

   ```

4. Configure environment variables

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. Initialize database
   ```bash
   # Run once to create tables
   npm start
   # Press Ctrl+C after seeing "Database synced"
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=exam_dashboard_db
NODE_ENV=development
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID with transactions

### Transactions

- `GET /api/transactions` - Get all transactions

### File Upload

- `POST /api/upload` - Upload ZIP file with user data

#### ZIP File Structure

Each ZIP file should contain:

- `userData.json` - User information
- `transactions.json` - Transaction records
- `avatar.png` - User avatar image

## Development

```bash
# Start development server with nodemon
npm run dev

# Start production server
npm start
```

## Database Schema

### Users Table

- `id` - Primary key
- `firstName` - User's first name
- `lastName` - User's last name
- `birthday` - Date of birth
- `country` - Country code
- `phone` - Phone number
- `avatarPath` - Path to avatar image
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Transactions Table

- `id` - Primary key
- `userId` - Foreign key to Users
- `reference` - Transaction reference
- `amount` - Transaction amount
- `currency` - Currency code
- `message` - Optional message
- `timestamp` - Transaction timestamp
- `createdAt` - Record created timestamp
- `updatedAt` - Record updated timestamp

## File Structure

```
server/
├── controllers/        # Request handlers
├── models/            # Sequelize models
├── routes/            # API routes
├── services/          # Business logic
├── config/            # Database configuration
├── public/avatars/    # Avatar storage
├── uploads/           # Temporary upload directory
├── .env.example       # Environment template
├── index.js           # Application entry point
└── README.md
```

## Production Deployment

1. Install dependencies: `npm install --production`
2. Set NODE_ENV=production in `.env`
3. Use PM2 for process management: `pm2 start index.js --name "exam-backend"`

## License

This project is for examination purposes.
