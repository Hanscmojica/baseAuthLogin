const userService = require('../services/userService');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        console.log(`👥 ${req.user.email} solicitó lista de usuarios`);
        const users = await userService.getAllUsers();
        
        res.json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: users,
            total: users.length
        });
    } catch (error) {
        console.error('💥 Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`👤 ${req.user.email} solicitó usuario ID: ${id}`);
        
        const user = await userService.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario encontrado',
            data: user
        });
    } catch (error) {
        console.error('💥 Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// Crear nuevo usuario
const createUser = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        console.log(`➕ ${req.user.email} creando usuario: ${email}`);

        // Verificar que el email no exista
        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        const newUser = await userService.createUser(email, password, name, role);
        
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: newUser
        });
    } catch (error) {
        console.error('💥 Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, role } = req.body;
        console.log(`✏️ ${req.user.email} actualizando usuario ID: ${id}`);

        // Verificar que el usuario existe
        const existingUser = await userService.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Si se está cambiando el email, verificar que no exista
        if (email && email !== existingUser.email) {
            const emailExists = await userService.findByEmail(email);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }
        }

        const updatedUser = await userService.updateUser(id, { email, name, role });
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
    } catch (error) {
        console.error('💥 Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        console.log(`🔐 ${req.user.email} cambiando contraseña del usuario ID: ${id}`);

        const user = await userService.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        await userService.changePassword(id, newPassword);
        
        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error('💥 Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ ${req.user.email} eliminando usuario ID: ${id}`);

        // No permitir que se elimine a sí mismo
        if (parseInt(id) === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        const user = await userService.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        await userService.deleteUser(id);
        
        res.json({
            success: true,
            message: `Usuario ${user.name} eliminado exitosamente`
        });
    } catch (error) {
        console.error('💥 Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    changePassword,
    deleteUser
};