const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

const swaggerDefinition = {
openapi: '3.0.0',
info: {
title: 'Ecommerce API',
version: '1.0.0',
description: 'Documentación de la API de Ecommerce ChickenWithRice',
},
servers: [
{
    url: 'http://localhost:8080',
    description: 'Servidor de desarrollo',
},
],
};

const options = {
swaggerDefinition,
// Path to the API docs
apis: ['./routes/*.js'], // Archivos donde tienes tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
