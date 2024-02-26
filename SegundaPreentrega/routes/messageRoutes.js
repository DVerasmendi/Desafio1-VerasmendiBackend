const express = require('express');
const router = express.Router();
const messageController = require('../dao/controllers/messageController');

//Obtiene todos los mensajes
router.get('/', messageController.getAllMessages);
//Agrega un mensaje
router.post('/', messageController.addMessage);
//Borra un mensaje
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;