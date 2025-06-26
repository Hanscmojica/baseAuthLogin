
const express = require('express');
const { validateLogin } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/refresh', authenticateToken, authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;    