const express = require('express');
const router = express.Router();
const productsController = require('../dao/controllers/productsController');
const mockingUtils = require('../utils/mockingUtils');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Módulo de productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID del producto
 *                       name:
 *                         type: string
 *                         description: Nombre del producto
 *                       price:
 *                         type: number
 *                         description: Precio del producto
 *                       description:
 *                         type: string
 *                         description: Descripción del producto
 *                       stock:
 *                         type: number
 *                         description: Stock del producto
 *                       imageUrl:
 *                         type: string
 *                         description: URL de la imagen del producto
 *                       category:
 *                         type: string
 *                         description: Categoría del producto
 *                       owner:
 *                         type: string
 *                         description: Propietario del producto
 */
router.get('/', productsController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Agregar un producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: 'Nuevo Producto'
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *                 example: 'Descripción del producto'
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *                 example: 99.99
 *               stock:
 *                 type: number
 *                 description: Stock del producto
 *                 example: 10
 *               imageUrl:
 *                 type: string
 *                 description: URL de la imagen del producto
 *                 example: 'http://example.com/image.jpg'
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *                 example: 'Categoría de prueba'
 *               owner:
 *                 type: string
 *                 description: Propietario del producto
 *                 example: 'Propietario de prueba'
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto agregado con éxito
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID del producto
 *                     name:
 *                       type: string
 *                       description: Nombre del producto
 *                     description:
 *                       type: string
 *                       description: Descripción del producto
 *                     price:
 *                       type: number
 *                       description: Precio del producto
 *                     stock:
 *                       type: number
 *                       description: Stock del producto
 *                     imageUrl:
 *                       type: string
 *                       description: URL de la imagen del producto
 *                     category:
 *                       type: string
 *                       description: Categoría del producto
 *                     owner:
 *                       type: string
 *                       description: Propietario del producto
 */
router.post('/', productsController.addProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: 'Producto Actualizado'
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *                 example: 49.99
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto actualizado con éxito
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID del producto
 *                     name:
 *                       type: string
 *                       description: Nombre del producto
 *                     price:
 *                       type: number
 *                       description: Precio del producto
 *                     description:
 *                       type: string
 *                       description: Descripción del producto
 *                     stock:
 *                       type: number
 *                       description: Stock del producto
 *                     imageUrl:
 *                       type: string
 *                       description: URL de la imagen del producto
 *                     category:
 *                       type: string
 *                       description: Categoría del producto
 *                     owner:
 *                       type: string
 *                       description: Propietario del producto
 */
router.put('/:id', productsController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado correctamente
 */
router.delete('/:id', productsController.deleteProduct);

/**
 * @swagger
 * /api/products/mockingproducts:
 *   get:
 *     summary: Generar productos simulados
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del producto simulado
 *                   name:
 *                     type: string
 *                     description: Nombre del producto simulado
 *                   price:
 *                     type: number
 *                     description: Precio del producto simulado
 */
router.get('/mockingproducts', (req, res) => {
    const mockProducts = mockingUtils.generateMockProducts();
    res.json(mockProducts);
});

module.exports = router;
