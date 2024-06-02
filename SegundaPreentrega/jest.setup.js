const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, serverInstance } = require('./app'); // Importa el servidor y la aplicación para cerrarlos después de las pruebas

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect(); // Desconectar cualquier conexión previa
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    serverInstance.close(); // Cierra el servidor después de las pruebas
});
