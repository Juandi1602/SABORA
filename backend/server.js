const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const db = require('./database');
const authRoutes = require('./routes/auth.routes');
const restaurantesRoutes = require('./routes/restaurantes.routes');
const perfilRoutes = require('./routes/perfil.routes');
const recomendacionesRoutes = require('./routes/recomendaciones.routes');
const favoritosRoutes = require('./routes/favoritos.routes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/recomendaciones', recomendacionesRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Frontend Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/pages/:page', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages', req.params.page));
});

// 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/pages/404.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});