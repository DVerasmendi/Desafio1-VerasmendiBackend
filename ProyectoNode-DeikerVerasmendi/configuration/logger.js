// logger.js

const { createLogger, transports, format } = require('winston');

// Niveles de log
const levels = {
debug: 0,
http: 1,
info: 2,
warning: 3,
error: 4,
fatal: 5
};

// Colores asociados a cada nivel de log
const colors = {
debug: 'blue',
http: 'green',
info: 'cyan',
warning: 'yellow',
error: 'red',
fatal: 'magenta'
};

// Formato del log
const logFormat = format.combine(
format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
format.printf(({ timestamp, level, message }) => {
return `${timestamp} [${level.toUpperCase()}]: ${message}`;
})
);

// Transportes para enviar los logs
const transportsOptions = [
new transports.Console({ level: 'debug' }), // Loguear en consola solo para debug
new transports.File({ filename: 'errors.log', level: 'error' }) // Loguear en un archivo solo los errores
];

// Configura el logger
const logger = createLogger({
levels,
format: logFormat,
transports: transportsOptions,
exitOnError: false // Para no terminar el proceso en caso de un error de transporte
});

// Asigna los colores a los niveles de log
const coloredLevels = format.colorize({ all: true });
logger.add(new transports.Console({
format: format.combine(coloredLevels, logFormat),
}));

// Agrega el método 'http' al logger
logger.http = function(message) {
this.log({ level: 'http', message }); // Loguea con el nivel 'http'
};

module.exports = logger;
