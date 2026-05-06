// 1. MUST BE FIRST: Load environment variables before ANY other imports
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 3. Register routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Event Booking API is running...');
});

const PORT = process.env.PORT || 5000;

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); 
  });