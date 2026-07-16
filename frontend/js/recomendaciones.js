const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) window.location.href = '/pages/login.html';
document.getElementById('tituloRecomendaciones').textContent = `Hola ${usuario.nombre}, aquí están tus recomendaciones`;

if (usuario.es_admin === 1) {
    const navLinks = document.querySelector('.nav-links');
    const adminLink = document.createElement('a');
    adminLink.href = '/pages/admin.html';
    adminLink.textContent = 'Panel Admin';
    navLinks.insertBefore(adminLink, navLinks.firstChild);
}

let restaurantesData = [];
let paginaActual = 1;
let totalPaginas = 1;
let favoritosSet = new Set();

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

async function cargarFavoritos() {
    const res = await fetch(`${API_URL}/api/favoritos/${usuario.id}`);
    const data = await res.json();
    favoritosSet = new Set(data.map(f => f.id));
}

async function cargarRecomendaciones(page = 1) {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('restaurantesGrid').innerHTML = '';
    await cargarFavoritos();

    try {
        const res = await fetch(`${API_URL}/api/recomendaciones/${usuario.id}?page=${page}`);
        const data = await res.json();

        document.getElementById('loading').style.display = 'none';

        if (res.status === 404) {
            document.getElementById('alertError').innerHTML = '¡Aún no tienes un perfil alimenticio configurado! <a href="/pages/perfil.html" class="btn-primary" style="margin-left:1rem; font-size:0.9rem; padding: 0.5rem 1.2rem;">Configurar perfil</a>';
            document.getElementById('alertError').classList.add('visible');
            return;
        }

        if (!res.ok || (data.data && data.data.length === 0)) {
            document.getElementById('alertError').textContent = 'No se encontraron restaurantes para tu perfil.';
            document.getElementById('alertError').classList.add('visible');
            return;
        }

        restaurantesData = data.data;
        paginaActual = data.page;
        totalPaginas = data.totalPages;

        renderizarRestaurantes(restaurantesData);
        renderizarPaginacion();

    } catch (err) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('alertError').textContent = 'Error al cargar recomendaciones';
        document.getElementById('alertError').classList.add('visible');
    }
}

function renderizarRestaurantes(lista) {
    const grid = document.getElementById('restaurantesGrid');
    const noResultados = document.getElementById('noResultados');

    if (lista.length === 0) {
        grid.innerHTML = '';
        noResultados.style.display = 'block';
        return;
    }

    noResultados.style.display = 'none';
    grid.innerHTML = lista.map(r => `
    <div class="restaurante-card" onclick="verDetalle(${r.id_restaurante}, ${r.puntaje_coincidencia})">
        ${r.imagen_url ? `<img src="${r.imagen_url}" alt="${r.restaurante}" class="card-imagen">` : `<div class="card-imagen-placeholder"><i class="fa-solid fa-utensils"></i></div>`}
        <div class="card-header">
            <span class="card-nombre">${r.restaurante}</span>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="card-puntaje">${Math.min(Math.round(r.puntaje_coincidencia * 10), 100)}% match</span>
                <button class="btn-favorito ${favoritosSet.has(r.id_restaurante) ? 'activo' : ''}" 
                    onclick="toggleFavorito(event, ${r.id_restaurante})" 
                    title="Favorito">
                    <i class="fa-${favoritosSet.has(r.id_restaurante) ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
        </div>
        <p class="card-cocina"><i class="fa-solid fa-bowl-food"></i> ${r.tipo_cocina}</p>
        <p class="card-direccion"><i class="fa-solid fa-location-dot"></i> ${r.direccion}</p>
        <span class="card-precio precio-${r.rango_precio}">${r.rango_precio}</span>
    </div>
`).join('');
}

async function toggleFavorito(event, id_restaurante) {
    event.stopPropagation();
    const esFavorito = favoritosSet.has(id_restaurante);
    const btn = event.currentTarget;

    if (esFavorito) {
        await fetch(`${API_URL}/api/favoritos/${usuario.id}/${id_restaurante}`, { method: 'DELETE' });
        favoritosSet.delete(id_restaurante);
        btn.classList.remove('activo');
        btn.querySelector('i').className = 'fa-regular fa-heart';
    } else {
        await fetch(`${API_URL}/api/favoritos/${usuario.id}/${id_restaurante}`, { method: 'POST' });
        favoritosSet.add(id_restaurante);
        btn.classList.add('activo');
        btn.querySelector('i').className = 'fa-solid fa-heart';
    }
}

function renderizarPaginacion() {
    const paginacion = document.getElementById('paginacion');
    if (totalPaginas <= 1) {
        paginacion.style.display = 'none';
        return;
    }

    paginacion.style.display = 'flex';
    paginacion.innerHTML = `
        <button class="btn-paginacion" onclick="cambiarPagina(${paginaActual - 1})" ${paginaActual === 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="paginacion-info">Página ${paginaActual} de ${totalPaginas}</span>
        <button class="btn-paginacion" onclick="cambiarPagina(${paginaActual + 1})" ${paginaActual === totalPaginas ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;
}

function cambiarPagina(page) {
    if (page < 1 || page > totalPaginas) return;
    cargarRecomendaciones(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filtrar() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const cocina = document.getElementById('filtroCocina').value;
    const precio = document.getElementById('filtroPrecio').value;

    const filtrados = restaurantesData.filter(r => {
        const nombreMatch = r.restaurante.toLowerCase().includes(busqueda);
        const cocinaMatch = cocina === '' || r.tipo_cocina === cocina;
        const precioMatch = precio === '' || r.rango_precio === precio;
        return nombreMatch && cocinaMatch && precioMatch;
    });

    renderizarRestaurantes(filtrados);
}

function verDetalle(id, puntaje) {
    window.location.href = `/pages/detalle.html?id=${id}&puntaje=${puntaje}`;
}

cargarRecomendaciones();