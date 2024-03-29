// renderController.js
const express = require('express');
const router = express.Router();
const productsController = require('./productsController');
const cartsController = require('./cartsController');
const usersController = require('./usersController');
const User = require('../db/models/User');
//HASH
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Configuracion de github Passport
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// Configuración de Passport y GitHub
passport.use(new GitHubStrategy({
    clientID: 'Iv1.01a5d88226c7749d', //TU_CLIENT_ID
    clientSecret: '03a4002b555e73d9a59ec75035d6b72e15427c50', //TU_CLIENT_SECRET
    callbackURL: 'http://localhost:8080/api/sessions/github/callback'
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
    // Devolver el usuario actual
    res.json({ user: req.session.user });
} else {
    // Si no hay usuario autenticado, devolver un error
    res.status(401).json({ message: 'No hay usuario autenticado' });
}
});

module.exports = router;







//// RUTAS VARIAS ////
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
        welcomeMessage: user ? `Bienvenido: ${user.username} | ROL: ${user.role}` : '',
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
                welcomeMessage: req.session.user ? `Bienvenido ${req.session.user.username} | ROL: ${req.session.user.role}` : '',
                categorySubtitle: req.params.category ? `Categoría: ${req.params.category}` : '',  // Muestra la categoria solo si se filtra
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

/// USERS ///
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const user = await usersController.verifyLogin(username, password);

        if (user) {
            req.session.logged = true;
            req.session.user = user;
            console.log('USER:',user)
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



module.exports = router;
