const jwt = require('jsonwebtoken');
const userService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_super_secreta_aqui_2024';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const validPassword = await userService.validatePassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getProfile = (req, res) => {
    res.json({
        message: 'Perfil obtenido exitosamente',
        user: { id: req.user.userId, email: req.user.email }
    });
};

const refreshToken = (req, res) => {
    const token = jwt.sign(
        { userId: req.user.userId, email: req.user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({ token });
};

// AGREGAR ESTE MÉTODO
const logout = (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            message: 'Sesión cerrada exitosamente' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al cerrar sesión',
            error: error.message 
        });
    }
};

module.exports = {
    login,
    getProfile,
    refreshToken,
    logout  // <- AGREGAR AQUÍ
};