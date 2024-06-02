const request = require('supertest');
const { app, serverInstance } = require('../../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
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

describe('Product Controller', () => {
    it('Obtener todos los productos', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body).toHaveProperty('payload');
        expect(res.body.payload).toBeInstanceOf(Array);
    });

    it('Crear un nuevo producto', async () => {
        const product = {
            name: 'Test Product',
            description: 'Test Description',
            price: 10.99,
            stock: 10,
            imageUrl: 'http://example.com/image.jpg',
            category: 'Test Category',
            owner: 'Test Owner'
        };

        // Simular el usuario en la sesión
        const agent = request.agent(app);
        const res = await agent
            .post('/api/products')
            .set('Cookie', 'session={"user":{"role":"admin"}}') // Configurar la cookie de sesión del usuario
            .send(product);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Producto agregado con éxito');
        expect(res.body.product).toHaveProperty('name', 'Test Product');
        productId = res.body.product._id; // Guardar el ID del producto para las siguientes pruebas
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    it('Actualizar un producto', async () => {
        const updatedProduct = {
            name: 'Updated Product',
            price: 49.99
        };

        // Simular el usuario en la sesión
        const agent = request.agent(app);
        const res = await agent
            .put(`/api/products/${productId}`)
            .set('Cookie', 'session={"user":{"role":"admin"}}') // Configurar la cookie de sesión del usuario
            .send(updatedProduct);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Producto actualizado con éxito');
        expect(res.body.product).toHaveProperty('name', 'Updated Product');
    }, 10000); // Aumentar el tiempo de espera a 10 segundos

    it('Eliminar un producto', async () => {
        // Simular el usuario en la sesión
        const agent = request.agent(app);
        const res = await agent
            .delete(`/api/products/${productId}`)
            .set('Cookie', 'session={"user":{"role":"admin"}}') // Configurar la cookie de sesión del usuario

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Producto eliminado correctamente');
    }, 10000); // Aumentar el tiempo de espera a 10 segundos
});
