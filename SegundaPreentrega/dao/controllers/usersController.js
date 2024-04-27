const mongoose = require('mongoose');
const User = require('../db/models/User');
const Cart = require('../db/models/Cart');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Validacion de usuarios
exports.verifyLogin = async (username, password) => {
    try {
        // Buscar el usuario en la base de datos por el nombre de usuario
        const user = await User.findOne({ username });

        // Si no se encuentra el usuario, retornar null
        if (!user) {
            return null;
        }

        // Comparar la contraseña introducida con el hash almacenado
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Devolver el usuario si la contraseña coincide, de lo contrario, retornar null
        return passwordMatch ? user : null;
    } catch (error) {
        throw error;
    }
};


// Obtener todos los usuarios
exports.getAllUsers = async (req, res, next) => {
    try {
        // Logica para obtener todos los usuarios
        const users = await User.find();

        if (req.isApiRequest) {
            // Logica para manejar solicitudes de API
            res.status(200).json({ status: 'success', payload: users });
        } else {
            // Logica para manejar solicitudes web
            res.locals.usersData = { users };
            next();
        }
    } catch (error) {
        next(error);
    }
};

// Agregar un usuario
exports.addUser = async (req, res) => {
    try {
        // Validacion de datos
        const { username, email, age, password, role } = req.body;

        if (!username || !email || !age || !password || !role) {
            // Si falta algún dato obligatorio, retorna un error de validacion
            return res.status(400).json({ status: 'error', message: 'Faltan datos obligatorios' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Crear una nueva instancia del modelo User con los datos recibidos
        const newUser = new User({
            username,
            email,
            age,
            password: hashedPassword,
            role,
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Crear un carrito para el nuevo usuario
        const newCart = await Cart.create({ userId: newUser._id, userEmail: newUser.email });
        
        // Asociar el ID del carrito al usuario
        newUser.cartId = newCart._id;
        await newUser.save();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};


// Define los tipos de error como un objeto
const ErrorType = {
    INVALID_PARAM: 'INVALID_PARAM',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    // Agrega más tipos de error si es necesario
};

// Exporta los tipos de error para que estén disponibles en otros módulos
module.exports.ErrorType = ErrorType;

// Define la función para obtener un usuario por su ID
exports.getUserById = async (userId) => {
    try {
        // Logica para buscar el usuario en la base de datos por su ID
        const user = await User.findById(userId);
        return user; // Retorna el usuario encontrado
    } catch (error) {
        // Si ocurre un error, lanzalo y manejarlo en otro lugar
        throw error;
    }
};
