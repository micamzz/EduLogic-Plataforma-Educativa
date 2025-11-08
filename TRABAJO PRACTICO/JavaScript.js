import { BuscadorElementos } from "./Javascript/buscadorElementos.js";
import { Calendario } from "./Javascript/calendario.js";
import { DetalleCursos } from "./Javascript/detalleCurso.js";
import { manejarVisualizacionHeader, manejarBusqueda } from './Javascript/header.js';  
import { iniciarPaginaPrincipal } from './Javascript/index.js'; 
import { iniciarRegistro } from './Javascript/registrarse.js'; // Importación única
import { iniciarLogin } from './Javascript/incioSesion.js'; // Importación única
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
    iniciarRegistro(); // Llamada única para la única página de registro

  } else if (path.includes('/inicioSesion.html')) {
    iniciarLogin(); // Llamada única para la única página de login

  } else if (path.includes('/perfil.html')) {
    iniciarLogicaPerfil();

  } else if (path.includes('/calendario.html')) {
    if (typeof Calendario !== 'undefined' && Calendario.iniciar) {
      Calendario.iniciar(); 
    }

  } else if (path.includes('/recuperarContra.html')) {
    iniciarLogicaRecuperacion();

  }  
   // FORMULARIO DE CONTACTO
  if (path.includes("/contacto.html")) {
    formularioDeContacto();
  }

  //  Importar popupManager solo si NO estamos en contacto
  if (!path.includes("/contacto.html")) {
    await import("./Javascript/popupManager.js");
  }


  inicializarCarrito();
  
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