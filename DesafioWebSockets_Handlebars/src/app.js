const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { engine } = require('express-handlebars');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const productManager = new ProductManager('./productos.json');
const cartManager = new CartManager('./carts.json');

app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(routes(io, productManager, cartManager));

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('productAdded', (newProductData) => {
        // Lógica para agregar productos
        try {
          console.log('DATA:',newProductData)
            const newProduct = {
                title: newProductData.title,
                description: newProductData.description,
                id:newProductData.id,
            };

            // Verifica si ya existe un producto con el mismo ID
            const existingProduct = productManager.getProductById(newProductData.id);
            if (existingProduct) {
                console.log(`El producto con ID ${newProductData.id} ya existe. No se agregará.`);
            } else {
                // Agrega el producto solo si no existe un producto con el mismo ID
                productManager.addProduct(newProduct);
                io.emit('updateRealTimeProducts', { action: 'add', product: newProduct });
                console.log('Producto agregado correctamente al sistema');
            }
        } catch (error) {
            console.error('Error al agregar el producto al sistema:', error);
        }
    });

    socket.on('productRemoved', (productId) => {
        // Lógica para eliminar el producto utilizando ProductManager
        try {
            console.log('ID A BORRAR:', productId.id)
            const productIds = productId.id
            const removedProduct = productManager.deleteProduct(productIds);
            if (removedProduct) {
                io.emit('updateRealTimeProducts', { action: 'remove', productIds });
                console.log(`Producto eliminado correctamente del sistema. ID: ${productIds}`);
            } else {
                console.error(`No se encontró el producto con ID: ${productIds}`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto del sistema:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Ruta para el endpoint raíz
app.get('/', (req, res) => {
    const productList = productManager.getProductList();
    res.render('home', { products: productList });
});

app.get('/realtimeproducts', (req, res) => {
    const productList = productManager.getProductList();
    res.render('realTimeProducts', { products: productList });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
