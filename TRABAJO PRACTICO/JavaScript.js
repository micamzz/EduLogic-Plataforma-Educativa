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

  if (path.toLowerCase().includes('/index.html') || path === '/') {
    iniciarPaginaPrincipal();

  } else if (path.toLowerCase().includes('/registrarse.html')) {
    iniciarRegistroNormal();

  } else if (path.toLowerCase().includes('/registrarsePago.html')) {
    iniciarRegistroPago();

  } else if (path.toLowerCase().includes('/paginas/iniciosesion.html')) {
    iniciarLoginNormal();

  } else if (path.toLowerCase().includes('/inicioSesionPago.html')) {
    iniciarLoginPago();

  } else if (path.toLowerCase().includes('/perfil.html')) {
    iniciarLogicaPerfil();

  } else if (path.toLowerCase().includes('/calendario.html')) {
    if (typeof Calendario !== 'undefined' && Calendario.iniciar) {
      Calendario.iniciar(); 
    }

  } else if (path.toLowerCase().includes('/recuperarContra.html')) {
    iniciarLogicaRecuperacion();

  }  
  else if (path.toLowerCase().includes('/giftcard.html')) {
  GiftCard();
}
  
   // FORMULARIO DE CONTACTO
    formularioDeContacto();
 
  //  Importar popupManager solo si NO estamos en contacto
  if (!path.includes("/contacto.html")) {
    await import("./Javascript/popupManager.js"); 
    // Si la ruta actual contiene "contacto.html", se ejecuta la lógica del formulario:
 } else if (path.includes('/contacto.html')) {
  formularioDeContacto();
}

// FORMULARIO DE PAGO
if (path.includes("/formularioDePago.html")) {
  iniciarFormularioDePago();
  console.log({ form, nombre, email, numeroTarjeta, vencimiento, codigoSeguridad });

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