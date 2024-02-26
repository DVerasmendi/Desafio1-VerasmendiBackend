const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
name: { type: String, required: true },
description: { type: String, required: true },
price: { type: Number, required: true },
stock: { type: Number, required: true },
imageUrl: { type: String, required: false } // Opcional
});

// Aplicar el plugin de paginación al esquema
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
