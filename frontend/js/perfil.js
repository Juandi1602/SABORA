const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) window.location.href = '/pages/login.html';

let perfilActual = null;

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

function mostrarEdicion() {
    document.getElementById('vistaPerfil').style.display = 'none';
    document.getElementById('vistaEdicion').style.display = 'block';
    if (perfilActual) cargarFormulario(perfilActual);
}

function mostrarVista() {
    document.getElementById('vistaEdicion').style.display = 'none';
    document.getElementById('vistaPerfil').style.display = 'block';
}

async function cargarPerfil() {
    try {
        const res = await fetch(`${API_URL}/api/perfil/${usuario.id}`);
        document.getElementById('loadingPerfil').style.display = 'none';

        if (res.ok) {
            perfilActual = await res.json();
            mostrarResumen(perfilActual);
            document.getElementById('perfilResumen').style.display = 'block';
        } else {
            document.getElementById('sinPerfil').style.display = 'block';
        }
    } catch (err) {
        document.getElementById('loadingPerfil').style.display = 'none';
        document.getElementById('sinPerfil').style.display = 'block';
    }
}

function mostrarResumen(perfil) {
    const dietas = {
        ninguna: 'Ninguna (como de todo)', vegetariano: 'Vegetariano',
        vegano: 'Vegano', pescetariano: 'Pescetariano',
        flexitariano: 'Flexitariano', fitness: 'Fitness',
        keto: 'Keto', paleo: 'Paleo'
    };
    const dietaEl = document.getElementById('vistaDieta');
    dietaEl.textContent = dietas[perfil.tipo_dieta] || perfil.tipo_dieta;

    const intolerancias = {
        sin_lactosa: 'Sin Lactosa', sin_gluten: 'Sin Gluten',
        sin_mariscos: 'Sin Mariscos', sin_frutos_secos: 'Sin Frutos Secos',
        sin_huevo: 'Sin Huevo', sin_soya: 'Sin Soya',
        sin_cerdo: 'Sin Cerdo', sin_maiz: 'Sin Maíz'
    };
    const intEl = document.getElementById('vistaIntolerancias');
    const intTags = Object.entries(intolerancias)
        .filter(([key]) => perfil[key] === 1)
        .map(([, label]) => `<span class="caracteristica-tag">${label}</span>`)
        .join('');
    intEl.innerHTML = intTags || '<span style="color:var(--gray-500)">Ninguna</span>';

    const preferencias = {
        halal: 'Halal', kosher: 'Kosher', sin_picante: 'Sin Picante',
        bajo_sodio: 'Bajo Sodio', bajo_azucar: 'Bajo Azúcar', organico: 'Orgánico'
    };
    const prefEl = document.getElementById('vistaPreferencias');
    const prefTags = Object.entries(preferencias)
        .filter(([key]) => perfil[key] === 1)
        .map(([, label]) => `<span class="caracteristica-tag">${label}</span>`)
        .join('');
    prefEl.innerHTML = prefTags || '<span style="color:var(--gray-500)">Ninguna</span>';

    const precios = { economico: 'Económico (S/. 10-20)', moderado: 'Moderado (S/. 20-50)', premium: 'Premium (S/. 50+)' };
    const precioEl = document.getElementById('vistaPrecio');
    precioEl.textContent = precios[perfil.rango_precio];
    precioEl.className = `card-precio precio-${perfil.rango_precio}`;

    const cocinas = {
        cocina_peruana: 'Peruana', cocina_italiana: 'Italiana',
        cocina_japonesa: 'Japonesa', cocina_china: 'China',
        cocina_mexicana: 'Mexicana', cocina_americana: 'Americana',
        cocina_mediterranea: 'Mediterránea', cocina_india: 'India',
        cocina_francesa: 'Francesa', cocina_arabe: 'Árabe',
        cocina_vegetariana: 'Vegetariana', cocina_fusion: 'Fusión'
    };
    const cocEl = document.getElementById('vistaCocinas');
    const cocTags = Object.entries(cocinas)
        .filter(([key]) => perfil[key] === 1)
        .map(([, label]) => `<span class="caracteristica-tag">${label}</span>`)
        .join('');
    cocEl.innerHTML = cocTags || '<span style="color:var(--gray-500)">Ninguna preferencia</span>';
}

