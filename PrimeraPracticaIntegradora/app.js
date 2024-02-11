const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const USE_DB = process.env.USE_DB || true; // Bandera para usar DB o FileSystem TRUE : MONGO ATLAS, FALSE: FILESYSTEM

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuración de Express y Socket.IO
app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Conexión a MongoDB y modelos si USE_DB es true, de lo contrario, usa FileSystem
if (USE_DB) {
const connectDB = require('./dao/db/db');
connectDB(); // Conectar a MongoDB Atlas
console.log('Por database');
const productRoutes = require('./routes/productRoutes'); // Importa las rutas de productos para MongoDB
const cartRoutes = require('./routes/cartRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/products', productRoutes); // Usa rutas de productos para operaciones de DB
app.use('/api/carts', cartRoutes); 
app.use('/api/messages', messageRoutes); 


// Ruta para acceder a la vista del chat
app.get('/chat', (req, res) => {
res.render('chat');
});

} else {
console.log('Por FileSystem');
const ProductManager = require('./dao/fileSystem/ProductManager');
const CartManager = require('./dao/fileSystem/CartManager');
const routes = require('./routes');


const productManager = new ProductManager('./dao/fileSystem/productos.json');
const cartManager = new CartManager('./dao/fileSystem/carts.json');



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

}



const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
