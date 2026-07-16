const panel = document.createElement('div');
panel.id = 'accPanel';
panel.innerHTML = `
    <button id="accToggle" title="Accesibilidad">
        <i class="fa-solid fa-universal-access"></i>
    </button>
    <div id="accMenu" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; width:100%;">
            <p class="acc-titulo" style="margin:0;">Accesibilidad</p>
            <button onclick="document.getElementById('accMenu').style.display='none'; document.getElementById('accToggle').style.display='block';" style="background:none; border:none; cursor:pointer; color:#000; font-size:1rem; padding:0; line-height:1;">✕</button>
        </div>
        <button onclick="cambiarFuente(1)"><i class="fa-solid fa-magnifying-glass-plus"></i> Agrandar texto</button>
        <button onclick="cambiarFuente(-1)"><i class="fa-solid fa-magnifying-glass-minus"></i> Reducir texto</button>
        <button onclick="toggleNegrita()"><i class="fa-solid fa-bold"></i> Negrita</button>
        <button onclick="toggleContraste()"><i class="fa-solid fa-circle-half-stroke"></i> Alto contraste</button>
        <button onclick="resetAcc()"><i class="fa-solid fa-rotate-left"></i> Restablecer</button>
    </div>
`;

document.documentElement.appendChild(panel);

document.getElementById('accToggle').addEventListener('click', () => {
    const menu = document.getElementById('accMenu');
    const toggle = document.getElementById('accToggle');
    const abierto = menu.style.display === 'none';
    menu.style.display = abierto ? 'block' : 'none';
    toggle.style.display = abierto ? 'none' : 'block';
});

let tamano = parseInt(localStorage.getItem('acc_tamano') || 0);
let negrita = localStorage.getItem('acc_negrita') === 'true';
let contraste = localStorage.getItem('acc_contraste') === 'true';

function aplicarEstado() {
    document.body.style.fontSize = `${16 + tamano * 2}px`;
    document.body.style.fontWeight = negrita ? '700' : '';
    const accPanel = document.getElementById('accPanel');
    if (contraste) {
        document.body.style.filter = 'contrast(1.5) brightness(0.9)';
        if (accPanel) accPanel.style.filter = 'contrast(0.67) brightness(1.11)';
    } else {
        document.body.style.filter = '';
        if (accPanel) accPanel.style.filter = '';
    }
}

function cambiarFuente(dir) {
    tamano = Math.max(-2, Math.min(4, tamano + dir));
    localStorage.setItem('acc_tamano', tamano);
    aplicarEstado();
}

function toggleNegrita() {
    negrita = !negrita;
    localStorage.setItem('acc_negrita', negrita);
    aplicarEstado();
}

function toggleContraste() {
    contraste = !contraste;
    localStorage.setItem('acc_contraste', contraste);
    aplicarEstado();
}

function resetAcc() {
    tamano = 0; negrita = false; contraste = false;
    localStorage.removeItem('acc_tamano');
    localStorage.removeItem('acc_negrita');
    localStorage.removeItem('acc_contraste');
    aplicarEstado();
}

aplicarEstado();