function cargarFormulario(perfil) {
    const radioDieta = document.querySelector(`input[name="tipo_dieta"][value="${perfil.tipo_dieta}"]`);
    if (radioDieta) radioDieta.checked = true;

    const campos = [
        'sin_lactosa', 'sin_gluten', 'sin_mariscos', 'sin_frutos_secos',
        'sin_huevo', 'sin_soya', 'sin_cerdo', 'sin_maiz',
        'halal', 'kosher', 'sin_picante', 'bajo_sodio', 'bajo_azucar', 'organico',
        'cocina_peruana', 'cocina_italiana', 'cocina_japonesa', 'cocina_china',
        'cocina_mexicana', 'cocina_americana', 'cocina_mediterranea', 'cocina_india',
        'cocina_francesa', 'cocina_arabe', 'cocina_vegetariana', 'cocina_fusion'
    ];
    campos.forEach(campo => {
        const el = document.getElementById(campo);
        if (el) el.checked = perfil[campo] === 1;
    });

    const radioPrecio = document.querySelector(`input[name="rango_precio"][value="${perfil.rango_precio}"]`);
    if (radioPrecio) radioPrecio.checked = true;
}

async function guardarPerfil() {
    const btn = document.getElementById('btnGuardar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    const datos = {
        tipo_dieta: document.querySelector('input[name="tipo_dieta"]:checked').value,
        sin_lactosa: document.getElementById('sin_lactosa').checked ? 1 : 0,
        sin_gluten: document.getElementById('sin_gluten').checked ? 1 : 0,
        sin_mariscos: document.getElementById('sin_mariscos').checked ? 1 : 0,
        sin_frutos_secos: document.getElementById('sin_frutos_secos').checked ? 1 : 0,
        sin_huevo: document.getElementById('sin_huevo').checked ? 1 : 0,
        sin_soya: document.getElementById('sin_soya').checked ? 1 : 0,
        sin_cerdo: document.getElementById('sin_cerdo').checked ? 1 : 0,
        sin_maiz: document.getElementById('sin_maiz').checked ? 1 : 0,
        halal: document.getElementById('halal').checked ? 1 : 0,
        kosher: document.getElementById('kosher').checked ? 1 : 0,
        sin_picante: document.getElementById('sin_picante').checked ? 1 : 0,
        bajo_sodio: document.getElementById('bajo_sodio').checked ? 1 : 0,
        bajo_azucar: document.getElementById('bajo_azucar').checked ? 1 : 0,
        organico: document.getElementById('organico').checked ? 1 : 0,
        rango_precio: document.querySelector('input[name="rango_precio"]:checked').value,
        cocina_peruana: document.getElementById('cocina_peruana').checked ? 1 : 0,
        cocina_italiana: document.getElementById('cocina_italiana').checked ? 1 : 0,
        cocina_japonesa: document.getElementById('cocina_japonesa').checked ? 1 : 0,
        cocina_china: document.getElementById('cocina_china').checked ? 1 : 0,
        cocina_mexicana: document.getElementById('cocina_mexicana').checked ? 1 : 0,
        cocina_americana: document.getElementById('cocina_americana').checked ? 1 : 0,
        cocina_mediterranea: document.getElementById('cocina_mediterranea').checked ? 1 : 0,
        cocina_india: document.getElementById('cocina_india').checked ? 1 : 0,
        cocina_francesa: document.getElementById('cocina_francesa').checked ? 1 : 0,
        cocina_arabe: document.getElementById('cocina_arabe').checked ? 1 : 0,
        cocina_vegetariana: document.getElementById('cocina_vegetariana').checked ? 1 : 0,
        cocina_fusion: document.getElementById('cocina_fusion').checked ? 1 : 0
    };

    try {
        const res = await fetch(`${API_URL}/api/perfil/${usuario.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (res.ok) {
            perfilActual = { ...perfilActual, ...datos };
            mostrarResumen(perfilActual);
            mostrarVista();
            const success = document.getElementById('alertSuccess');
            success.textContent = '¡Perfil actualizado correctamente!';
            success.classList.add('visible');
            setTimeout(() => success.classList.remove('visible'), 3000);
        } else {
            const error = document.getElementById('alertError');
            error.textContent = data.error;
            error.classList.add('visible');
        }
    } catch (err) {
        const error = document.getElementById('alertError');
        error.textContent = 'Error de conexión con el servidor';
        error.classList.add('visible');
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios';
}

const style = document.createElement('style');
style.textContent = `
    .perfil-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
`;
document.head.appendChild(style);

cargarPerfil();