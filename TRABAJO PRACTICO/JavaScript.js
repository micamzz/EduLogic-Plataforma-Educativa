
import { BuscadorElementos } from "./Javascript/buscadorElementos.js";
import { Calendario } from "./Javascript/calendario.js";
import { DetalleCursos } from "./Javascript/detalleCurso.js";
import { manejarVisualizacionHeader, manejarBusqueda } from './Javascript/header.js';  
import { iniciarPaginaPrincipal } from './Javascript/index.js'; 
import { iniciarRegistroNormal, iniciarRegistroPago } from './Javascript/registrarse.js';
import { iniciarLoginNormal, iniciarLoginPago } from './Javascript/incioSesion.js';
import { iniciarLogicaPerfil } from './Javascript/perfil.js';
import { formularioDeContacto } from "./Javascript/contactoFormulario.js";


const BUSCADOR = new BuscadorElementos();

document.addEventListener("DOMContentLoaded", () => {

// HEADER
  manejarVisualizacionHeader();
  manejarBusqueda();

  //  DETALLE DE LOS CURSOS 
  const contenedorDetalle = BUSCADOR.buscarUnElementoPorId("js-curso-detalle");
  if (contenedorDetalle) {
    DetalleCursos.mostrarDetalleDeCurso();
  }

  // CALENDARIO 
  const calendarioContenedor = BUSCADOR.buscarUnElementoPorId("js-calendario");
  if (calendarioContenedor && typeof Calendario !== "undefined") {
    Calendario.iniciar();
  }

  // --- LÓGICA DE RUTEO SEGÚN LA PÁGINA ---
  const path = window.location.pathname;

  if (path.includes('/index.html') || path === '/') {
    iniciarPaginaPrincipal();

  } else if (path.includes('/registrarse.html')) {
    iniciarRegistroNormal();

  } else if (path.includes('/registrarsePago.html')) {
    iniciarRegistroPago();

  } else if (path.includes('/inicioSesion.html')) {
    iniciarLoginNormal();

  } else if (path.includes('/inicioSesionPago.html')) {
    iniciarLoginPago();

  } else if (path.includes('/perfil.html')) {
    iniciarLogicaPerfil();

  } else if (path.includes('/calendario.html')) {
    if (typeof Calendario !== 'undefined' && Calendario.iniciar) {
      Calendario.iniciar(); 
    }

  // Si la ruta actual contiene "contacto.html", se ejecuta la lógica del formulario:
  } else if (path.includes('/contacto.html')) {
    formularioDeContacto(); // ✅ LLAMADA A LA FUNCIÓN DEL FORMULARIO
  }
});
