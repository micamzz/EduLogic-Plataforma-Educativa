
import { BuscadorElementos } from "./buscadorElementos.js";  

const BUSCADOR = new BuscadorElementos();

let currentOnConfirmAction = null;
let listenersAttached = false; 

/**
 
 * @returns {object} 
 */
function getPopupElementsAndAttachListeners() {
    const popup = BUSCADOR.buscarUnElementoPorId('custom-popup');
    const popupTitle = BUSCADOR.buscarUnElementoPorId('popup-title');
    const popupMessage = BUSCADOR.buscarUnElementoPorId('popup-message');
    const btnAceptar = BUSCADOR.buscarUnElementoPorId('btn-aceptar');
    const btnCancelar = BUSCADOR.buscarUnElementoPorId('btn-cancelar'); 
    
    if (!popup || !btnAceptar || !popupTitle || !popupMessage) {
        return null; 
    }
    
    if (!listenersAttached) {
        
        btnAceptar.addEventListener('click', () => {
            popup.style.display = 'none';
            if (currentOnConfirmAction) {
                currentOnConfirmAction();
            }
        });

        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                popup.style.display = 'none';
            });
        }

        popup.addEventListener("click", e => { 
            if (e.target === popup) popup.style.display = 'none'; 
        });

        listenersAttached = true;
    }

    return { popup, popupTitle, popupMessage, btnAceptar, btnCancelar };
}



export function mostrarPopup(title, message, type = 'alert', onConfirm = () => {}) {
    
    const elements = getPopupElementsAndAttachListeners();

    if (!elements) {
        console.error("Fallo crítico: El Popup no pudo inicializarse. Faltan elementos en el DOM.");
        alert(title + ": " + message);
        return;
    }
    
    const { popup, popupTitle, popupMessage, btnAceptar, btnCancelar } = elements;


    popupTitle.textContent = title;
    popupMessage.textContent = message;
    currentOnConfirmAction = onConfirm;
    const isConfirm = type === 'confirm' && btnCancelar;
    
    if (isConfirm) {
        btnAceptar.textContent = 'Aceptar';
        if (btnCancelar) btnCancelar.style.display = 'inline-block'; 
        btnAceptar.classList.remove('full-width-btn');
    } else { 
        
        btnAceptar.textContent = 'OK';
        
        if (btnCancelar) btnCancelar.style.display = 'none'; 
        btnAceptar.classList.add('full-width-btn');
    }

 
    popup.style.display = 'flex';
}