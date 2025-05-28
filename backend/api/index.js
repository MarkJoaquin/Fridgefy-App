// Importaciones directas
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Crear instancia de Express
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Fridgefy funcionando correctamente' });
});

// Ruta de prueba para la base de datos
app.get('/test-db', async (req, res) => {
  try {
    // Intentar hacer una consulta simple a la base de datos
    const count = await prisma.user.count();
    res.json({ success: true, message: 'Conexión a la base de datos exitosa', userCount: count });
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error de conexión a la base de datos', 
      error: error.message 
    });
  }
});

// Exportar para Vercel
module.exports = app;
