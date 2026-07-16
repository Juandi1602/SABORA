function validarNombre(valor) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(valor.trim());
}

function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}

function validarContrasena(valor) {
    return valor.length >= 8;
}

function mostrarError(id, mostrar) {
    const el = document.getElementById(id);
    const input = el.previousElementSibling.tagName === 'DIV'
        ? el.previousElementSibling.querySelector('input')
        : el.previousElementSibling;
    if (mostrar) {
        el.classList.add('visible');
        input.classList.add('error');
    } else {
        el.classList.remove('visible');
        input.classList.remove('error');
    }
}

// Toggle contraseña
document.getElementById('togglePassword').addEventListener('click', () => {
    const input = document.getElementById('contrasena');
    const icon = document.getElementById('togglePassword');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

// Validaciones en tiempo real
document.getElementById('nombre').addEventListener('blur', () => {
    mostrarError('errorNombre', !validarNombre(document.getElementById('nombre').value));
});

document.getElementById('apellido').addEventListener('blur', () => {
    mostrarError('errorApellido', !validarNombre(document.getElementById('apellido').value));
});

document.getElementById('email').addEventListener('blur', () => {
    mostrarError('errorEmail', !validarEmail(document.getElementById('email').value));
});

document.getElementById('contrasena').addEventListener('blur', () => {
    mostrarError('errorContrasena', !validarContrasena(document.getElementById('contrasena').value));
});

async function registrar() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    // Validar todo
    let valido = true;
    if (!validarNombre(nombre)) { mostrarError('errorNombre', true); valido = false; }
    if (!validarNombre(apellido)) { mostrarError('errorApellido', true); valido = false; }
    if (!validarEmail(email)) { mostrarError('errorEmail', true); valido = false; }
    if (!validarContrasena(contrasena)) { mostrarError('errorContrasena', true); valido = false; }
    if (!valido) return;

    // Deshabilitar botón
    const btn = document.getElementById('btnRegistro');
    btn.disabled = true;
    btn.textContent = 'Registrando...';

    try {
        const res = await fetch(`${API_URL}/api/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, email, contrasena })
        });

        const data = await res.json();

        if (res.ok) {
            const success = document.getElementById('alertSuccess');
            success.textContent = '¡Cuenta creada! Redirigiendo...';
            success.classList.add('visible');
            setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            const error = document.getElementById('alertError');
            error.textContent = data.error;
            error.classList.add('visible');
            btn.disabled = false;
            btn.textContent = 'Registrarse';
        }
    } catch (err) {
        const error = document.getElementById('alertError');
        error.textContent = 'Error de conexión con el servidor';
        error.classList.add('visible');
        btn.disabled = false;
        btn.textContent = 'Registrarse';
    }
}