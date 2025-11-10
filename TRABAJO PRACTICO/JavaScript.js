import { BuscadorElementos } from "./Javascript/buscadorElementos.js";
import { Calendario } from "./Javascript/calendario.js";
import { DetalleCursos } from "./Javascript/detalleCurso.js";
import { manejarVisualizacionHeader, manejarBusqueda } from './Javascript/header.js';  
import { iniciarPaginaPrincipal } from './Javascript/index.js'; 
import { iniciarRegistroNormal, iniciarRegistroPago } from './Javascript/registrarse.js';
import { iniciarLoginNormal, iniciarLoginPago } from './Javascript/incioSesion.js';
import { iniciarLogicaPerfil } from './Javascript/perfil.js';
import { iniciarLogicaRecuperacion } from './Javascript/recuperarContra.js';
import { formularioDeContacto } from "./Javascript/contactoFormulario.js";
import { inicializarCarrito } from './Javascript/carritoDeCompras.js';
import {GiftCard} from './Javascript/giftCardEventos.js';
import { iniciarFormularioDePago } from "./Javascript/formularioPago.js";
const BUSCADOR = new BuscadorElementos();

document.addEventListener("DOMContentLoaded", async () => {

  // HEADER
  manejarVisualizacionHeader();
  manejarBusqueda();

  // DETALLE DE LOS CURSOS 
  const contenedorDetalle = BUSCADOR.buscarUnElementoPorId("js-curso-detalle");
  if (contenedorDetalle) {
    DetalleCursos.mostrarDetalleDeCurso();
  }

  // CALENDARIO 
  const calendarioContenedor = BUSCADOR.buscarUnElementoPorId("js-calendario");
  if (calendarioContenedor && typeof Calendario !== "undefined") {
    Calendario.iniciar();
  }


const path = window.location.pathname.toLowerCase();

  if (path.includes('/index.html') || path === '/') {
  iniciarPaginaPrincipal();

} else if (path.includes('/registrarse.html')) {
  iniciarRegistroNormal();

} else if (path.includes('/registrarsepago.html')) {
  iniciarRegistroPago();

} else if (path.includes('/iniciosesion.html')) {
  iniciarLoginNormal();

} else if (path.includes('/iniciosesionpago.html')) {
  iniciarLoginPago();

} else if (path.includes('/perfil.html')) {
  iniciarLogicaPerfil();

} else if (path.includes('/calendario.html')) {
  if (typeof Calendario !== 'undefined' && Calendario.iniciar) {
    Calendario.iniciar(); 
  }

} else if (path.includes('/recuperarcontra.html')) {
  iniciarLogicaRecuperacion();

} else if (path.includes('/formulariodepago.html')) {
  console.log('💳 Inicializando formulario de pago...');
  iniciarFormularioDePago();

} else if (path.includes('/giftcard.html')) {
  console.log('🎁 Inicializando GiftCard...');
  GiftCard();

} else if (path.includes('/contacto.html')) {
  console.log('📞 Inicializando formulario de contacto...');
  formularioDeContacto();
}

// Importar popupManager solo si NO estamos en contacto
if (!path.includes("/contacto.html")) {
  await import("./Javascript/popupManager.js"); 
}
    // Si la ruta actual contiene "contacto.html", se ejecuta la lógica del formulario:
  }

const iconoCarrito = document.querySelector('.carrito_icono');

if (iconoCarrito) {
  inicializarCarrito();
}
  
// const carritoIcono = BUSCADOR.buscarUnElemento(".carrito_icono");

// if (carritoIcono) {
//   carritoIcono.addEventListener("click", (e) => {
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

//     if (!isLoggedIn) {
//       e.preventDefault(); // Evita que abra el menú del carrito
//       window.location.href = "../paginas/inicioSesion.html";
//     }
//   });
// }

});