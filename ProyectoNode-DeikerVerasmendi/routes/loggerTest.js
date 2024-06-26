const express = require('express');
const router = express.Router();
const logger = require('../configuration/winston-config');

router.get('/loggerTest', (req, res) => {
logger.debug('Este es un mensaje de depuración');
logger.http('Este es un mensaje HTTP');
logger.info('Este es un mensaje de información');
logger.warning('Este es un mensaje de advertencia');
logger.error('Este es un mensaje de error');
logger.fatal('Este es un mensaje fatal');

res.send('Prueba de registro realizada');
});

module.exports = router;
