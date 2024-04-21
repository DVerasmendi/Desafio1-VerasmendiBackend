const express = require('express');
const router = express.Router();
const cartsController = require('../dao/controllers/cartsController');


// Crear un nuevo carrito
router.post('/', cartsController.createCart);

// Obtener todos los carritos
router.get('/', cartsController.getAllCarts);

// Obtener un carrito por ID
router.get('/:cartId', cartsController.getCartById);

// Agregar un producto al carrito
router.post('/:cartId/items', cartsController.addToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cartId/items/:itemId', cartsController.updateCartItemQuantity);

// Eliminar un producto del carrito
router.delete('/:cartId/items/:itemId', cartsController.removeItemFromCart);

// Actualizar el estado del carrito
router.put('/:cartId/status', cartsController.updateCartStatus);

////////////////////////////  NUEVAS RUTAS  ///////////////////////
// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', cartsController.removeProductFromCart);

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', cartsController.updateCart);

// Actualizar solo la cantidad de un producto específico
router.put('/:cid/products/:pid', cartsController.updateProductQuantity);

// Eliminar todos los productos del carrito
router.delete('/:cid', cartsController.emptyCart);


module.exports = router;