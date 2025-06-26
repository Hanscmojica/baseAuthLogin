const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const findByEmail = async (email) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        console.error('Error al buscar usuario por email:', error);
        throw new Error('Error al buscar usuario');
    }
};

const validatePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('Error al validar contraseña:', error);
        return false;
    }
};

const createUser = async (email, password, name, role = 'user') => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, role]
        );
        
        const [newUser] = await pool.execute('SELECT id, email, name, role FROM users WHERE id = ?', [result.insertId]);
        return newUser[0];
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw new Error('Error al crear usuario');
    }
};

const findById = async (id) => {
    try {
        const [rows] = await pool.execute('SELECT id, email, name, role FROM users WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        throw new Error('Error al buscar usuario por ID');
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
    findByEmail,
    validatePassword,
    createUser,
    findById,
    testConnection
};