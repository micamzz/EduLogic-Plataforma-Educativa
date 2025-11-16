import { BuscadorElementos } from "./buscadorElementos.js";  

const BUSCADOR = new BuscadorElementos();


const popup = BUSCADOR.buscarUnElementoPorId('custom-popup');
const popupTitle = BUSCADOR.buscarUnElementoPorId('popup-title');
const popupMessage = BUSCADOR.buscarUnElementoPorId('popup-message');
const btnAceptar = BUSCADOR.buscarUnElementoPorId('btn-aceptar');
const btnCancelar = BUSCADOR.buscarUnElementoPorId('btn-cancelar'); 


let currentOnConfirmAction = null;



function inicializarPopupListeners() {
    if (!popup || !btnAceptar) return;

    //Al presionar aceptar
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
}


inicializarPopupListeners();


export function mostrarPopup(title, message, type = 'alert', onConfirm = () => {}) {
    if (!popup || !btnAceptar) {
        return;
    }

   
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    currentOnConfirmAction = onConfirm; 
    
    
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

    //Muestra pop-up
    popup.style.display = 'flex';
}