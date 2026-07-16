const bcrypt = require('bcryptjs');
const db = require('../database');

// REGISTRO
const registro = (req, res) => {
    const { nombre, apellido, email, contrasena } = req.body;

    // Validaciones
    if (!nombre || !apellido || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(nombre)) {
        return res.status(400).json({ error: 'Nombre inválido' });
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(apellido)) {
        return res.status(400).json({ error: 'Apellido inválido' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
    }
    if (contrasena.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    // Verificar si el email ya existe
    db.query('SELECT id FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length > 0) return res.status(400).json({ error: 'El email ya está registrado' });

        // Hashear contraseña
        const hash = bcrypt.hashSync(contrasena, 10);

        // Insertar usuario
        db.query(
            'INSERT INTO usuarios (nombre, apellido, email, contrasena) VALUES (?, ?, ?, ?)',
            [nombre, apellido, email, hash],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
                res.status(201).json({ message: 'Usuario registrado correctamente', id: result.insertId });
            }
        );
    });
};

// LOGIN
const login = (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const usuario = results[0];
        const passwordValida = bcrypt.compareSync(contrasena, usuario.contrasena);

        if (!passwordValida) return res.status(401).json({ error: 'Credenciales incorrectas' });

        res.json({
            message: 'Login exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                es_admin: usuario.es_admin
            }
        });
    });
};

module.exports = { registro, login };