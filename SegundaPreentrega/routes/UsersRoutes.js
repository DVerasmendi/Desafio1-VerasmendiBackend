// routes/UsersRoutes.js
const express = require('express');
const UsersController = require('../dao/controllers/usersController');
const router = express.Router();

router.post('/premium/:uid', UsersController.changeUserRole);

module.exports = router;
