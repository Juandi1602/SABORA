const express = require('express');
const router = express.Router();
const { getFavoritos, agregarFavorito, quitarFavorito } = require('../controllers/favoritos.controller');

router.get('/:id_usuario', getFavoritos);
router.post('/:id_usuario/:id_restaurante', agregarFavorito);
router.delete('/:id_usuario/:id_restaurante', quitarFavorito);

module.exports = router;