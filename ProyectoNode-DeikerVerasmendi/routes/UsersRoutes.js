const express = require('express');
const UsersController = require('../dao/controllers/usersController');
const uploadFileMulter = require('../configuration/multerConfig');
//const uploadFile = require('../configuration/busboyConfig');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Módulo de usuarios
 */

router.post('/premium/:uid', UsersController.changeUserRole);
router.get('/logout', UsersController.logout);
router.get('/', UsersController.getAllUsers);

router.delete('/:uid', UsersController.deleteUserById);
router.delete('/', UsersController.deleteInactiveUsers);

router.post('/:uid/documents', uploadFileMulter, UsersController.uploadDocuments);

module.exports = router;
