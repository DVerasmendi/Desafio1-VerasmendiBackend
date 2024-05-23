const express = require('express');
const authController = require('../dao/controllers/authController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Módulo de autenticación
 */

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   get:
 *     summary: Renderizar formulario de solicitud de restablecimiento de contraseña
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Formulario de solicitud de restablecimiento de contraseña renderizado
 */
router.get('/request-password-reset', authController.renderRequestPasswordResetForm);

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email del usuario
 *                 example: 'usuario@example.com'
 *     responses:
 *       200:
 *         description: Solicitud de restablecimiento de contraseña enviada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Correo de recuperación enviado con éxito.'
 *       500:
 *         description: Error al enviar el correo de restablecimiento de contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Error al enviar el correo.'
 */
router.post('/request-password-reset', authController.requestPasswordReset);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   get:
 *     summary: Renderizar formulario de restablecimiento de contraseña
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de restablecimiento de contraseña
 *     responses:
 *       200:
 *         description: Formulario de restablecimiento de contraseña renderizado
 *       400:
 *         description: El enlace ha expirado o es inválido
 */
router.get('/reset-password/:token', authController.resetPasswordForm);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Restablecer contraseña
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de restablecimiento de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nueva contraseña
 *                 example: 'nueva_contraseña_segura'
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Contraseña restablecida exitosamente'
 *       400:
 *         description: El enlace ha expirado o es inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'El enlace ha expirado o es inválido. Por favor, solicita un nuevo enlace.'
 */
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
