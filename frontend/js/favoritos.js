const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) window.location.href = '/pages/login.html';

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

async function cargarFavoritos() {
    try {
        const res = await fetch(`${API_URL}/api/favoritos/${usuario.id}`);
        const data = await res.json();

        document.getElementById('loading').style.display = 'none';

        if (data.length === 0) {
            document.getElementById('noResultados').style.display = 'block';
            return;
        }

        const grid = document.getElementById('favoritosGrid');
        grid.innerHTML = data.map(r => `
            <div class="restaurante-card" onclick="verDetalle(${r.id})">
                <div class="card-header">
                    <span class="card-nombre">${r.nombre}</span>
                    <button class="btn-favorito activo" onclick="quitarFavorito(event, ${r.id})" title="Quitar de favoritos">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                <p class="card-cocina"><i class="fa-solid fa-bowl-food"></i> ${r.tipo_cocina}</p>
                <p class="card-direccion"><i class="fa-solid fa-location-dot"></i> ${r.direccion}</p>
                <span class="card-precio precio-${r.rango_precio}">${r.rango_precio}</span>
            </div>
        `).join('');

    } catch (err) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('alertError').textContent = 'Error al cargar favoritos';
        document.getElementById('alertError').classList.add('visible');
    }
}

async function quitarFavorito(event, id_restaurante) {
    event.stopPropagation();
    await fetch(`${API_URL}/api/favoritos/${usuario.id}/${id_restaurante}`, { method: 'DELETE' });
    cargarFavoritos();
}

function verDetalle(id) {
    window.location.href = `/pages/detalle.html?id=${id}`;
}

cargarFavoritos();