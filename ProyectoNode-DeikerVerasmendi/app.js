const express = require('express');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('./configuration/winston-config');
const loggerTestRouter = require('./routes/loggerTest');
const favicon = require('serve-favicon');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const env = process.env.NODE_ENV || 'production';
const useDB = process.env.USE_DB === 'true';

//logger.debug(`App environment: ${env}`);


// Configuración de express-session
app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false
}));
//
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para analizar el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }));

// Middleware para simular la sesión del usuario
app.use((req, res, next) => {
    if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(';');
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name === 'session') {
                try {
                    req.session.user = JSON.parse(decodeURIComponent(value)).user;
                } catch (e) {
                    console.error('Error parsing session cookie:', e);
                }
            }
        });
    }
    next();
});

// Middleware para identificar solicitudes API
app.use((req, res, next) => {
    req.isApiRequest = req.path.startsWith('/api') || req.headers['content-type'] === 'application/json';
    //console.log('ES POSTMAN', req.isApiRequest, req.session.user);
    next();
});



// Configuracion de Express y Socket.IO
app.use('/public', express.static('public'));

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    extname: '.handlebars',
    defaultLayout: 'main', // Aquí establecemos el layout predeterminado a 'main'
    layoutsDir: path.join(__dirname, 'views', 'layouts'), // Ruta a la carpeta de layouts
    partialsDir: path.join(__dirname, 'views', 'partials'), // Ruta a la carpeta de partials
    allowProtoPropertiesByDefault: true,
    helpers: {
        json: function (context) {
            return new exphbs.handlebars.SafeString(JSON.stringify(context));
        },
        contentFor: function (name, options) {
            if (!this._blocks) {
                this._blocks = {};
            }
            const block = this._blocks[name] || [];
            block.push(options.fn(this));
            this._blocks[name] = block;
        },
        block: function (name) {
            if (!this._blocks || !this._blocks[name]) {
                return null;
            }
            const content = this._blocks[name].join('\n');
            delete this._blocks[name];
            return content;
        },
        eq: function (a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this);
        },
        eq2: function (a, b) {
            return a === b;
        },
        eachWithCartId: function(context, options) {
            let ret = '';
            for (let i = 0; i < context.length; i++) {
                context[i].cartId = options.data.root.cartId;
                ret = ret + options.fn(context[i]);
            }
            return ret;
        },
        multiply: function (a, b) {
            return a * b;
        },
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
        hasProfilePhoto: function(documents, options) {
            const hasProfile = documents.some(doc => doc.title === 'profilephoto');
            return hasProfile ? options.fn(this) : options.inverse(this);
        },
        hasDocument: function(documents, options) {
            const hasProfile = documents.some(doc => doc.title === 'document');
            return hasProfile ? options.fn(this) : options.inverse(this);
        },
        hasProduct: function(documents, options) {
            const hasProfile = documents.some(doc => doc.title === 'products');
            return hasProfile ? options.fn(this) : options.inverse(this);
        },
        ifContains: function (str, substring, options) {
            if (str.includes(substring)) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'flaticon.ico')));
app.use(express.json());

app.use((req, res, next) => {
    req.isApiRequest = req.path.startsWith('/api') || req.headers['content-type'] === 'application/json';
    //console.log('ES POSTMAN', req.isApiRequest)
    next();
});

// Conexion a MongoDB y modelos si USE_DB es true, de lo contrario, usa FileSystem
if (useDB) {
    //logger.debug('Conexión por database');

    const connectDB = require('./dao/db/db');
    connectDB(); // Conectar a MongoDB Atlas

    const productRoutes = require('./routes/productRoutes'); // Importa las rutas de productos para MongoDB
    const cartRoutes = require('./routes/cartRoutes');
    const messageRoutes = require('./routes/messageRoutes');
    const authRoutes = require('./routes/authRoutes');
    const UsersRoutes = require('./routes/UsersRoutes');

    app.use((req, res, next) => {
        req.isApiRequest = req.path.startsWith('/api') || req.headers['content-type'] === 'application/json';
        next();
    });
    
    const swaggerApp = require('./configuration/swagger');
    app.use('/', swaggerApp);

    app.use('/api/products', productRoutes);
    app.use('/api/carts', cartRoutes); 
    app.use('/api/messages', messageRoutes); 
    app.use('/api/auth', authRoutes);
    app.use('/api/users', UsersRoutes);

    app.get('/', (req, res) => {
        const logged = req.session.logged || false;
        if (req.isApiRequest) {
            logger.info('Solicitud HTTP');
            res.json({ message: 'Esta es una respuesta de la API' });
        } else {
            const cartId = '';
            const user_role = '';
            logger.http('Solicitud HTTP');
            res.render('login', { pageTitle: 'Chicken with Rice', logged, user_role, cartId });
        }
    });

    const renderController = require('./dao/controllers/renderController');
    app.use('/', renderController);
    app.use('/products', renderController);
    app.get('/register', renderController); 
    app.post('/registerUpload', renderController); 
    app.get('/api/sessions/github', renderController); 
    app.get('/api/sessions/current', renderController); 
    app.post('/login', renderController); 
    app.get('/chat', renderController); 
    app.get('/orders', renderController); 
    app.get('/perfilUsuario', renderController); 
    app.get('/users/:uid', renderController);
    app.use(loggerTestRouter);

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    });

    // Middleware para redirigir todas las rutas no definidas a la ruta principal
    app.use((req, res, next) => {
        res.redirect('/');
    });
}

const PORT = process.env.NODE_ENV === 'test' ? (process.env.TEST_PORT || 8081) : (process.env.PORT || 8080);
const serverInstance = server.listen(PORT, () => {
    logger.info(`Servidor Express escuchando en el puerto ${PORT}`);
});

module.exports = { app, serverInstance };
