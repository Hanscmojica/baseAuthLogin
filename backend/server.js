const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { testConnection } = require('./services/authService'); // <- AGREGAR
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Probar conexión a la base de datos al iniciar
const startServer = async () => {
    try {
        await testConnection();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos');
        process.exit(1);
    }
};

startServer();