const mongoose = require('mongoose');
const User = require('../db/models/User');

// Validacion de usuarios
exports.verifyLogin = async (username, password) => {
    try {
        const user = await User.findOne({ username, password });
        return user;
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

        // Crear una nueva instancia del modelo User con los datos recibidos
        const newUser = new User({
            username,
            email,
            age,
            password,
            role,
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
    }
};

