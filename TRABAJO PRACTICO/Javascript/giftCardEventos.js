import { mostrarPopup } from './popupManager.js'; 
import { agregarGiftCardAlCarrito } from './carritoDeCompras.js';
import { ValidadorFormulario } from "./validarFormulario.js";
import { BuscadorElementos } from "./buscadorElementos.js";

const buscador = new BuscadorElementos();

const radiosColor = buscador.buscarVariosElementos('input[name="color_estilo"]');
const colorSeleccionado = buscador.buscarUnElemento('input[name="color_estilo"]:checked');
const listaFondos = buscador.buscarVariosElementos('input[name="Fondo"]');
const fondoSeleccionado = buscador.buscarUnElemento('input[name="Fondo"]:checked');
const montoUbis = buscador.buscarVariosElementos('input[name="Ubicacion"]');
const ubiSeleccionada = buscador.buscarUnElemento('input[name="Ubicacion"]:checked');
const mensaje = buscador.buscarUnElemento('.Box_Preview .Mensaje');
const montoVista = buscador.buscarUnElemento('.Box_Preview .Monto');
const desti1 = buscador.buscarUnElemento('.Box_Preview .Destinatario');
const desti2 = buscador.buscarUnElemento('.Box_Preview .Destinatario2');
const cajaPreview = buscador.buscarUnElemento('.Cuadro_Preview');
const destinatario = buscador.buscarUnElemento('input[name="destinatario"]');
const montoIngresado = buscador.buscarUnElemento('input[name="monto"]');
const estilos = buscador.buscarUnElementoPorId('styleSelect');
const tamaño = buscador.buscarUnElementoPorId('style_size');
const formularioGift = buscador.buscarUnElementoPorId('formGiftCard');


export function GiftCard() {

  // ====== FUNCIONES DE ESTILO ======
  function aplicarColor(radio) {
    if (radio.checked) {
      mensaje.style.color = radio.value;
      montoVista.style.color = radio.value;
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
      montoVista.style.gridColumn = ubi.dataset.columna;
      montoVista.style.gridRow = ubi.dataset.fila;
      montoVista.style.justifySelf = ubi.dataset.hori;
      montoVista.style.alignSelf = ubi.dataset.verti;
    }
  }

  function aplicarTamaño() {
    const size = tamaño.value + 'px';
    mensaje.style.fontSize = size;
    montoVista.style.fontSize = size;
    desti1.style.fontSize = size;
    desti2.style.fontSize = size;
  }

  // ====== EVENTOS ======
  radiosColor.forEach((radio) => radio.addEventListener('change', () => aplicarColor(radio)));
  listaFondos.forEach((fondo) => fondo.addEventListener('change', () => aplicarFondo(fondo)));
  montoUbis.forEach((ubi) => ubi.addEventListener('change', () => aplicarUbicacion(ubi)));

  destinatario.addEventListener('input', () => { desti2.textContent = destinatario.value; });
  montoIngresado.addEventListener('input', () => { montoVista.textContent = montoIngresado.value + '$'; });

  mensaje.setAttribute('contenteditable', 'true');
  mensaje.addEventListener('focus', function borrarAlPrimerClick() {
    mensaje.textContent = '';
    mensaje.removeEventListener('focus', borrarAlPrimerClick);
  });

  estilos.addEventListener('change', () => { cajaPreview.style.fontFamily = estilos.value; });
  tamaño.addEventListener('change', aplicarTamaño);

  // ====== INICIALIZACIÓN ======
  if (colorSeleccionado) aplicarColor(colorSeleccionado);
  if (fondoSeleccionado) aplicarFondo(fondoSeleccionado);
  if (ubiSeleccionada) aplicarUbicacion(ubiSeleccionada);
  aplicarTamaño();

  // ====== FUNCIONALIDAD CARRITO ======
  if (!formularioGift) return;

  formularioGift.addEventListener("submit", (e) => {
    e.preventDefault();

    formularioGift.querySelectorAll(".error-mensaje").forEach(el => el.remove());
    formularioGift.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    const nombreInput = document.getElementById("destinatario");
    const emailInput = document.getElementById("email");
    const montoInput = document.getElementById("monto");

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const montoValor = montoInput.value.trim(); // ✅ Renombrado

    let formularioValido = true;

    // === VALIDAR NOMBRE ===
    if (!ValidadorFormulario.campoVacio(nombre)) {
      mostrarError(nombreInput, ValidadorFormulario.MENSAJES.nombreVacio2);
      formularioValido = false;
    } else if (!ValidadorFormulario.longitudMinima(nombre, 3)) {
      mostrarError(nombreInput, ValidadorFormulario.MENSAJES.nombreCorto);
      formularioValido = false;
    }

    // === VALIDAR EMAIL ===
    if (!ValidadorFormulario.campoVacio(email)) {
      mostrarError(emailInput, "El campo email no puede estar vacío."); // ✅ Cambiado
      formularioValido = false;
    } else if (!ValidadorFormulario.emailValido(email)) {
      mostrarError(emailInput, ValidadorFormulario.MENSAJES.emailInvalido);
      formularioValido = false;
    }

    // === VALIDAR MONTO ===
    const precio = parseFloat(montoValor);
    if (isNaN(precio) || precio <= 0) {
      mostrarError(montoInput, "Por favor, ingresá un monto válido.");
      formularioValido = false;
    }

    if (!formularioValido) return;

    const fondoActual = document.querySelector('input[name="Fondo"]:checked');

    const giftCard = {
      id: "gift-" + Date.now(),
      titulo: `Gift Card para ${nombre}`,
      precio,
      imagen: fondoActual?.value || "../imagenes/giftcard.png",
      cantidad: 1,
      tipo: "giftcard",
      mensaje: mensaje.textContent || ""
    };

    agregarGiftCardAlCarrito(giftCard);

    formularioGift.reset();
    window.location.href = "../index.html"; 
  });

  function mostrarError(input, mensaje) {
    input.classList.add("input-error");
    const error = document.createElement("p");
    error.className = "error-mensaje";
    error.textContent = mensaje;
    input.insertAdjacentElement("afterend", error);
  }
}
