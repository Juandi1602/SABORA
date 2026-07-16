let restauranteEditandoId = null;

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

async function cargarRestaurantes() {
    try {
        const res = await fetch(`${API_URL}/api/restaurantes`);
        const data = await res.json();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('tablaContainer').style.display = 'block';

        const tbody = document.getElementById('tablaBody');
        tbody.innerHTML = data.map(r => `
            <tr style="border-bottom:1px solid var(--gray-100);">
                <td style="padding:1rem;">
                    ${r.imagen_url ? `<img src="${r.imagen_url}" style="width:50px; height:50px; object-fit:cover; border-radius:8px; margin-right:0.5rem; vertical-align:middle;">` : ''}
                    ${r.nombre}
                </td>
                <td style="padding:1rem; text-transform:capitalize;">${r.tipo_cocina}</td>
                <td style="padding:1rem; text-transform:capitalize;">${r.rango_precio}</td>
                <td style="padding:1rem;">${r.direccion || '—'}</td>
                <td style="padding:1rem; text-align:center;">
                    <button onclick="editarRestaurante(${r.id})" style="background:var(--primary); color:white; border:none; padding:0.4rem 0.8rem; border-radius:6px; cursor:pointer; margin-right:0.5rem;">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="eliminarRestaurante(${r.id}, '${r.nombre}')" style="background:var(--error); color:white; border:none; padding:0.4rem 0.8rem; border-radius:6px; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        document.getElementById('loading').style.display = 'none';
        mostrarError('Error al cargar restaurantes');
    }
}

function mostrarFormulario(restaurante = null) {
    restauranteEditandoId = restaurante ? restaurante.id : null;
    document.getElementById('modalTitulo').textContent = restaurante ? 'Editar Restaurante' : 'Agregar Restaurante';

    // Limpiar formulario
    ['fNombre', 'fDescripcion', 'fTelefono', 'fDireccion', 'fImagenUrl'].forEach(id => {
        document.getElementById(id).value = restaurante ? (restaurante[id.replace('f', '').toLowerCase()] || '') : '';
    });

    document.getElementById('fNombre').value = restaurante ? restaurante.nombre : '';
    document.getElementById('fDescripcion').value = restaurante ? (restaurante.descripcion || '') : '';
    document.getElementById('fTelefono').value = restaurante ? (restaurante.telefono || '') : '';
    document.getElementById('fDireccion').value = restaurante ? (restaurante.direccion || '') : '';
    document.getElementById('fImagenUrl').value = restaurante ? (restaurante.imagen_url || '') : '';
    document.getElementById('fTipoCocina').value = restaurante ? restaurante.tipo_cocina : '';
    document.getElementById('fRangoPrecio').value = restaurante ? restaurante.rango_precio : '';

    const checkboxes = ['apto_vegetariano', 'apto_vegano', 'apto_pescetariano', 'apto_flexitariano',
        'apto_fitness', 'apto_keto', 'apto_paleo', 'sin_lactosa', 'sin_gluten', 'sin_mariscos',
        'sin_frutos_secos', 'sin_huevo', 'sin_soya', 'sin_cerdo', 'sin_maiz',
        'halal', 'kosher', 'sin_picante', 'bajo_sodio', 'bajo_azucar', 'organico'];

    checkboxes.forEach(campo => {
        const el = document.getElementById(`c${campo}`);
        if (el) el.checked = restaurante ? restaurante[campo] === 1 : false;
    });

    document.getElementById('modal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    restauranteEditandoId = null;
}

async function editarRestaurante(id) {
    const res = await fetch(`${API_URL}/api/restaurantes/${id}`);
    const data = await res.json();
    mostrarFormulario(data);
}

async function guardarRestaurante() {
    const nombre = document.getElementById('fNombre').value.trim();
    const tipo_cocina = document.getElementById('fTipoCocina').value;
    const rango_precio = document.getElementById('fRangoPrecio').value;

    if (!nombre || !tipo_cocina || !rango_precio) {
        mostrarError('Nombre, tipo de cocina y precio son obligatorios');
        return;
    }

    const body = {
        nombre,
        descripcion: document.getElementById('fDescripcion').value.trim(),
        tipo_cocina,
        telefono: document.getElementById('fTelefono').value.trim(),
        direccion: document.getElementById('fDireccion').value.trim(),
        rango_precio,
        imagen_url: document.getElementById('fImagenUrl').value.trim(),
        caracteristicas: {
            apto_vegetariano: document.getElementById('capto_vegetariano').checked ? 1 : 0,
            apto_vegano: document.getElementById('capto_vegano').checked ? 1 : 0,
            apto_pescetariano: document.getElementById('capto_pescetariano').checked ? 1 : 0,
            apto_flexitariano: document.getElementById('capto_flexitariano').checked ? 1 : 0,
            apto_fitness: document.getElementById('capto_fitness').checked ? 1 : 0,
            apto_keto: document.getElementById('capto_keto').checked ? 1 : 0,
            apto_paleo: document.getElementById('capto_paleo').checked ? 1 : 0,
            sin_lactosa: document.getElementById('csin_lactosa').checked ? 1 : 0,
            sin_gluten: document.getElementById('csin_gluten').checked ? 1 : 0,
            sin_mariscos: document.getElementById('csin_mariscos').checked ? 1 : 0,
            sin_frutos_secos: document.getElementById('csin_frutos_secos').checked ? 1 : 0,
            sin_huevo: document.getElementById('csin_huevo').checked ? 1 : 0,
            sin_soya: document.getElementById('csin_soya').checked ? 1 : 0,
            sin_cerdo: document.getElementById('csin_cerdo').checked ? 1 : 0,
            sin_maiz: document.getElementById('csin_maiz').checked ? 1 : 0,
            halal: document.getElementById('chalal').checked ? 1 : 0,
            kosher: document.getElementById('ckosher').checked ? 1 : 0,
            sin_picante: document.getElementById('csin_picante').checked ? 1 : 0,
            bajo_sodio: document.getElementById('cbajo_sodio').checked ? 1 : 0,
            bajo_azucar: document.getElementById('cbajo_azucar').checked ? 1 : 0,
            organico: document.getElementById('corganico').checked ? 1 : 0,
        }
    };

    const btn = document.getElementById('btnGuardar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    const url = restauranteEditandoId
        ? `${API_URL}/api/restaurantes/${restauranteEditandoId}`
        : `${API_URL}/api/restaurantes`;
    const method = restauranteEditandoId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.ok) {
            cerrarModal();
            mostrarExito(data.message);
            cargarRestaurantes();
        } else {
            mostrarError(data.error);
        }
    } catch (err) {
        mostrarError('Error de conexión con el servidor');
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar';
}

async function eliminarRestaurante(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;

    try {
        const res = await fetch(`${API_URL}/api/restaurantes/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok) {
            mostrarExito(data.message);
            cargarRestaurantes();
        } else {
            mostrarError(data.error);
        }
    } catch (err) {
        mostrarError('Error de conexión con el servidor');
    }
}

function mostrarError(msg) {
    const el = document.getElementById('alertError');
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 3000);
}

function mostrarExito(msg) {
    const el = document.getElementById('alertSuccess');
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 3000);
}

cargarRestaurantes();