// Validación para login
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email y contraseña son requeridos'
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de email inválido'
        });
    }

    next();
};

// Validación para crear usuario
const validateUserCreation = (req, res, next) => {
    const { email, password, name, role } = req.body;

    // Campos requeridos
    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'Email, contraseña y nombre son requeridos'
        });
    }

    // Validar email
    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de email inválido'
        });
    }

    // Validar contraseña
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    // Validar nombre
    if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'El nombre debe tener entre 2 y 100 caracteres'
        });
    }

    // Validar rol
    const validRoles = ['admin', 'ejecutivo', 'cliente'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Rol inválido. Roles válidos: ' + validRoles.join(', ')
        });
    }

    next();
};

// Validación para actualizar usuario
const validateUserUpdate = (req, res, next) => {
    const { email, name, role } = req.body;

    // Al menos un campo debe estar presente
    if (!email && !name && !role) {
        return res.status(400).json({
            success: false,
            message: 'Al menos un campo debe ser proporcionado para actualizar'
        });
    }

    // Validar email si se proporciona
    if (email && !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Formato de email inválido'
        });
    }

    // Validar nombre si se proporciona
    if (name && (name.length < 2 || name.length > 100)) {
        return res.status(400).json({
            success: false,
            message: 'El nombre debe tener entre 2 y 100 caracteres'
        });
    }

    // Validar rol si se proporciona
    const validRoles = ['admin', 'ejecutivo', 'cliente'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Rol inválido. Roles válidos: ' + validRoles.join(', ')
        });
    }

    next();
};

// Validación para cambio de contraseña
const validatePasswordChange = (req, res, next) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Nueva contraseña es requerida'
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    next();
};

// Función auxiliar para validar email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = {
    validateLogin,
    validateUserCreation,
    validateUserUpdate,
    validatePasswordChange
};