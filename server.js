const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Import scheduler for automated reminders
require('./scheduler/reminderScheduler'); // Ensure this path is correct and exists

const cors = require('cors');
app.use(cors());


// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit process with failure
  });

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle Unhandled Rejection and Uncaught Exception Errors
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1)); // Gracefully shut down
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1); // Force exit
});

console.log('Notification routes registered successfully.');
