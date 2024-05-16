// routes/authRoutes.js
const express = require('express');
const authController = require('../dao/controllers/authController');
const router = express.Router();

router.get('/request-password-reset', authController.renderRequestPasswordResetForm);
router.post('/request-password-reset', authController.requestPasswordReset);
router.get('/reset-password/:token', authController.resetPasswordForm);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
