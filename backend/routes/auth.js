const express = require('express');
const { validateLogin } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/auth');
const { authorize, requireAdmin, requireAdminOrEjecutivo } = require('../middlewares/authorize');
const authController = require('../controllers/authController');

const router = express.Router();

// Rutas públicas
router.post('/login', validateLogin, authController.login);

// Rutas que requieren autenticación
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/refresh', authenticateToken, authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

// Rutas de prueba para diferentes roles
router.get('/admin-only', authenticateToken, requireAdmin, (req, res) => {
    res.json({
        success: true,
        message: 'Solo Hans puede ver esto',
        user: req.user
    });
});

router.get('/admin-ejecutivo', authenticateToken, requireAdminOrEjecutivo, (req, res) => {
    res.json({
        success: true,
        message: 'Hans y Gherson pueden ver esto',
        user: req.user
    });
});

router.get('/all-users', authenticateToken, authorize(['admin', 'ejecutivo', 'cliente']), (req, res) => {
    res.json({
        success: true,
        message: 'Todos los usuarios autenticados pueden ver esto',
        user: req.user
    });
});

module.exports = router;