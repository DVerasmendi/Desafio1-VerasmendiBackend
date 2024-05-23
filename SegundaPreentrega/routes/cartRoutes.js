const express = require('express');
const router = express.Router();
const cartsController = require('../dao/controllers/cartsController');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Módulo de carrito
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario
 *                 example: '1234567890'
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                         quantity:
 *                           type: integer
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.post('/', cartsController.createCart);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtener todos los carritos
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Lista de carritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del carrito
 *                   userId:
 *                     type: string
 *                     description: ID del usuario
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                           description: ID del producto
 *                         quantity:
 *                           type: integer
 *                           description: Cantidad del producto
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
router.get('/', cartsController.getAllCarts);

/**
 * @swagger
 * /api/carts/{cartId}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del carrito
 *                 userId:
 *                   type: string
 *                   description: ID del usuario
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: ID del producto
 *                       quantity:
 *                         type: integer
 *                         description: Cantidad del producto
 *                       name:
 *                         type: string
 *                         description: Nombre del producto
 *                       price:
 *                         type: number
 *                         description: Precio del producto
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
router.get('/:cartId', cartsController.getCartById);

/**
 * @swagger
 * /api/carts/{cartId}/items:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto
 *                 example: '12345'
 *               quantity:
 *                 type: integer
 *                 description: Cantidad del producto
 *                 example: 1
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *                 example: 99.99
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 */
router.post('/:cartId/items', cartsController.addToCart);

/**
 * @swagger
 * /api/carts/{cartId}/items/{itemId}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto en el carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Nueva cantidad del producto
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cantidad del producto actualizada
 */
router.put('/:cartId/items/:itemId', cartsController.updateCartItemQuantity);

/**
 * @swagger
 * /api/carts/{cartId}/items/{itemId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto en el carrito
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 */
router.delete('/:cartId/items/:itemId', cartsController.removeItemFromCart);

/**
 * @swagger
 * /api/carts/{cartId}/status:
 *   put:
 *     summary: Actualizar el estado del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nuevo estado del carrito
 *                 example: 'completed'
 *     responses:
 *       200:
 *         description: Estado del carrito actualizado
 */
router.put('/:cartId/status', cartsController.updateCartStatus);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto específico del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 */
router.delete('/:cid/products/:pid', cartsController.removeProductFromCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualizar el carrito con un arreglo de productos
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                   description: ID del producto
 *                 quantity:
 *                   type: integer
 *                   description: Cantidad del producto
 *     responses:
 *       200:
 *         description: Carrito actualizado con nuevos productos
 */
router.put('/:cid', cartsController.updateCart);

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Actualizar solo la cantidad de un producto específico
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Nueva cantidad del producto
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cantidad del producto actualizada
 */
router.put('/:cid/products/:pid', cartsController.updateProductQuantity);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Eliminar todos los productos del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Todos los productos eliminados del carrito
 */
router.delete('/:cid', cartsController.emptyCart);

module.exports = router;
