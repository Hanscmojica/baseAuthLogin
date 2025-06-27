const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (sin contraseñas)
const getAllUsers = async () => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw new Error('Error al obtener usuarios');
    }
};

// Buscar usuario por email
const findByEmail = async (email) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        console.error('Error al buscar usuario por email:', error);
        throw new Error('Error al buscar usuario');
    }
};

// Buscar usuario por ID (sin contraseña)
const findById = async (id) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?', 
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        throw new Error('Error al buscar usuario por ID');
    }
};

// Crear nuevo usuario
const createUser = async (email, password, name, role = 'cliente') => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, role]
        );
        
        // Retornar el usuario creado sin la contraseña
        const [newUser] = await pool.execute(
            'SELECT id, email, name, role, created_at FROM users WHERE id = ?', 
            [result.insertId]
        );
        return newUser[0];
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw new Error('Error al crear usuario');
    }
};

// Actualizar usuario
const updateUser = async (id, userData) => {
    try {
        const { email, name, role } = userData;
        
        await pool.execute(
            'UPDATE users SET email = ?, name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [email, name, role, id]
        );
        
        // Retornar el usuario actualizado
        const [updatedUser] = await pool.execute(
            'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );
        return updatedUser[0];
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw new Error('Error al actualizar usuario');
    }
};

// Cambiar contraseña
const changePassword = async (id, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [hashedPassword, id]
        );
        return true;
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        throw new Error('Error al cambiar contraseña');
    }
};

// Eliminar usuario
const deleteUser = async (id) => {
    try {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw new Error('Error al eliminar usuario');
    }
};

// Validar contraseña
const validatePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('Error al validar contraseña:', error);
        return false;
    }
};

// Función para probar la conexión
const testConnection = async () => {
    try {
        const [rows] = await pool.execute('SELECT 1 as test');
        console.log('✅ Conexión a MySQL exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a MySQL:', error.message);
        return false;
    }
};

module.exports = {
    getAllUsers,
    findByEmail,
    findById,
    createUser,
    updateUser,
    changePassword,
    deleteUser,
    validatePassword,
    testConnection
};