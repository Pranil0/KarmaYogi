// Load environment variables
require('dotenv').config({ path: './config/config.env' });

// Connect to the database
const databaseConnection = require('./config/database');
databaseConnection();

const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/error'); // Optional custom error handler

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (like uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const userRoutes = require('./Routes/UserRoutes');
const taskRoutes = require('./Routes/TaskRoutes');
const offerRoutes = require('./Routes/OfferRoutes');
const reviewRoutes = require('./Routes/ReviewRoutes');
const adminRoutes = require('./Routes/AdminRoutes');
const notificationRoutes = require('./Routes/NotificationRoutes'); // ✅ correct path and file
// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('✅ Karma Yogi API is running...');
});

// Optional: Global Error Handler
if (errorHandler) {
  app.use(errorHandler);
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
