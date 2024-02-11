const express = require('express');

module.exports = function(io, cartManager) {
const router = express.Router();

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;
    
        if (!cartManager) {
        throw new Error('cartManager no está definido');
        }
    
        const success = await cartManager.addProductToCart(cartId, productId, quantity);
    
        if (success) {
        res.json({ message: 'Producto agregado al carrito exitosamente' });
        } else {
        res.status(404).json({ error: 'No se pudo agregar el producto al carrito' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

router.post('/', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCart(cartId);
        if (cart) {
        res.json(cart);
        } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });
    
    return router;
    };
