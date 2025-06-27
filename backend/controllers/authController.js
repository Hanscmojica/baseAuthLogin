const jwt = require('jsonwebtoken');
const userService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_super_secreta_aqui_2024';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔍 Intentando login:', { email, password: '***' });
        
        const user = await userService.findByEmail(email);
        console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');
        
        if (!user) {
            console.log('❌ Usuario no encontrado para email:', email);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        console.log('🔐 Comparando contraseñas...');
        const validPassword = await userService.validatePassword(password, user.password);
        console.log('🔐 Contraseña válida:', validPassword ? 'Sí' : 'No');
        
        if (!validPassword) {
            console.log('❌ Contraseña incorrecta para usuario:', email);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('✅ Login exitoso para:', email);
        res.json({
            message: 'Login exitoso',
            token,
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                role: user.role 
            }
        });
    } catch (error) {
        console.error('💥 Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getProfile = (req, res) => {
    console.log('📋 Obteniendo perfil para usuario:', req.user);
    res.json({
        message: 'Perfil obtenido exitosamente',
        user: { 
            id: req.user.userId, 
            email: req.user.email 
        }
    });
};

const refreshToken = (req, res) => {
    console.log('🔄 Refrescando token para usuario:', req.user.email);
    const token = jwt.sign(
        { userId: req.user.userId, email: req.user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({ token });
};

const logout = (req, res) => {
    try {
        console.log('🚪 Usuario cerrando sesión:', req.user.email);
        res.status(200).json({ 
            success: true, 
            message: 'Sesión cerrada exitosamente' 
        });
    } catch (error) {
        console.error('💥 Error en logout:', error);
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
    logout
};