const request = require('supertest');
const { app, serverInstance } = require('../../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let cartId;
let productId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    serverInstance.close(); // Cierra el servidor después de las pruebas
});

describe('Cart Controller', () => {
    it('Obtener todos los carritos', async () => {
        const res = await request(app).get('/api/carts');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('Crear un nuevo carrito', async () => {
        const cart = {
            userId: 'testuser123',
            userEmail:"test@gmail.com"
        };

        const res = await request(app)
            .post('/api/carts')
            .send(cart);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        cartId = res.body._id;
    });

    it('Agregar un producto al carrito', async () => {
        const product = {
            productId: new mongoose.Types.ObjectId().toString(),
            quantity: 2,
            price: 100
        };

        const res = await request(app)
            .post(`/api/carts/${cartId}/items`)
            .send(product);

        expect(res.status).toBe(200);
        expect(res.body.items).toBeInstanceOf(Array);
        productId = res.body.items[0].productId.toString(); // Guardar el ID del producto para las siguientes pruebas
    });

    it('Actualiza la cantidad de un producto en un carrito', async () => {
        const updatedQuantity = { quantity: 5 };

        const res = await request(app)
            .put(`/api/carts/${cartId}/items/${productId}`)
            .send(updatedQuantity);

        expect(res.status).toBe(200);
        const item = res.body.items.find(item => item.productId.toString() === productId);
        expect(item).toHaveProperty('quantity', 5);
    });


    it('Actualiza el estatus de un carrito a Completed', async () => { const updatedStatus = { status: 'completed' };
        const res = await request(app)
            .put(`/api/carts/${cartId}/status`)
            .send(updatedStatus);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'completed');
    });

    it('Eliminar un producto del carrito por ID', async () => {
        const res = await request(app)
            .delete(`/api/carts/${cartId}/items/${productId}`);

        expect(res.status).toBe(200);
        const item = res.body.items.find(item => item.productId.toString() === productId);
        expect(item).toBeUndefined();
    });
});
