const express = require('express');
const productsRouter = require('./products');
const cartsRouter = require('./carts');

module.exports = function(io, productManager, cartManager) {
    const router = express.Router();

    router.use('/api/products', productsRouter(io, productManager));
    router.use('/api/carts', cartsRouter(io, cartManager));

    return router;
};
