import { mostrarPopup } from './popupManager.js'; 
import { agregarGiftCardAlCarrito } from './carritoDeCompras.js';

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
    tamaño: document.getElementById('style_size'),
    formularioGift: document.getElementById('formGiftCard')
  };
}

//exporta referencias
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
    tamaño,
    formularioGift
  } = obtenerReferenciasDOM();

  //FUNCIONES DE ESTILO
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

  //  EVENTOS 
  radiosColor.forEach((radio) => radio.addEventListener('change', () => aplicarColor(radio)));
  listaFondos.forEach((fondo) => fondo.addEventListener('change', () => aplicarFondo(fondo)));
  montoUbis.forEach((ubi) => ubi.addEventListener('change', () => aplicarUbicacion(ubi)));

  destinatario.addEventListener('input', () => { desti2.textContent = destinatario.value; });
  montoIngresado.addEventListener('input', () => { monto.textContent = montoIngresado.value + '$'; });

  mensaje.setAttribute('contenteditable', 'true');
  mensaje.addEventListener('focus', function borrarAlPrimerClick() {
    mensaje.textContent = '';
    mensaje.removeEventListener('focus', borrarAlPrimerClick);
  });

  estilos.addEventListener('change', () => { cajaPreview.style.fontFamily = estilos.value; });
  tamaño.addEventListener('change', aplicarTamaño);

  //INICIALIZACION
  if (colorSeleccionado) aplicarColor(colorSeleccionado);
  if (fondoSeleccionado) aplicarFondo(fondoSeleccionado);
  if (ubiSeleccionada) aplicarUbicacion(ubiSeleccionada);
  aplicarTamaño();

  //FUNCIONALIDAD CARRITO
  if (!formularioGift) return;

 formularioGift.addEventListener("submit", (e) => {
  e.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn || !currentUser?.email) {
    localStorage.setItem("redirectAfterLogin", "../paginas/giftCard.html");
    window.location.href = "../paginas/inicioSesion.html";
    return;
  }

  const precio = parseFloat(montoIngresado.value);
  if (isNaN(precio) || precio <= 0) {
    mostrarPopup("Monto inválido", "Por favor, ingresá un monto válido.", "alert");
    return;
  }

  //OBTENER EL FONDO ACTUAL EN EL MOMENTO DEL SUBMIT
  const fondoActual = document.querySelector('input[name="Fondo"]:checked');
  
  const giftCard = {
    id: "gift-" + Date.now(),
    titulo: `Gift Card para ${destinatario.value || "Destinatario"}`,
    precio,
    imagen: fondoActual?.value || "../imagenes/giftcard.png", //Usa fondoActual
    cantidad: 1,
    tipo: "giftcard",
    mensaje: mensaje.textContent || ""
  };

 

  agregarGiftCardAlCarrito(giftCard);

  mostrarPopup("Éxito", "🎁 Gift Card agregada al carrito!", "alert", () => {
    formularioGift.reset();
    window.location.href = "../index.html"; 
  });
});
  }
