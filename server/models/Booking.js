const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turfId: { type: Number, required: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDetails: {
        method: { type: String }, // 'card' or 'upi'
        transactionId: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
