// renderController.js
const express = require('express');
const router = express.Router();
const productsController = require('./productsController');
const cartsController = require('./cartsController');

// Obtener y renderizar todos los productos en el navegador web
router.get('/', productsController.getAllProducts, (req, res) => {
    try {
        console.log('SIN PRODUCTOS RENDER')
        const productsData = res.locals.productsData;
        console.log('PRODUCTOS RENDER:',productsData)
         // Realizar la copia profunda del objeto antes de renderizar la vista
        res.locals.productsData.payload = JSON.parse(JSON.stringify(productsData.payload));
        console.log('PRODUCTOS RENDER 2:',res.locals.productsData)

    if (productsData && productsData.payload) {
        console.log('INGRESA ACA')
    // Renderiza la vista con los datos obtenidos
    try {
    res.render('products/index', {
        pageTitle: 'Productos',
        products: productsData.payload,
        totalPages: productsData.totalPages,
        prevPage: productsData.prevPage,
        nextPage: productsData.nextPage,
        page: productsData.page,
        hasPrevPage: productsData.hasPrevPage,
        hasNextPage: productsData.hasNextPage,
        prevLink: productsData.hasPrevPage ? `/products?page=${productsData.prevPage}` : null,
        nextLink: productsData.hasNextPage ? `/products?page=${productsData.nextPage}` : null,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error al renderizar la vista' });
    }
    } else {
    console.log('El resultado de getAllProducts es undefined o no tiene payload.');
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
    }catch (error) {
        // Asegúrate de incluir esta línea para manejar errores
        console.log(error);
        next(error);
    }
    
});


// Ruta para ver detalles de un producto
router.get('/products/:id', async (req, res, next) => {
    const productId = req.params.id;

    try {
        const product = await productsController.getProductDetails(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }   
        console.log('DATILLA:',product)

        // Renderizar la vista de detalles del producto
        res.render('products/details', { product });
    } catch (error) {
        next(error);
    }
});

// Ruta para obtener y renderizar detalles del carrito por ID
router.get('/carts/:cartId', async (req, res, next) => {
    const { cartId } = req.params;

    try {
        const cartData = await cartsController.getCartById(req, res); // Llama al controlador de carritos

        if (!cartData) {
            return; // Ya está manejado en el controlador, no hace falta hacer nada aquí
        }

        // Renderizar la vista de detalles del carrito
        res.render('carts/cartDetails', { items: cartData.items, totalPrice: cartData.totalPrice });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
