// renderController.js
const express = require('express');
const router = express.Router();
const productsController = require('./productsController');
const cartsController = require('./cartsController');
const usersController = require('./usersController');
const messageController = require('./messageController');
const ticketController = require('./ticketController');


const User = require('../db/models/User');
require('dotenv').config();

//HASH
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Configuracion de github Passport
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// Configuración de Passport y GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID, //TU_CLIENT_ID
    clientSecret: process.env.CLIENT_SECRET, //TU_CLIENT_SECRET
    callbackURL: process.env.CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    try {
    console.log('ACCESS TOKEN:',accessToken)
    // Verifica si el usuario ya está registrado en tu base de datos
    const existingUser = await User.findOne({ githubId: profile.id });

    if (existingUser) {
    // El usuario ya esta registrado, simplemente retorna el usuario existente
    return done(null, existingUser);
    } else {
    // El usuario no está registrado, realiza el registro
    password=profile.id
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        githubId: profile.id,
        username: profile.username,
        email: profile.username,
        age:0,
        password:hashedPassword,
        role:'user'
    });

    // Guarda el nuevo usuario en la base de datos
    await newUser.save();

    // Retorna el nuevo usuario
    return done(null, newUser);
    }
} catch (error) {
    // Manejo de errores
    return done(error);
}
}
));

passport.serializeUser((user, done) => {
done(null, user);
});

passport.deserializeUser((obj, done) => {
done(null, obj);
});

router.use(passport.initialize());
router.use(passport.session());

// Ruta para iniciar sesion con GitHub
router.get('/api/sessions/github', passport.authenticate('github'));
// Ruta de retorno despues de la autenticacion de GitHub
router.get('/api/sessions/github/callback',
passport.authenticate('github', { failureRedirect: '/' }),
(req, res) => {
// Redirige al usuario despues de la autenticacion exitosa
            req.session.logged = true;
            req.session.user = {
                id: req.user.id,
                username: req.user.username,
                role: 'user', 
            };
            res.redirect('/products');
});


// Ruta para verificar el usuario actual
router.get('/api/sessions/current', (req, res) => {
    // Verificar si el usuario está autenticado
    if (req.session.logged && req.session.user) {
        // Obtener los campos necesarios del usuario
        const { username, email } = req.session.user;

        // Crear el DTO del usuario
        const userDTO = { username, email };

        // Devolver el DTO del usuario
        res.json({ user: userDTO });
    } else {
        // Si no hay usuario autenticado, devolver un error
        res.status(401).json({ message: 'No hay usuario autenticado' });
    }
});

module.exports = router;







//// RUTAS VARIAS ////
// Obtener y renderizar todos los productos en el navegador web
router.get('/', productsController.getAllProducts, async (req, res) => {
    try {
        const productsData = res.locals.productsData;
        if (productsData && productsData.payload) {
            const user = req.session.user;
            // Renderiza la vista adecuada según el rol del usuario
            if (user && user.role === 'admin') {
                res.render('realTimeProducts', {
                    pageTitle: 'Lista de Productos en Tiempo Real',
                    products: productsData.payload,
                    logged: req.session.logged || false, 
                    user_role: user.role,
                    welcomeMessage: `Bienvenido: ${user.username} | ROL: ${user.role}`,
                    uniqueCategories: productsData.uniqueCategories
                });
            } else {
                // Si el usuario no es un administrador, renderiza la vista normal de productos, buscar el carrito correspondiente
                let cartId;
                const cart = await cartsController.getCartByUserId(req, res);
                cartId = cart ? cart._id : null;
                console.log('CARD ID: ',cartId)
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
                    user_role: user.role,
                    welcomeMessage: user ? `Bienvenido: ${user.username} | ROL: ${user.role}` : '',
                    uniqueCategories: productsData.uniqueCategories,
                    cartId: cartId 
                });
            }
        } else {
            console.log('El resultado de getAllProducts es undefined o no tiene payload.');
            res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error al renderizar la vista' });
    }
});



