const express = require('express');
const router = express.Router();
const { getRestaurantes, getRestauranteById, createRestaurante, updateRestaurante, deleteRestaurante } = require('../controllers/restaurantes.controller');

router.get('/', getRestaurantes);
router.get('/:id', getRestauranteById);
router.post('/', createRestaurante);
router.put('/:id', updateRestaurante);
router.delete('/:id', deleteRestaurante);

module.exports = router;