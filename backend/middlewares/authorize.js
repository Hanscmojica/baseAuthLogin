const authorize = (roles = []) => {
    // Si no se especifican roles, permite cualquier usuario autenticado
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // Verificar que el usuario esté autenticado
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Usuario no autenticado' 
            });
        }

        // Si no se especifican roles, permitir acceso
        if (roles.length === 0) {
            return next();
        }

        // Verificar que el usuario tenga el rol necesario
        if (!roles.includes(req.user.role)) {
            console.log(`🚫 Acceso denegado: ${req.user.email} (${req.user.role}) intentó acceder a recurso que requiere: ${roles.join(', ')}`);
            return res.status(403).json({ 
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
                required_roles: roles,
                user_role: req.user.role
            });
        }

        console.log(`✅ Acceso autorizado: ${req.user.email} (${req.user.role}) accedió a recurso que requiere: ${roles.join(', ')}`);
        next();
    };
};

// Middleware específicos para cada rol
const requireAdmin = authorize(['admin']);
const requireAdminOrEjecutivo = authorize(['admin', 'ejecutivo']);
const requireAnyRole = authorize(['admin', 'ejecutivo', 'cliente']);

module.exports = {
    authorize,
    requireAdmin,
    requireAdminOrEjecutivo,
    requireAnyRole
};