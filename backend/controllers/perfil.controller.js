const db = require('../database');

// OBTENER PERFIL DE UN USUARIO
const getPerfil = (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        'SELECT * FROM perfiles_alimenticios WHERE id_usuario = ?',
        [id_usuario],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener perfil' });
            if (results.length === 0) return res.status(404).json({ error: 'Perfil no encontrado' });
            res.json(results[0]);
        }
    );
};

// CREAR O ACTUALIZAR PERFIL
const guardarPerfil = (req, res) => {
    const { id_usuario } = req.params;
    const {
        tipo_dieta,
        sin_lactosa, sin_gluten, sin_mariscos, sin_frutos_secos,
        sin_huevo, sin_soya, sin_cerdo, sin_maiz,
        halal, kosher, sin_picante, bajo_sodio, bajo_azucar, organico,
        rango_precio,
        cocina_peruana, cocina_italiana, cocina_japonesa, cocina_china,
        cocina_mexicana, cocina_americana, cocina_mediterranea, cocina_india,
        cocina_francesa, cocina_arabe, cocina_vegetariana, cocina_fusion
    } = req.body;

    // Verificar que el usuario existe
    db.query('SELECT id FROM usuarios WHERE id = ? AND activo = 1', [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Verificar si ya tiene perfil
        db.query('SELECT id FROM perfiles_alimenticios WHERE id_usuario = ?', [id_usuario], (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' });

            const valores = [
                tipo_dieta || 'ninguna',
                sin_lactosa || 0, sin_gluten || 0, sin_mariscos || 0, sin_frutos_secos || 0,
                sin_huevo || 0, sin_soya || 0, sin_cerdo || 0, sin_maiz || 0,
                halal || 0, kosher || 0, sin_picante || 0, bajo_sodio || 0,
                bajo_azucar || 0, organico || 0,
                rango_precio || 'moderado',
                cocina_peruana || 0, cocina_italiana || 0, cocina_japonesa || 0, cocina_china || 0,
                cocina_mexicana || 0, cocina_americana || 0, cocina_mediterranea || 0, cocina_india || 0,
                cocina_francesa || 0, cocina_arabe || 0, cocina_vegetariana || 0, cocina_fusion || 0
            ];

            if (results.length === 0) {
                // Crear perfil
                db.query(
                    `INSERT INTO perfiles_alimenticios 
                    (id_usuario, tipo_dieta, sin_lactosa, sin_gluten, sin_mariscos, sin_frutos_secos,
                    sin_huevo, sin_soya, sin_cerdo, sin_maiz, halal, kosher, sin_picante, bajo_sodio,
                    bajo_azucar, organico, rango_precio, cocina_peruana, cocina_italiana, cocina_japonesa,
                    cocina_china, cocina_mexicana, cocina_americana, cocina_mediterranea, cocina_india,
                    cocina_francesa, cocina_arabe, cocina_vegetariana, cocina_fusion)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id_usuario, ...valores],
                    (err) => {
                        if (err) return res.status(500).json({ error: 'Error al crear perfil' });
                        res.status(201).json({ message: 'Perfil creado correctamente' });
                    }
                );
            } else {
                // Actualizar perfil
                db.query(
                    `UPDATE perfiles_alimenticios SET
                    tipo_dieta=?, sin_lactosa=?, sin_gluten=?, sin_mariscos=?, sin_frutos_secos=?,
                    sin_huevo=?, sin_soya=?, sin_cerdo=?, sin_maiz=?, halal=?, kosher=?, sin_picante=?,
                    bajo_sodio=?, bajo_azucar=?, organico=?, rango_precio=?, cocina_peruana=?,
                    cocina_italiana=?, cocina_japonesa=?, cocina_china=?, cocina_mexicana=?,
                    cocina_americana=?, cocina_mediterranea=?, cocina_india=?, cocina_francesa=?,
                    cocina_arabe=?, cocina_vegetariana=?, cocina_fusion=?
                    WHERE id_usuario=?`,
                    [...valores, id_usuario],
                    (err) => {
                        if (err) return res.status(500).json({ error: 'Error al actualizar perfil' });
                        res.json({ message: 'Perfil actualizado correctamente' });
                    }
                );
            }
        });
    });
};

module.exports = { getPerfil, guardarPerfil };