const db = require('../database');

const getFavoritos = (req, res) => {
    const { id_usuario } = req.params;
    db.query(
        `SELECT r.id, r.nombre, r.tipo_cocina, r.rango_precio, r.direccion
         FROM favoritos f
         JOIN restaurantes r ON f.id_restaurante = r.id
         WHERE f.id_usuario = ? AND r.activo = 1`,
        [id_usuario],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener favoritos' });
            res.json(results);
        }
    );
};

const agregarFavorito = (req, res) => {
    const { id_usuario, id_restaurante } = req.params;
    db.query(
        'INSERT INTO favoritos (id_usuario, id_restaurante) VALUES (?, ?)',
        [id_usuario, id_restaurante],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al agregar favorito' });
            res.status(201).json({ message: 'Agregado a favoritos' });
        }
    );
};

const quitarFavorito = (req, res) => {
    const { id_usuario, id_restaurante } = req.params;
    db.query(
        'DELETE FROM favoritos WHERE id_usuario = ? AND id_restaurante = ?',
        [id_usuario, id_restaurante],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al quitar favorito' });
            res.json({ message: 'Quitado de favoritos' });
        }
    );
};

module.exports = { getFavoritos, agregarFavorito, quitarFavorito };