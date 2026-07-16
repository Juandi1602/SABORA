function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
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
document.getElementById('email').addEventListener('blur', () => {
    mostrarError('errorEmail', !validarEmail(document.getElementById('email').value));
});

document.getElementById('contrasena').addEventListener('blur', () => {
    mostrarError('errorContrasena', document.getElementById('contrasena').value.length === 0);
});

async function login() {
    const email = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    let valido = true;
    if (!validarEmail(email)) { mostrarError('errorEmail', true); valido = false; }
    if (!contrasena) { mostrarError('errorContrasena', true); valido = false; }
    if (!valido) return;

    const btn = document.getElementById('btnLogin');
    btn.disabled = true;
    btn.textContent = 'Iniciando sesión...';

    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            const success = document.getElementById('alertSuccess');
            success.textContent = `¡Bienvenido, ${data.usuario.nombre}! Redirigiendo...`;
            success.classList.add('visible');
            setTimeout(async () => {
                if (data.usuario.es_admin === 1) {
                    window.location.href = '/pages/admin.html';
                    return;
                }
                const perfilRes = await fetch(`${API_URL}/api/perfil/${data.usuario.id}`);
                if (perfilRes.ok) {
                    window.location.href = '/pages/recomendaciones.html';
                } else {
                    window.location.href = '/pages/perfil.html';
                }
            }, 2000);
        } else {
            const error = document.getElementById('alertError');
            error.textContent = data.error;
            error.classList.add('visible');
            btn.disabled = false;
            btn.textContent = 'Iniciar Sesión';
        }
    } catch (err) {
        const error = document.getElementById('alertError');
        error.textContent = 'Error de conexión con el servidor';
        error.classList.add('visible');
        btn.disabled = false;
        btn.textContent = 'Iniciar Sesión';
    }
}