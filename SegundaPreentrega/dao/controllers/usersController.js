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

// Logout de usuarios
exports.logout = async (req, res) => {
    if (!req.session.user._id) {
        return res.status(400).json({ status: 'error', message: 'No user session found' });
    }

    try {
        const user = await User.findById(req.session.user._id);
        if (user) {
            user.last_connection = new Date();
            await user.save();
        }

        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ status: 'error', message: 'Internal server error' });
            }
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

//Manejar Documentos 
exports.uploadDocuments = async (req, res) => {
    const userId = req.params.uid;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({ status: 'error', message: 'No se han subido archivos' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        if (!user.documents) {
            user.documents = [];
        }

        // Reemplazar la imagen de perfil si existe
        if (files.profile) {
            const profilePhoto = files.profile[0];
            user.documents = user.documents.filter(doc => doc.title !== 'profilephoto');
            user.documents.push({
                title: 'profilephoto',
                name: profilePhoto.originalname,
                reference: profilePhoto.path,
                mimetype: profilePhoto.mimetype,
                filename: profilePhoto.filename
            });
        }

        // Reemplazar productos
        if (files.product) {
            files.product.forEach(file => {
                user.documents.push({
                    title: 'products',
                    name: file.originalname,
                    reference: file.path,
                    mimetype: file.mimetype,
                    filename: file.filename
                });
            });
        }

        // Reemplazar documentos específicos
        if (files.documents) {
            files.documents.forEach(file => {
                let title = 'document';
                if (file.filename.includes('identificacion')) {
                    title = 'document';
                    user.documents = user.documents.filter(doc => !doc.filename.includes('identificacion'));
                } else if (file.filename.includes('comprobante_de_domicilio')) {
                    title = 'document';
                    user.documents = user.documents.filter(doc => !doc.filename.includes('comprobante_de_domicilio'));
                } else if (file.filename.includes('comprobante__estado_cuenta')) {
                    title = 'document';
                    user.documents = user.documents.filter(doc => !doc.filename.includes('comprobante__estado_cuenta'));
                }

                user.documents.push({
                    title: title,
                    name: file.originalname,
                    reference: file.path,
                    mimetype: file.mimetype,
                    filename: file.filename
                });
            });
        }

        await user.save();
        // Actualiza la sesión del usuario
        req.session.user = user;

        res.status(200).json({ status: 'success', message: 'Documentos subidos correctamente', documents: user.documents });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
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



// Cambiar el rol de un usuario
exports.changeUserRole = async (req, res) => {
    const { userId, newRole } = req.body; 
    if (!userId || !newRole) {
        return res.status(400).json({ status: 'error', message: 'Falta el ID del usuario o el nuevo rol' });
    }
    try {
        // Buscar el usuario en la base de datos por su ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        // Validar que el usuario ha subido los tres documentos requeridos
        const requiredDocuments = ['identificacion', 'comprobante_estado_cuenta', 'comprobante_de_domicilio'];
        const userDocuments = user.documents.map(doc => doc.name);
        console.log('Documentos del usuario:', userDocuments); // Añade esta línea para depuración
        const missingDocuments = requiredDocuments.filter(doc => !userDocuments.some(name => name.includes(doc)));
        console.log('Documentos faltantes:', missingDocuments); // Añade esta línea para depuración

        if (newRole === 'premium' && missingDocuments.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Faltan los siguientes documentos para cambiar el rol a premium: ${missingDocuments.join(', ')}`
            });
        }

        // Actualizar el rol del usuario
        user.role = newRole;

        // Guardar el usuario actualizado en la base de datos
        await user.save();

        res.status(200).json({ status: 'success', message: 'El rol del usuario ha sido actualizado correctamente', updatedRole: newRole });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

