import { BuscadorElementos } from "./Javascript/buscadorElementos.js";
import { Calendario } from "./Javascript/calendario.js";
import { DetalleCursos } from "./Javascript/detalleCurso.js";
import { manejarVisualizacionHeader, manejarBusqueda } from './Javascript/header.js';
import { iniciarPaginaPrincipal } from './Javascript/index.js';
import { iniciarRegistroNormal } from './Javascript/registrarse.js';
import { iniciarLoginNormal } from './Javascript/inicioSesion.js';
import { iniciarLogicaPerfil } from './Javascript/perfil.js';
import { iniciarLogicaRecuperacion } from './Javascript/recuperarContra.js';
import { formularioDeContacto } from "./Javascript/contactoFormulario.js";
import { inicializarCarrito } from './Javascript/carritoDeCompras.js';
import { GiftCard } from './Javascript/giftCardEventos.js';
import { iniciarFormularioDePago } from "./Javascript/formularioPago.js";
import { iniciarLogicaInscripcion } from "./Javascript/inscripcionCurso.js";

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

  } else if (path.includes('registrarse')) {
    iniciarRegistroNormal();

  } else if (path.includes('iniciosesion')) {
    iniciarLoginNormal();

  } else if (path.includes('perfil')) {
    iniciarLogicaPerfil();

  } else if (path.includes('contacto')) {
    formularioDeContacto();

  } else if (path.includes('calendario')) {
    if (typeof Calendario !== 'undefined' && Calendario.iniciar) {
      Calendario.iniciar();
    }

  } else if (path.includes('recuperarcontra')) {
    iniciarLogicaRecuperacion();

  } else if (path.includes('giftcard')) {

    GiftCard();

  } else if (path.includes('formulariodepago')) {
    iniciarFormularioDePago();

  } else if (path.includes('inscripcioncurso')) {
    iniciarLogicaInscripcion();
  }


  if (!path.includes("contacto")) {
    await import("./Javascript/popupManager.js");
  }

  const iconoCarrito = document.querySelector('.carrito_icono');
  if (iconoCarrito) {
    inicializarCarrito();
  }


});