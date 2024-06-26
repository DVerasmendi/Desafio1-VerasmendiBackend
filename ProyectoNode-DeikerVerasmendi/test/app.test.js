const request = require('supertest');
const { app, serverInstance } = require('../app');

describe('App test Principal', () => {
    afterAll(() => {
        serverInstance.close(); // Cierra el servidor después de las pruebas
    });

    it('should respond with status 200 for the home route', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    });

    it('should respond with status 200 for the API products route', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
    });
});
