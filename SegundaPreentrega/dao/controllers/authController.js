// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('../../dao/db/models/User');
const transporter = require('../../configuration/mailer');
const secret = 'mi_secreto';
require('dotenv').config();
const { createTransporter } = require('../../configuration/mailer'); 

// Funcion para mostrar el formulario de solicitud de restablecimiento de contraseña
exports.renderRequestPasswordResetForm = (req, res) => {
    res.render('users/request-password-reset');
};

// Funcion para manejar la solicitud de restablecimiento de contraseña
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(500).json({ success: false, message: 'Usuario no encontrado' });
    }
    else{
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    const resetLink = `http://localhost:8080/api/auth/reset-password/${token}`;

    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: process.env.GMAIL_USER,  // Remitente
            to: email,                    // Destinatario
            subject: 'Restablecimiento de Contraseña',  // Asunto
            text: `Para restablecer tu contraseña, sigue este enlace: ${resetLink}`  // Mensaje
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Correo de recuperación enviado con éxito.' });
    } catch (error) {
        console.error('Error al enviar email: ', error);
        res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
    }
    }
};
// Funcion para mostrar el formulario de restablecimiento de contraseña
exports.resetPasswordForm = (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, secret);
        res.render('users/reset-password', { token });
    } catch (error) {
        res.status(400).send('El enlace ha expirado o es inválido. Por favor, solicita un nuevo enlace.');
    }
};

// Funcion para actualizar la contraseña
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);

        // Verificar que la nueva contraseña no sea la misma que la anterior
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: 'La nueva contraseña no puede ser la misma que la contraseña actual.' });
        }

        // Hash de la nueva contraseña y guardarla
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({ success: false, message: 'El enlace ha expirado o es inválido. Por favor, solicita un nuevo enlace.' });
    }
};
