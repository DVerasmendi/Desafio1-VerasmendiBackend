const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true } // Agregar el campo de precio
}, {
    timestamps: true
});


const cartSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // Agregando el campo para el email del usuario
    userId: { type: String, required: true },
    items: [cartItemSchema],
    status: { type: String, required: true, default: 'active' } // Por ejemplo: active, completed
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema, 'carts');
