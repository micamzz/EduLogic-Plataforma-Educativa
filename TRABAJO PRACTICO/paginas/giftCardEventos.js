
const radiosColor = document.querySelectorAll('input[name="color_estilo"]');
const colorSeleccionado = document.querySelector('input[name="color_estilo"]:checked');
const listaFondos = document.querySelectorAll('input[name="Fondo"]');
const fondoSeleccionado=document.querySelector('input[name="Fondo"]:checked');
const montoUbis=document.querySelectorAll('input[name="Ubicacion"]');
const ubiSeleccionada=document.querySelector('input[name="Ubicacion"]:checked');
const mensaje= document.querySelector('.Box_Preview .Mensaje');
const monto=document.querySelector('.Box_Preview .Monto');
const desti1=document.querySelector('.Box_Preview .Destinatario');
const desti2=document.querySelector('.Box_Preview .Destinatario2');
const cajaPreview=document.querySelector('.Cuadro_Preview');
const destinatario=document.querySelector('input[name="destinatario"]');
const montoIngresado=document.querySelector('input[name="monto"]');
const estilos = document.getElementById('styleSelect');
const tamaño=document.getElementById('style_size');


function aplicarColor(radio) {
  if (radio.checked) {
    mensaje.style.color = radio.value;
    monto.style.color = radio.value;
    desti1.style.color = radio.value;
    desti2.style.color = radio.value;
  }
}

function aplicarFondo(fondo) {
  if (fondo.checked) {
    cajaPreview.style.background = `url(${fondo.value})`;
    cajaPreview.style.backgroundSize = 'cover';
    cajaPreview.style.backgroundPosition = 'center';
  }
}

function aplicarUbicacion(ubi) {
  if (ubi.checked) {
    monto.style.gridColumn = ubi.dataset.columna;
    monto.style.gridRow = ubi.dataset.fila;
    monto.style.justifySelf = ubi.dataset.hori;
    monto.style.alignSelf = ubi.dataset.verti;
  }
}

function aplicarTamaño() {
  const size = tamaño.value + 'px';
  mensaje.style.fontSize = size;
  monto.style.fontSize = size;
  desti1.style.fontSize = size;
  desti2.style.fontSize = size;
}


// ========== FOR EACH / EVENTOS ==========

// Colores
radiosColor.forEach((radio) => {
  radio.addEventListener('change', () => aplicarColor(radio));
});

// Fondos
listaFondos.forEach((fondo) => {
  fondo.addEventListener('change', () => aplicarFondo(fondo));
});

// Ubicación
montoUbis.forEach((ubi) => {
  ubi.addEventListener('change', () => aplicarUbicacion(ubi));
});

// Input destinatario
destinatario.addEventListener('input', () => {
  desti2.textContent = destinatario.value;
});

// Input monto
montoIngresado.addEventListener('input', () => {
  monto.textContent = montoIngresado.value + '$';
});

// Editable mensaje
mensaje.setAttribute('contenteditable', 'true');
mensaje.addEventListener('focus', function borrarAlPrimerClick() {
  mensaje.textContent = '';
  mensaje.removeEventListener('focus', borrarAlPrimerClick);
});

// Selector de fuente
estilos.addEventListener('change', () => {
  const fuente = estilos.value;
  cajaPreview.style.fontFamily = fuente;
});

// Selector de tamaño
tamaño.addEventListener('change', aplicarTamaño);


// ========== INICIALIZACIÓN ==========

if (colorSeleccionado) {
  aplicarColor(colorSeleccionado);
}

if (fondoSeleccionado) {
  aplicarFondo(fondoSeleccionado);
}

if (ubiSeleccionada) {
  aplicarUbicacion(ubiSeleccionada);
}

aplicarTamaño();