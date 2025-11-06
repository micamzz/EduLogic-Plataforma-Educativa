

import { Calendario } from "./Javascript/calendario.js";
import { manejarVisualizacionHeader, manejarBusqueda } from './Javascript/header.js';  
import { iniciarPaginaPrincipal } from './Javascript/index.js'; 
import { iniciarRegistroNormal, iniciarRegistroPago } from './Javascript/registrarse.js';
import { iniciarLoginNormal, iniciarLoginPago } from './Javascript/incioSesion.js';
import { iniciarLogicaPerfil } from './Javascript/perfil.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZACIONES GLOBALES (Se ejecutan en todas las páginas)
    manejarVisualizacionHeader();
    manejarBusqueda();
    
    // 2. LÓGICA DE RUTEO (Ejecuta la función específica de la página)
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
        // Aseguramos que Calendario esté disponible
        if (typeof Calendario !== 'undefined' && Calendario.iniciar) {
             Calendario.iniciar(); 
        }
    }
});