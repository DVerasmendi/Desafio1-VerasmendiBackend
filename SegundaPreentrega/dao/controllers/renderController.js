// renderController.js
const express = require('express');
const router = express.Router();
const productsController = require('./productsController');
const cartsController = require('./cartsController');

// Obtener y renderizar todos los productos en el navegador web
router.get('/', productsController.getAllProducts, (req, res) => {
    try {
        const productsData = res.locals.productsData;
         // Realizar la copia profunda del objeto antes de renderizar la vista
        res.locals.productsData.payload = JSON.parse(JSON.stringify(productsData.payload));
    if (productsData && productsData.payload) {
        const user = req.session.user;
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
        logged: req.session.logged || false, 
        welcomeMessage: user ? `Bienvenido: ${user.role} | ROL: ${user.username}` : '',
        uniqueCategories:productsData.uniqueCategories

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


// Ruta para obtener y renderizar productos por categoría
router.get('/products/category/:category?', productsController.getProductsByCategory, (req, res) => {
    try {
        const productsData = res.locals.productsData;
        // Realizar la copia profunda del objeto antes de renderizar la vista
        res.locals.productsData.payload = JSON.parse(JSON.stringify(productsData.payload));

        if (productsData && productsData.payload) {
            // Renderiza la vista con los datos obtenidos
            res.render('products/index', {
                pageTitle: 'Productos',
                products: productsData.payload,
                totalPages: productsData.totalPages,
                prevPage: productsData.prevPage,
                nextPage: productsData.nextPage,
                page: productsData.page,
                hasPrevPage: productsData.hasPrevPage,
                hasNextPage: productsData.hasNextPage,
                prevLink: productsData.hasPrevPage ? `/products/category/${req.params.category}?page=${productsData.prevPage}` : null,
                nextLink: productsData.hasNextPage ? `/products/category/${req.params.category}?page=${productsData.nextPage}` : null,
                logged: req.session.logged || false,
                welcomeMessage: req.session.user ? `Bienvenido ${req.session.user.role} | ROL: ${req.session.user.username}` : '',
                categorySubtitle: req.params.category ? `Categoría: ${req.params.category}` : '',  // Muestra la categoría solo si se filtra
                uniqueCategories: productsData.uniqueCategories
            });
        } else {
            console.log('El resultado de getProductsByCategory es undefined o no tiene payload.');
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: 'Error al renderizar la vista' });
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
        res.render('products/details', { product ,logged: req.session.logged || false});
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
        res.render('carts/cartDetails', { items: cartData.items, totalPrice: cartData.totalPrice, cartId:cartId,logged: req.session.logged || false });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
