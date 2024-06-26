const express = require('express');
const UsersController = require('../dao/controllers/usersController');
const uploadFileMulter = require('../configuration/multerConfig');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Módulo de usuarios
 */

/**
 * @swagger
 * /users/premium/{uid}:
 *   post:
 *     tags: [Users]
 *     summary: Cambiar el rol de un usuario
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol cambiado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/premium/:uid', UsersController.changeUserRole);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags: [Users]
 *     summary: Cerrar sesión de un usuario
 *     responses:
 *       200:
 *         description: Usuario deslogueado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.get('/logout', UsersController.logout);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       400:
 *         description: Error en la solicitud
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuarios inactivos
 *     responses:
 *       200:
 *         description: Usuarios inactivos eliminados exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.get('/', UsersController.getAllUsers);
router.delete('/', UsersController.deleteInactiveUsers);

/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.delete('/:uid', UsersController.deleteUserById);

/**
 * @swagger
 * /users/{uid}/documents:
 *   post:
 *     tags: [Users]
 *     summary: Subir documentos para un usuario
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Documentos subidos exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/:uid/documents', uploadFileMulter, UsersController.uploadDocuments);

module.exports = router;
