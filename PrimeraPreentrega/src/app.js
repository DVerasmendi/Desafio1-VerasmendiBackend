// app.js

const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const productsRouter = require('./routes/products'); // Importa el router de productos
const cartsRouter = require('./routes/carts'); // Importa el router de carritos

const app = express();
const productManager = new ProductManager('./productos.json');
const cartManager = new CartManager('./carts.json');

app.use(express.json());

// Usa el router de productos para las rutas relacionadas con productos
app.use('/api/products', productsRouter);

// Usa el router de carritos para las rutas relacionadas con carritos
app.use('/api/carts', cartsRouter(cartManager)); // Pasa cartManager como argumento

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
