const db = require('../database');

const getRecomendaciones = (req, res) => {
    const { id_usuario } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    db.query(
        'SELECT * FROM perfiles_alimenticios WHERE id_usuario = ?',
        [id_usuario],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' });
            if (results.length === 0) return res.status(404).json({ error: 'El usuario no tiene perfil alimenticio' });

            db.query(
                'SELECT COUNT(*) as total FROM vista_recomendaciones WHERE id_usuario = ? AND puntaje_coincidencia > 0',
                [id_usuario],
                (err, countResults) => {
                    if (err) return res.status(500).json({ error: 'Error al obtener total' });

                    const total = countResults[0].total;

                    db.query(
                        'SELECT * FROM vista_recomendaciones WHERE id_usuario = ? AND puntaje_coincidencia > 0 LIMIT ? OFFSET ?',
                        [id_usuario, limit, offset],
                        (err, results) => {
                            if (err) return res.status(500).json({ error: 'Error al obtener recomendaciones' });
                            if (results.length === 0) return res.json({ message: 'No se encontraron restaurantes', data: [], total: 0, page, totalPages: 0 });
                            res.json({ data: results, total, page, totalPages: Math.ceil(total / limit) });
                        }
                    );
                }
            );
        }
    );
};

module.exports = { getRecomendaciones };