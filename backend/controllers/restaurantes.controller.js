const db = require('../database');

// OBTENER TODOS LOS RESTAURANTES
const getRestaurantes = (req, res) => {
    db.query(
        `SELECT r.*, rc.* FROM restaurantes r
         JOIN restaurante_caracteristicas rc ON r.id = rc.id_restaurante
         WHERE r.activo = 1`,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener restaurantes' });
            res.json(results);
        }
    );
};

// OBTENER UN RESTAURANTE POR ID
const getRestauranteById = (req, res) => {
    const { id } = req.params;
    db.query(
        `SELECT r.*, rc.* FROM restaurantes r
         JOIN restaurante_caracteristicas rc ON r.id = rc.id_restaurante
         WHERE r.id = ? AND r.activo = 1`,
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener restaurante' });
            if (results.length === 0) return res.status(404).json({ error: 'Restaurante no encontrado' });
            res.json(results[0]);
        }
    );
};

// CREAR RESTAURANTE
const createRestaurante = (req, res) => {
    const { nombre, descripcion, tipo_cocina, telefono, direccion, rango_precio, caracteristicas } = req.body;

    // Validaciones
    if (!nombre || !tipo_cocina || !rango_precio) {
        return res.status(400).json({ error: 'Nombre, tipo de cocina y rango de precio son obligatorios' });
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{3,100}$/.test(nombre)) {
        return res.status(400).json({ error: 'Nombre inválido' });
    }
    if (descripcion && descripcion.length > 500) {
        return res.status(400).json({ error: 'Descripción máximo 500 caracteres' });
    }
    if (telefono && !/^\d{7,15}$/.test(telefono)) {
        return res.status(400).json({ error: 'Teléfono inválido' });
    }

    db.query(
        'INSERT INTO restaurantes (nombre, descripcion, tipo_cocina, telefono, direccion, rango_precio) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, tipo_cocina, telefono, direccion, rango_precio],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear restaurante' });

            const id_restaurante = result.insertId;
            const c = caracteristicas || {};

            db.query(
                `INSERT INTO restaurante_caracteristicas 
                (id_restaurante, apto_vegetariano, apto_vegano, apto_pescetariano, apto_flexitariano,
                apto_fitness, apto_keto, apto_paleo, sin_lactosa, sin_gluten, sin_mariscos,
                sin_frutos_secos, sin_huevo, sin_soya, sin_cerdo, sin_maiz, halal, kosher,
                sin_picante, bajo_sodio, bajo_azucar, organico)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id_restaurante,
                    c.apto_vegetariano || 0, c.apto_vegano || 0, c.apto_pescetariano || 0,
                    c.apto_flexitariano || 0, c.apto_fitness || 0, c.apto_keto || 0,
                    c.apto_paleo || 0, c.sin_lactosa || 0, c.sin_gluten || 0,
                    c.sin_mariscos || 0, c.sin_frutos_secos || 0, c.sin_huevo || 0,
                    c.sin_soya || 0, c.sin_cerdo || 0, c.sin_maiz || 0,
                    c.halal || 0, c.kosher || 0, c.sin_picante || 0,
                    c.bajo_sodio || 0, c.bajo_azucar || 0, c.organico || 0
                ],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Error al guardar características' });
                    res.status(201).json({ message: 'Restaurante creado correctamente', id: id_restaurante });
                }
            );
        }
    );
};

// ELIMINAR RESTAURANTE (soft delete)
const deleteRestaurante = (req, res) => {
    const { id } = req.params;
    db.query(
        'UPDATE restaurantes SET activo = 0 WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar restaurante' });
            res.json({ message: 'Restaurante eliminado correctamente' });
        }
    );
};

// EDITAR RESTAURANTE
const updateRestaurante = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, tipo_cocina, telefono, direccion, rango_precio, imagen_url, caracteristicas } = req.body;

    if (!nombre || !tipo_cocina || !rango_precio) {
        return res.status(400).json({ error: 'Nombre, tipo de cocina y rango de precio son obligatorios' });
    }

    db.query(
        'UPDATE restaurantes SET nombre=?, descripcion=?, tipo_cocina=?, telefono=?, direccion=?, rango_precio=?, imagen_url=? WHERE id=?',
        [nombre, descripcion, tipo_cocina, telefono, direccion, rango_precio, imagen_url, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar restaurante' });

            const c = caracteristicas || {};
            db.query(
                `UPDATE restaurante_caracteristicas SET
                apto_vegetariano=?, apto_vegano=?, apto_pescetariano=?, apto_flexitariano=?,
                apto_fitness=?, apto_keto=?, apto_paleo=?, sin_lactosa=?, sin_gluten=?,
                sin_mariscos=?, sin_frutos_secos=?, sin_huevo=?, sin_soya=?, sin_cerdo=?,
                sin_maiz=?, halal=?, kosher=?, sin_picante=?, bajo_sodio=?, bajo_azucar=?, organico=?
                WHERE id_restaurante=?`,
                [
                    c.apto_vegetariano || 0, c.apto_vegano || 0, c.apto_pescetariano || 0,
                    c.apto_flexitariano || 0, c.apto_fitness || 0, c.apto_keto || 0,
                    c.apto_paleo || 0, c.sin_lactosa || 0, c.sin_gluten || 0,
                    c.sin_mariscos || 0, c.sin_frutos_secos || 0, c.sin_huevo || 0,
                    c.sin_soya || 0, c.sin_cerdo || 0, c.sin_maiz || 0,
                    c.halal || 0, c.kosher || 0, c.sin_picante || 0,
                    c.bajo_sodio || 0, c.bajo_azucar || 0, c.organico || 0,
                    id
                ],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Error al actualizar características' });
                    res.json({ message: 'Restaurante actualizado correctamente' });
                }
            );
        }
    );
};
module.exports = { getRestaurantes, getRestauranteById, createRestaurante, updateRestaurante, deleteRestaurante };