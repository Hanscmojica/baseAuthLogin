const jwt = require('jsonwebtoken');
const userService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_super_secreta_aqui_2024';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Token de acceso requerido' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Obtener información completa del usuario desde la base de datos
        const user = await userService.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        // Agregar información completa del usuario al request
        req.user = {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        console.log(`🔐 Usuario autenticado: ${user.email} (${user.role})`);
        next();
    } catch (error) {
        console.error('❌ Error de autenticación:', error.message);
        return res.status(403).json({ 
            success: false,
            message: 'Token inválido o expirado' 
        });
    }
};

module.exports = {
    authenticateToken
};