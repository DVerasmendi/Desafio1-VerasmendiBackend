const express = require('express');
const UsersController = require('../dao/controllers/usersController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Módulo de usuarios
 */

/**
 * @swagger
 * /api/users/premium/{uid}:
 *   post:
 *     summary: Cambiar el rol de un usuario a premium
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *                 description: Nuevo rol del usuario
 *                 example: 'premium'
 *     responses:
 *       200:
 *         description: Rol del usuario actualizado a premium
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'El rol del usuario ha sido actualizado correctamente'
 *                 updatedRole:
 *                   type: string
 *                   example: 'premium'
 *       400:
 *         description: Falta el ID del usuario o el nuevo rol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Falta el ID del usuario o el nuevo rol'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Usuario no encontrado'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Error interno del servidor'
 */
router.post('/premium/:uid', UsersController.changeUserRole);

module.exports = router;