// Ruta para obtener y renderizar productos por categoría
router.get('/products/category/:category?', productsController.getProductsByCategory, async (req, res) => {
    try {
        const productsData = res.locals.productsData;
        const user = req.session.user;
        // Realizar la copia profunda del objeto antes de renderizar la vista
        res.locals.productsData.payload = JSON.parse(JSON.stringify(productsData.payload));
        // Si el usuario no es un administrador, renderiza la vista normal de productos, buscar el carrito correspondiente
        let cartId;
        const cart = await cartsController.getCartByUserId(req, res);
        cartId = cart ? cart._id : null;
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
                user_role: user.role,
                welcomeMessage: req.session.user ? `Bienvenido ${req.session.user.username} | ROL: ${req.session.user.role}` : '',
                categorySubtitle: req.params.category ? `Categoría: ${req.params.category}` : '',  // Muestra la categoria solo si se filtra
                uniqueCategories: productsData.uniqueCategories,
                cartId: cartId 
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
    const user = req.session.user;
    try {
        const product = await productsController.getProductDetails(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }  
        const cartId = await cartsController.getCartByUserId(req, res);
        // Renderizar la vista de detalles del producto
        res.render('products/details', { product ,cartId ,logged: req.session.logged || false, user_role: user.role});
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

// Ruta para finalizar el proceso de compra de un carrito
router.get('/carts/:cartId/purchase', async (req, res, next) => {
    try {
        await cartsController.purchaseCart(req, res);
    } catch (error) {
        next(error);
    }
});



/// USERS ///
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const user = await usersController.verifyLogin(username, password);

        if (user) {
            req.session.logged = true;
            req.session.user = user;
            if (user.role =='admin'){
                console.log('Es un admin! Role:',user.role)
            }else{
                console.log('Es un user comun Role:',user.role)
            }
            res.redirect('/products');
        } else {
            // Si las credenciales son incorrectas, renderizar la página de login con un mensaje de error
            res.render('failedlogin');
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).render('failedlogin', {
            error: 'Error interno del servidor'
        });
    }
});


// Controlador para renderizar el formulario de registro
router.get('/registerForm', (req, res) => {
    try {
        const user = req.session.user;
        // Renderizar la vista con el formulario de registro
        res.render('users/register', {
            pageTitle: 'Registro de Usuario',
            logged: req.session.logged || false,
            welcomeMessage: user ? `Bienvenido: ${user.username} | ROL: ${user.role}` : '',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error al renderizar el formulario de registro' });
    }
});


// Ruta para cargar la vista de registro y procesar el registro de usuarios
router.post('/registerUpload', usersController.getAllUsers, async (req, res) => {
    try {
        const usersData = res.locals.usersData;
        if (usersData && usersData.users) {
            const { username, email } = req.body;

            const userExists = usersData.users.some(user => user.username === username || user.email === email);

            if (userExists) {
                console.log('El usuario ya existe.');
                // Devolver un JSON indicando que el usuario ya existe
                res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
            } else {
                // Si el usuario no existe, puedes realizar el registro
                await usersController.addUser(req, res);
                // Devolver un JSON indicando que el registro fue exitoso
                res.status(200).json({ status: 'success', message: 'Registro exitoso' });
            }
        } else {
            console.log('El resultado de getAllUsers es undefined o no tiene users.');
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al procesar la solicitud' });
    }
});

//CHATS
router.get('/chat', async (req, res, next) => {
    const logged = req.session.logged || false;
    const user = req.session.user; // Obtener el usuario de la sesión

    if (user) {
        if (user.role === 'admin') {
            console.log('Es un admin! Role:', user.role);
            try {
                const messages = await messageController.getAllMessages();
                res.render('chats/admin', { pageTitle: 'Chat para administradores', logged, isAdmin: true, messages });
            } catch (error) {
                console.error('Error al obtener los mensajes:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        } else {
            console.log('Es un usuario común Role:', user.role);
            // Renderizar la vista normal para el usuario común
            res.render('chats/users', { pageTitle: 'Chat para usuarios', logged, isAdmin: false });
        }
    } else {
        // Renderizar la vista sin información adicional si el usuario no está autenticado
        res.render('chat', { pageTitle: 'Chat', logged, isAdmin: false });
    }
});

//ORDERS
router.get('/orders', async (req, res, next) => {
    const logged = req.session.logged || false;
    const user = req.session.user;
    if (user) {
        const tickets = await ticketController.getAllTickets();

        if (user.role === 'admin') {
            console.log('Es un admin!');
            try {
                res.render('orders/admin', { pageTitle: 'Pedidos Realizados', logged, tickets });
            } catch (error) {
                console.error('Error al obtener los mensajes:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        } else {
            const tickets = await ticketController.getTicketsByPurchaser(user.email);
            console.log('Es un usuario');
            // Renderizar la vista normal para el usuario común
            res.render('orders/users', { pageTitle: 'Tus pedidos', logged, tickets  });
        }
    } else {
        // Renderizar la vista sin información adicional si el usuario no está autenticado
        res.render('chat', { pageTitle: 'Chat', logged, isAdmin: false });
    }
});


module.exports = router;
