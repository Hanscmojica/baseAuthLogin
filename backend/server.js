const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); 
const { testConnection } = require('./services/userService'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Probar conexión a la base de datos al iniciar
const startServer = async () => {
    try {
        await testConnection();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📋 Panel de usuarios: http://localhost:${PORT}/api/users`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos');
        process.exit(1);
    }
};

startServer();