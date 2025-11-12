import { BuscadorElementos } from "./buscadorElementos.js";  

const BUSCADOR = new BuscadorElementos();

//Referencias a los elementos del popup (deben existir en el html que lo use)
const popup = BUSCADOR.buscarUnElementoPorId('custom-popup');
const popupTitle = BUSCADOR.buscarUnElementoPorId('popup-title');
const popupMessage = BUSCADOR.buscarUnElementoPorId('popup-message');
const btnAceptar = BUSCADOR.buscarUnElementoPorId('btn-aceptar');
const btnCancelar = BUSCADOR.buscarUnElementoPorId('btn-cancelar'); 

//Variable para almacenar la función a ejecutar al confirmar
let currentOnConfirmAction = null;


//funcion para inicializar los listeners del popup 
function inicializarPopupListeners() {
    if (!popup || !btnAceptar) return;

    //Al presionar ok
    btnAceptar.addEventListener('click', () => {
        popup.style.display = 'none';
        if (currentOnConfirmAction) {
            currentOnConfirmAction(); // Ejecutar la acción guardada
        }
    });

    //al presionar cancelar (si existe el botón)
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            popup.style.display = 'none';
            //se cierra el pop-up
        });
    }

    // Cerrar al hacer clic fuera del popup
    popup.addEventListener("click", e => { 
        if (e.target === popup) popup.style.display = 'none'; 
    });
}

// Inicializar los listeners tan pronto como se cargue popup
inicializarPopupListeners();

// Función para mostrar el popup
export function mostrarPopup(title, message, type = 'alert', onConfirm = () => {}) {
    if (!popup || !btnAceptar) {
        return;
    }

    //Configurar contenido y acción
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    currentOnConfirmAction = onConfirm;
    
    //Configurar botones s/el tipo
    const isConfirm = type === 'confirm' && btnCancelar;
    
    if (isConfirm) {
        btnAceptar.textContent = 'Aceptar';
        btnCancelar.style.display = 'inline-block'; 
        btnAceptar.classList.remove('full-width-btn');
    } else { 
        btnAceptar.textContent = 'OK';
        if (btnCancelar) btnCancelar.style.display = 'none'; 
        
        btnAceptar.classList.add('full-width-btn');
    }

    //Mostrar pop-up
    popup.style.display = 'flex';
}