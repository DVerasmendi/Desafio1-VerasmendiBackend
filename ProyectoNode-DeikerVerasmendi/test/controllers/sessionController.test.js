const request = require('supertest');
const { app, serverInstance } = require('../../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../dao/db/models/User'); 
let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);

    // Crear un usuario de prueba en la base de datos
    const testUser = new User({
        username: 'test',
        email: 'test@example.com',
        age:25,
        password: '$2b$10$fIYASC.5ln/z8UJetn.z.OB9apw/bb20SA0jCdMW1a7deiI/03k.e',
        role: 'user'
    });
    await testUser.save();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    serverInstance.close(); 
});

describe('Session Controller', () => {
    it('Login con sesión interna', async () => {
        const loginData = {
            username: 'test',
            password: 'test'
        };

        const res = await request(app)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(loginData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('user');
    });


    it('Login fail por credenciales invalidas', async () => {
        const loginData = {
            username: 'invalid',
            password: 'invalid'
        };

        const res = await request(app)
            .post('/login')
            .send(loginData);

        expect(res.status).toBe(401); 
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });


    it('Eliminar la sesión actual', async () => {
        const agent = request.agent(app);
        await agent
            .post('/login')
            .send({ username: 'test', password: 'test' });

        const res = await agent.get('/logout');

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/');
    });

    it('Devolver 401 si no hay sesión al obtener la sesión actual', async () => {
        const res = await request(app).get('/api/sessions/current');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'No hay usuario autenticado');
    });

    // Prueba para la autenticacion con GitHub
    it('Redirigir a GitHub para la autenticación', async () => {
        const res = await request(app).get('/api/sessions/github');
        expect(res.status).toBe(302); // 302 indica una redireccion
        expect(res.headers.location).toMatch(/github\.com/); // La ubicacion de redireccion debe contener "github.com"
    });
});
