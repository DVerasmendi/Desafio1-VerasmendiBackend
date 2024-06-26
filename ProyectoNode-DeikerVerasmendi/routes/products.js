const express = require('express');

module.exports = function(io, productManager) {
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit);
        res.json(products);
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
        });

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
        });

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto creado exitosamente' });
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    io.emit('productAdded', newProduct);
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = req.body;
        const success = productManager.updateProduct(productId, updatedProduct);
        
        if (success) {
            res.json({ message: 'Producto actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
        });
        

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const success = productManager.deleteProduct(productId);
        
        if (success) {
            res.json({ message: 'Producto eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
        });

return router;
};
