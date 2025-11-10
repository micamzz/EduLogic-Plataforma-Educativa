import { mostrarPopup } from './popupManager.js'; 

function obtenerReferenciasDOM() {
  return {
    radiosColor: document.querySelectorAll('input[name="color_estilo"]'),
    colorSeleccionado: document.querySelector('input[name="color_estilo"]:checked'),
    listaFondos: document.querySelectorAll('input[name="Fondo"]'),
    fondoSeleccionado: document.querySelector('input[name="Fondo"]:checked'),
    montoUbis: document.querySelectorAll('input[name="Ubicacion"]'),
    ubiSeleccionada: document.querySelector('input[name="Ubicacion"]:checked'),
    mensaje: document.querySelector('.Box_Preview .Mensaje'),
    monto: document.querySelector('.Box_Preview .Monto'),
    desti1: document.querySelector('.Box_Preview .Destinatario'),
    desti2: document.querySelector('.Box_Preview .Destinatario2'),
    cajaPreview: document.querySelector('.Cuadro_Preview'),
    destinatario: document.querySelector('input[name="destinatario"]'),
    montoIngresado: document.querySelector('input[name="monto"]'),
    estilos: document.getElementById('styleSelect'),
    tamaño: document.getElementById('style_size')
  };
}

export function GiftCard() {
const {
    radiosColor,
    colorSeleccionado,
    listaFondos,
    fondoSeleccionado,
    montoUbis,
    ubiSeleccionada,
    mensaje,
    monto,
    desti1,
    desti2,
    cajaPreview,
    destinatario,
    montoIngresado,
    estilos,
    tamaño
  } = obtenerReferenciasDOM();
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

// ======== CARRITO ============

const formularioGift = document.getElementById('formGiftCard');

if (formularioGift) {
  formularioGift.addEventListener('submit', (e) => {
    e.preventDefault();

    const montoValor = parseFloat(montoIngresado.value);
    const nombreDestinatario = destinatario.value.trim();

    if (isNaN(montoValor) || montoValor <= 0) {
      mostrarPopup("Monto inválido", "Por favor, ingresá un monto válido para la gift card.", "alert");
      return;
    }

    const giftCard = {
      id: "gift-" + Date.now(),
      titulo: `Gift Card para ${nombreDestinatario}`,
      precio: montoValor,
      imagen: fondoSeleccionado ? fondoSeleccionado.value : "../imagenes/giftcard.png",
      cantidad: 1,
      destinatario: nombreDestinatario,
      mensaje: mensaje.textContent || "",
      tipo: "giftcard"
    };

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(giftCard);
    localStorage.setItem("carrito", JSON.stringify(carrito));

      mostrarPopup("Éxito", "🎁 Gift Card agregada al carrito!", "alert", () => {
      formularioGift.reset(); 
      window.location.href = "../index.html";
    });
  });
}


}

