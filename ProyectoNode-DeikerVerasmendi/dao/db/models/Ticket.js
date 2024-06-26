const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, 
    purchase_datetime: { type: Date, required: true, default: Date.now }, 
    amount: { type: Number, required: true }, 
    purchaser: { type: String, required: true }, 
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    purchasedProducts: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalAmount: { type: Number, required: true }
    }]
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
