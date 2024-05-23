const express = require('express');
const router = express.Router();
const messageController = require('../dao/controllers/messageController');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Módulo de mensajes
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Obtener todos los mensajes
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del mensaje
 *                   user:
 *                     type: string
 *                     description: Remitente del mensaje
 *                   message:
 *                     type: string
 *                     description: Contenido del mensaje
 */
router.get('/', async (req, res) => {
try {
const messages = await messageController.getAllMessages();
res.status(200).json(messages);
} catch (error) {
res.status(500).json({ error: 'Error interno del servidor' });
}
});

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Agregar un mensaje
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: Remitente del mensaje
 *                 example: 'usuario@example.com'
 *               message:
 *                 type: string
 *                 description: Contenido del mensaje
 *                 example: 'Este es un mensaje de prueba'
 *     responses:
 *       201:
 *         description: Mensaje agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del mensaje
 *                 user:
 *                   type: string
 *                   description: Remitente del mensaje
 *                 message:
 *                   type: string
 *                   description: Contenido del mensaje
 */
router.post('/', messageController.addMessage);

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Borrar un mensaje
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del mensaje
 *     responses:
 *       200:
 *         description: Mensaje borrado exitosamente
 */
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
