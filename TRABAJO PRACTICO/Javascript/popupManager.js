// Archivo: Javascript/popupManager.js

// Referencias a los elementos del pop-up (deben existir en el HTML que lo use)
const popup = document.getElementById('custom-popup');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const btnAceptar = document.getElementById('btn-aceptar');
const btnCancelar = document.getElementById('btn-cancelar'); // Puede ser null en páginas que solo tienen 'alert'

// Variable para almacenar la función a ejecutar al confirmar (la acción)
let currentOnConfirmAction = null;


// Función para inicializar los listeners del popup (solo se llama una vez)
function inicializarPopupListeners() {
    if (!popup || !btnAceptar) return;

    // Al presionar ACEPTAR/OK
    btnAceptar.addEventListener('click', () => {
        popup.style.display = 'none';
        if (currentOnConfirmAction) {
            currentOnConfirmAction(); // Ejecutar la acción guardada
        }
    });

    // Al presionar CANCELAR (solo si existe)
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            popup.style.display = 'none';
            // Simplemente se cierra el pop-up
        });
    }

    // Cerrar al hacer clic fuera del popup (fondo)
    popup.addEventListener("click", e => { 
        if (e.target === popup) popup.style.display = 'none'; 
    });
}

// Inicializar los listeners tan pronto como se cargue el módulo
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
        // Fallback para navegadores o errores de DOM
        if (type === 'confirm') {
            window.confirm(message) && onConfirm();
        } else {
            window.alert(title + ': ' + message);
            onConfirm();
        }
        return;
    }

    // 1 Configurar contenido y acción
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    currentOnConfirmAction = onConfirm;
    
    // 2 Configurar botones según el tipo
    const isConfirm = type === 'confirm' && btnCancelar;
    
    if (isConfirm) {
        btnAceptar.textContent = 'Aceptar';
        btnCancelar.style.display = 'inline-block'; 
        btnAceptar.classList.remove('full-width-btn');
    } else { // type === 'alert' o si no existe btnCancelar
        btnAceptar.textContent = 'OK';
        // Ocultar cancelar si existe, o asegurarse que no se muestre si no existe
        if (btnCancelar) btnCancelar.style.display = 'none'; 
        
        btnAceptar.classList.add('full-width-btn');
    }

    // 3 Mostrar pop-up
    popup.style.display = 'flex';
}