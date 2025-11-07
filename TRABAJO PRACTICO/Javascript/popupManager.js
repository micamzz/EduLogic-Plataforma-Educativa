

const popup = document.getElementById('custom-popup');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const btnAceptar = document.getElementById('btn-aceptar');
const btnCancelar = document.getElementById('btn-cancelar');


let currentOnConfirmAction = null;


function inicializarPopupListeners() {
    if (!popup || !btnAceptar) return;

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

    // Cerrar al hacer clic fuera del popup 
    popup.addEventListener("click", e => { 
        if (e.target === popup) popup.style.display = 'none'; 
    });
}


inicializarPopupListeners();


/**
 * Muestra el pop-up modal personalizado.
 * @param {string} title - El título del pop-up.
 * @param {string} message - El mensaje del cuerpo.
 * @param {'alert'|'confirm'} type - El tipo de pop-up (solo 'alert' para inicio/registro).
 * @param {function} onConfirm - Función a ejecutar al presionar Aceptar/OK.
 */
export function mostrarPopup(title, message, type = 'alert', onConfirm = () => {}) {
    if (!popup || !btnAceptar) {
       
        if (type === 'confirm') {
            window.confirm(message) && onConfirm();
        } else {
            window.alert(title + ': ' + message);
            onConfirm();
        }
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

   
    popup.style.display = 'flex';
}