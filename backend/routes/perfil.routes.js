const express = require('express');
const router = express.Router();
const { getPerfil, guardarPerfil } = require('../controllers/perfil.controller');

router.get('/:id_usuario', getPerfil);
router.post('/:id_usuario', guardarPerfil);

module.exports = router;