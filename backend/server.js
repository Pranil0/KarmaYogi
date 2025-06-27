// server.js
require('dotenv').config({ path: './config/config.env' });
const databaseConnection = require('./config/database');
const upload = require('./middleware/uploads');

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Connect to MongoDB
databaseConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your routes and other code...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Routes
const userRoutes = require('./Routes/UserRoutes');
const taskRoutes = require('./Routes/TaskRoutes');
const offerRoutes = require('./Routes/OfferRoutes');
const reviewRoutes = require('./Routes/ReviewRoutes');
const adminRoutes = require('./Routes/AdminRoutes');
const errorHandler = require('./middleware/error');

// Route usage
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Example route (you should replace with your real routes)
app.get('/', (req, res) => {
  res.send('API is running...');
});
