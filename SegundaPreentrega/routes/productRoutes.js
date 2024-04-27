const express = require('express');
const router = express.Router();
const productsController = require('../dao/controllers/productsController');
const mockingUtils = require('../utils/mockingUtils');


// Obtener todos los productos API
router.get('/', productsController.getAllProducts);
// Agregar un producto
router.post('/', productsController.addProduct);
// Actualizar un producto por ID
router.put('/:id', productsController.updateProduct);
// Aliminar un producto por ID
router.delete('/:id', productsController.deleteProduct);


// Ruta para generar productos simulados
router.get('/mockingproducts', (req, res) => {
    const mockProducts = mockingUtils.generateMockProducts();
    res.json(mockProducts);
});


module.exports = router;

