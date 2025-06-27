const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { requireAdmin, requireAdminOrEjecutivo } = require('../middlewares/authorize');
const { validateUserCreation, validateUserUpdate } = require('../middlewares/validation');
const userController = require('../controllers/userController');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para administradores
router.get('/', requireAdmin, userController.getAllUsers);
router.get('/:id', requireAdmin, userController.getUserById);
router.post('/', requireAdmin, validateUserCreation, userController.createUser);
router.put('/:id', requireAdmin, validateUserUpdate, userController.updateUser);
router.patch('/:id/password', requireAdmin, userController.changePassword);
router.delete('/:id', requireAdmin, userController.deleteUser);

// Rutas que admin y ejecutivo pueden usar (solo lectura)
router.get('/profile/me', requireAdminOrEjecutivo, (req, res) => {
    res.json({
        success: true,
        message: 'Perfil obtenido',
        data: req.user
    });
});

module.exports = router;