const express = require('express');
const router = express.Router();
const productsController = require('../dao/controllers/productsController');

// Obtener todos los productos API
router.get('/', productsController.getAllProducts);
// Agregar un producto
router.post('/', productsController.addProduct);
// Actualizar un producto por ID
router.put('/:id', productsController.updateProduct);
// Aliminar un producto por ID
router.delete('/:id', productsController.deleteProduct);


module.exports = router;

