
import { BuscadorElementos } from "./Javascript/buscadorElementos.js";
import { Calendario } from "./Javascript/calendario.js";
import { DetalleCursos } from "./Javascript/detalleCurso.js";
import { manejarVisualizacionHeader, manejarBusqueda } from './Javascript/header.js';  
import { iniciarPaginaPrincipal } from './Javascript/index.js'; 
import { iniciarRegistro } from './Javascript/registrarse.js'; 
import { iniciarLogin } from './Javascript/incioSesion.js'; 
import { iniciarLogicaPerfil } from './Javascript/perfil.js';
import { iniciarLogicaRecuperacion } from './Javascript/recuperarContra.js';
import { formularioDeContacto } from "./Javascript/contactoFormulario.js";
import { inicializarCarrito } from './Javascript/carritoDeCompras.js';



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


  const path = window.location.pathname;

  if (path.includes('/index.html') || path === '/') {
    iniciarPaginaPrincipal();

  } else if (path.includes('/registrarse.html')) {
    iniciarRegistro(); 

  } else if (path.includes('/inicioSesion.html')) {
    iniciarLogin(); 

  } else if (path.includes('/perfil.html')) {
    iniciarLogicaPerfil();

  } else if (path.includes('/calendario.html')) {
    if (typeof Calendario !== 'undefined' && Calendario.iniciar) {
      Calendario.iniciar(); 
    }

  } else if (path.includes('/recuperarContra.html')) {
    iniciarLogicaRecuperacion();

  }  
   
  if (path.includes("/contacto.html")) {
    formularioDeContacto();
  }

  inicializarCarrito();
});