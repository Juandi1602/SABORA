const express = require('express');
const router = express.Router();
const { getRecomendaciones } = require('../controllers/recomendaciones.controller');

router.get('/:id_usuario', getRecomendaciones);

module.exports = router;