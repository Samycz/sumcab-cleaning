const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sumcab';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (html, css, js, images)
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Compass'))
  .catch(err => console.error('MongoDB connection error:', err));

// Booking Schema & Model
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: { type: [String], required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// API Routes
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, services, date, time, notes } = req.body;
    
    // Basic validation
    if (!name || !email || !phone || !services || !services.length || !date || !time) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const newBooking = new Booking({
      name,
      email,
      phone,
      services,
      date,
      time,
      notes
    });

    await newBooking.save();
    console.log('New booking saved successfully:', newBooking);
    
    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Fallback route: serve index.html for any other route
app.get('*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
