const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) window.location.href = '/pages/login.html';

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const puntaje = params.get('puntaje');
if (!id) window.location.href = '/pages/recomendaciones.html';

const etiquetas = {
    apto_vegetariano: '🥦 Vegetariano',
    apto_vegano: '🌿 Vegano',
    apto_pescetariano: '🐟 Pescetariano',
    apto_flexitariano: '🥑 Flexitariano',
    apto_fitness: '💪 Fitness',
    apto_keto: '🥩 Keto',
    apto_paleo: '🫐 Paleo',
    sin_lactosa: '🚫 Sin Lactosa',
    sin_gluten: '🌾 Sin Gluten',
    sin_mariscos: '🦐 Sin Mariscos',
    sin_frutos_secos: '🥜 Sin Frutos Secos',
    sin_huevo: '🥚 Sin Huevo',
    sin_soya: '🌱 Sin Soya',
    sin_cerdo: '🐷 Sin Cerdo',
    sin_maiz: '🌽 Sin Maíz',
    halal: '☪️ Halal',
    kosher: '✡️ Kosher',
    sin_picante: '🌶️ Sin Picante',
    bajo_sodio: '🧂 Bajo Sodio',
    bajo_azucar: '🍬 Bajo Azúcar',
    organico: '🌍 Orgánico'
};

async function cargarDetalle() {
    try {
        const res = await fetch(`${API_URL}/api/restaurantes/${id}`);
        if (!res.ok) {
            window.location.href = '/pages/recomendaciones.html';
            return;
        }

        const r = await res.json();
        document.getElementById('loading').style.display = 'none';
        document.getElementById('detalleContent').style.display = 'block';

        document.title = `${r.nombre} — Sabora`;
        document.getElementById('nombre').textContent = r.nombre;
        document.getElementById('descripcion').textContent = r.descripcion || 'Sin descripción disponible';
        document.getElementById('telefono').textContent = r.telefono || 'No disponible';
        document.getElementById('direccion').textContent = r.direccion || 'No disponible';

        const tipoCocina = document.getElementById('tipoCocina');
        tipoCocina.textContent = r.tipo_cocina;
        tipoCocina.className = 'badge-cocina';

        const rangoPrecio = document.getElementById('rangoPrecio');
        rangoPrecio.textContent = r.rango_precio;
        rangoPrecio.className = `card-precio precio-${r.rango_precio}`;

        if (r.imagen_url) {
            const img = document.createElement('img');
            img.src = r.imagen_url;
            img.alt = r.nombre;
            img.style.cssText = 'width:100%; height:250px; object-fit:cover; border-radius:12px; margin-bottom:1.5rem;';
            document.getElementById('detalleContent').insertBefore(img, document.querySelector('.detalle-header'));
        }

        if (puntaje) {
            document.getElementById('puntajeDetalle').innerHTML = `${Math.min(Math.round(puntaje * 10), 100)}% match`;
        }

        const caracteristicasDiv = document.getElementById('caracteristicas');
        const tags = Object.entries(etiquetas)
            .filter(([key]) => r[key] === 1)
            .map(([, label]) => `<span class="caracteristica-tag">${label}</span>`)
            .join('');
        caracteristicasDiv.innerHTML = tags || '<p style="color:var(--gray-500)">Sin características especiales registradas</p>';

        if (r.direccion) {
            const direccionEncoded = encodeURIComponent(r.direccion + ', Lima, Perú');
            document.getElementById('mapaContainer').innerHTML = `
                <iframe 
                    width="100%" 
                    height="300" 
                    style="border:0; border-radius:8px;" 
                    loading="lazy" 
                    src="https://maps.google.com/maps?q=${direccionEncoded}&output=embed">
                </iframe>
            `;
        }

    } catch (err) {
        window.location.href = '/pages/recomendaciones.html';
    }
}

cargarDetalle();