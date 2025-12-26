require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Booking = require('./models/Booking');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
// Defaulting to local if no ENV is provided, but ideally user provides MONGO_URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/turf-booking';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // In a real app, hash password here
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ name: user.name, email: user.email, _id: user._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // Simple plain text check for demo
        if (!user) return res.status(400).json({ error: "Invalid credentials" });
        res.json({ name: user.name, email: user.email, _id: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { userId, turfId, date, slot, amount, paymentDetails } = req.body;
        const booking = new Booking({ userId, turfId, date, slot, amount, paymentDetails });
        await booking.save();
        res.status(201).json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Bookings
app.get('/api/bookings/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
