const request = require('supertest');
const { app, serverInstance } = require('../../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let messageId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    serverInstance.close(); 
});

describe('Message Controller', () => {
    it('Obtener todos los mensajes', async () => {
        const res = await request(app).get('/api/messages');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('Agregar un nuevo mensaje', async () => {
        const message = {
            user: 'usuario@example.com',
            message: 'Este es un mensaje de prueba'
        };

        const res = await request(app)
            .post('/api/messages')
            .send(message);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('user', 'usuario@example.com');
        expect(res.body).toHaveProperty('message', 'Este es un mensaje de prueba');
        messageId = res.body._id; 
    });

    it('Borrar un mensaje por ID', async () => {
        // Verificar que messageId no sea undefined o null
        expect(messageId).toBeDefined();

        const res = await request(app)
            .delete(`/api/messages/${messageId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Mensaje eliminado correctamente');
    });
});
